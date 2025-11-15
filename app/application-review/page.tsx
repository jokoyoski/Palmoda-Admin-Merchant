import React from 'react'
import Applications from './Applications'

function page() {
  return (
    <section className='bg-white min-h-screen px-4  md:px-8 py-6 w-full'>
      <div className='flex items-center justify-between'>
         <div>
          <h1 className='text-black font-bold text-xl'>Vendor Applications Review</h1>
          <p className='text-gray-500 text-xs'>Review and process incoming vendor applications</p>
         </div>
         <div className='flex gap-3 items-center'>
        <button
        className='bg-inherit border  border-black text-black py-[5px] px-[10px] w-fit text-xs'
        >Filter Status</button>
         <button
        className='bg-inherit border border-black text-black py-[5px] px-[10px]
         w-fit text-xs'
        >Sort Date</button>
        </div>
      </div>
      <Applications />
    </section>
  )
}

export default page
