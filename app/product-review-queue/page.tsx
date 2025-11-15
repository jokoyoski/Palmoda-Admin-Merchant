import React from 'react'
import Products from './Products'

function page() {
  return (
    <section className='bg-gray-100 min-h-screen px-4  md:px-8 py-6 w-full'>
      <div className='flex items-center justify-between'>
         <div>
          <h1 className='text-black font-bold text-xl'>Product Submission Review</h1>
          <p className='text-gray-500 text-xs'>Review and approve product submissions from vendors</p>
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
      <Products />
    </section>
  )
}

export default page
