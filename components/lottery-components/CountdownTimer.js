import React from 'react'
import Countdown from 'react-countdown'

//new Date.now(expirstion * 1000)


const renderer = ({ hours, minutes, seconds, completed}) => {
    if(completed) {
        return(
            <div>
            <h2 className='text-white animate-bounce text-xl text-center'>
                Ticket Sales have now CLOSED for this draw
            </h2>
            <div className='flex space-x-6'>
                <div className='flex-1'>
                <div className='countdown'>0</div>
                <div className='countdown-label'>hours</div>
                </div>

                <div className='flex-1'>
                <div className='countdown'>0</div>
                <div className='countdown-label'>minutes</div>
                </div>

                <div className='flex-1'>
                <div className='countdown'>0</div>
                <div className='countdown-label'>seconds</div>
                </div>
            </div>
        </div>
        )
    } else {
        return(
            <div>
            <h3 className='text-white text-sm mb-2 italic'> Time Remaining</h3>
            <div className='flex space-x-6 text-center'>
                <div className='flex-1'>
                <div className='countdown'>{hours}</div>
                <div className='countdown-label'>hours</div>
                </div>

                <div className='flex-1'>
                <div className='countdown'>{minutes}</div>
                <div className='countdown-label'>minutes</div>
                </div>

                <div className='flex-1'>
                <div className='countdown'>{seconds}</div>
                <div className='countdown-label'>seconds</div>
                </div>
            </div>
        </div>
        )
    }
}

const CountdownTimer = ({endTime}) => {
  return (
    <div>
        <Countdown date={new Date('5th Jan, 2023') * 1000} renderer={renderer} />
    </div>
  )
}

export default CountdownTimer