import React from 'react'
import VendorList from './VendorList'

function page() {
  return (
    <section className='bg-whitemin-h-screen px-4  md:px-8 py-6 w-full'>
      <div className='flex items-center justify-between'>
         <div>
          <h1 className='text-black font-bold text-xl'>Vendor List</h1>
         </div>
         <div className='flex gap-3 items-center'>
        <button
        className='bg-inherit border  border-black text-black py-[5px] px-[10px] w-fit text-xs'
        >Invite Vendor</button>
         <button
        className='bg-inherit border border-black text-black py-[5px] px-[10px]
         w-fit text-xs'
        >Export CSV</button>
        <button
        className='bg-inherit border border-black text-black py-[5px] px-[10px]
         w-fit text-xs'
        >Help</button>
        </div>
      </div>
      <VendorList />
    </section>
  )
}

export default page
