import React from 'react'
import { formatToLocalTime } from '../Services/weatherService'

function TimeLocation({weather: {dt, timezone, name, country}}) {
  return (
    <div>
      <div className='flex items-center justify-center my-6'>
        <p className='text-xl text-white font-extralight'>
            {formatToLocalTime(dt, timezone)}
            {console.log("timezne --> " ,dt)}
        </p>
      </div>

      <div className='flex itesm-center justify-center my-3'>
        <p className='text-xl text-white font-medium'>
            {`${name}, ${country}`}
        </p>
      </div>
    </div>
  )
}

export default TimeLocation
