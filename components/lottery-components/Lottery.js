import Header from '../Header'
import { useState } from 'react'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import Marquee from 'react-fast-marquee'
import AdminControls from './AdminControls'
import Nav from '../Nav'
import { useContractRead, useAddress, useContractWrite, Web3Button } from "@thirdweb-dev/react";
import Image from 'next/image'
import TOKENABI from '../../config/TOKENABI.json'
import CountdownTimer from './CountdownTimer'
import { Tooltip } from '@nextui-org/react';
import { InformationCircleIcon } from '@heroicons/react/24/solid';


const Lottery = ({ name, admin, contract, token, tokenString, tContract, endTime }) => {
  const address = useAddress()
  const [quantity, setQuantity] = useState(1);
  const [allowance, setAllowance] = useState(0)

  const { data: expiration } = useContractRead(contract, "expiration")
  const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/bsc')
  const ethersContract = new ethers.Contract(tContract, TOKENABI, provider)

  const all = async() => {
    const x = await ethersContract.allowance(address, tokenString)
    const y = parseInt(x)/1E18
    setAllowance(y)
  }

  all()

  const { data: lotteryId } = useContractRead(contract, "lotteryID")
  const { data: prevWinner } = useContractRead(contract, "previousWinner")
  const { data: totalEntry } = useContractRead(contract, "totalEntries")
  const { data: fee } = useContractRead(contract, "fee")
  const { data: balance } = useContractRead(token, "balanceOf", address)
  const { data: userEntr } = useContractRead(contract, "userEntries", address)
  const { mutateAsync: BuyTickets, isLoadingBuy } = useContractWrite(contract, "BuyTickets")
  const { data: isActive, isLoading } = useContractRead(contract, "isActive")

  const { mutateAsync: approve } = useContractWrite(token, "approve")

  const callBuy = async () => {
    const notification = toast.loading("Buying tickets...");
    try {
      const data = await BuyTickets([[quantity]]);
      console.info("contract call successs", data);
      toast.success("Tickets purchased successfully", {
        id: notification,
      })
    } catch (err) {
      console.error("contract call failure", err);
      toast.error("Whops something went wrong!", {
        id: notification,
      })
    }
  }

  const totalPool = (parseInt(fee)/1E18) * parseInt(totalEntry)
  let first = prevWinner?.slice(0, 6)
  let secont = prevWinner?.slice(38, 42)
  const previousWinner = address == undefined ? 0 : (first + '...' + secont)

  const bb = async() => {
    let x = 0
    if(address != undefined) {
    x = await ethersContract.balanceOf(address)
    } else {
      x = 0
    }
   return x
  }
  (bb().then((res) => {
    document.getElementById('balance').innerHTML = (parseInt(res)/1E18).toFixed(2)
  }))
  const price = (parseInt(fee))/1E18

  const totalCost = price * quantity
  const userEntries = parseInt(userEntr)
  const allow =  parseInt(allowance) > totalCost ? false : true


  const lotteryOperator = admin

  const TooltipContent = () => {
    return (
        <p style={{
          wordWrap:'break-word',
          overflow:'scroll',
          textOverflow:'ellipsis',
          maxHeight:'15.6em',
          maxWidth: '12em',
          lineHeight:'1.8em'
        }}>
        <i>
        Please Note: Each 'HACT' balance on a staking page is separate to each collection, and that collections stake-to-win lottery. Alien Horror Apes HACT cannot be used for Project 333 Lotteries, and vice versa
        </i>
      </p>
    )
  }
  
  
    //if (!address) return <Login />
  
    return (
      <div className="bg-black min-h-screen flex flex-col">
        <Nav />
  
        <div className="flex-1">
  
        <Header name={`HAC ${name} LOTTERY`} />
        <Marquee className='bg-[#131212] p-5 mb-5' gradient={false} speed={100} >
          <div className='flex space-x-2 mx-10'>
            <h4 className='text-white font-bold'>Previous winner:&nbsp; {previousWinner}</h4>
          </div>
          </Marquee>
          {lotteryOperator === address && (
            <div className='flex justify-center'>
              <AdminControls contract={contract} />
              </div>
          )}
  
        <div className='space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5'>
          <div className='stats-container'>
            <h1 className='text-4xl text-white font-semibold text-center md:text-5xl'> The Next Draw </h1>
          <div className='flex justify-between p-2 space-x-2'>
            <div className='stats'>
              <h2 className='text-sm'>Total Entries</h2>
              <p className='text-xl extra font-semibold text-yellow-400'>{totalPool} HACT</p>
            </div>
            <div className='stats'>
              <h2 className='text-sm'>You Own</h2>
              <p className='text-xl extra font-semibold text-yellow-400 flex flex-row justify-center'><span id='balance'>{0} &nbsp;</span>&nbsp;HACT&nbsp;  <Tooltip placement='leftStart' content={ <TooltipContent /> } rounded contentColor="warning" color="invert"> <InformationCircleIcon className='w-6' /></Tooltip></p>
            </div>
          </div>
          {/*countdown Timer */}
          <div className='mt-5 mb-3'>
            <CountdownTimer endTime={endTime} />
          </div>
        </div>
  
        <div className='stats-container space-y-2'>
          <div className="stats-container">
            <div className='flex extra justify-between items-center text-white pb-2'>
              <h4 className='extra'>Price Per Entry</h4>
              <p className='extra'>{price} HACT</p>
            </div>
  
            <div className='flex items-center space-x-2 text-white bg-[#140f06] border-[#423929] border p-4'>
              <p className='extra'>ENTRIES</p>
              <input className='flex w-full bg-transparent text-right outline-none' type='number' onChange={e => setQuantity(Number(e.currentTarget.value))} />
            </div>
  
            <div className='space-y-2 mt-5'>
              <div className='flex items-center justify-between text-yellow-400 text-sm italic font-extrabold'>
                <p className='extra'>Total cost of entries</p>
                <p className='extra'>{totalCost} HACT</p>
              </div>
              <div className='flex items-center justify-between text-yellow-400 text-xs italic'>
                <p className='extra'>+ Network Fees</p>
                <p className='extra'>TBC</p>
              </div>
            </div>
            {isActive ?
              <>
            {allow ? 
                      <Web3Button
                      contractAddress={tContract}
                      contractAbi={TOKENABI}
                      action={(contract) =>
                        contract.call(
                          "approve",
                          "0x4d2Bfa7d1D13e6C13A08a92B32a238b2B6DFFE0E",
                          ethers.utils.parseUnits((10000).toString(), 'ether')
                        )
                      }
                    >
                      Approve to Enter
                    </Web3Button>
            :
            <button onClick={callBuy} className='mt-5 w-full bg-gradient-to-br from-[#F5A524] to-gray-600 px-10 py-5 rounded-md text-white shadow-xl disabled:from-gray-600 disabled:text-gray-100 disabled:to-gray-600 disabled:cursor-not-allowed'>Buy {quantity} tickets for {totalCost} HACT</button>
            }
            </>
            :
            <button disabled={true} className='mt-5 w-full bg-gradient-to-br from-[#F5A524] to-gray-600 px-10 py-5 rounded-md text-[#F5A524] shadow-xl disabled:from-gray-600 disabled:text-gray-100 disabled:to-gray-600 disabled:cursor-not-allowed'>Lottery Currently Closed</button>
          }
          </div>
  
          <div className='stats text-center'>
            <p className='text-lg extra mb-2'>You have {userEntries} entries in this draw </p>
          </div>
        </div>
        </div>
        </div>
        <div className='text-right items-end flex justify-end mt-6 mb-4'>
        <Image width={300} height={300} src='/chainlink.jpeg' />
        </div>
      </div>
    );
  }
  

export default Lottery