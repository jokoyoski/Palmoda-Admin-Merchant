import React from 'react'
import DashboardGrid from './_components/DashboardGrid'
import DashboardStatsGrid from './_components/DashboardStatsGrid'
import VendorsSection from './_components/VendorsSection'
import ProtectedRoute from "./_components/ProtectedRoute";

function page() {
  return (
    <ProtectedRoute>
      <section className='bg-whitemin-h-screen px-4  md:px-8 py-6 w-full'>
      <div className='flex items-center justify-between'>
         <div>
          <h1 className='text-black font-bold text-xl'>Vendor Management Dashboard</h1>
        <p className='text-gray-500 text-[13px] my-2'>Comprehensive overview and management of vendor performance</p>
         </div>
         <div className='flex gap-3 items-center'>
        {/* <button
        className='bg-inherit border uppercase border-black text-black py-[5px] px-2.5 w-fit text-sm'
        >Review Queue</button>
        <button
        className='bg-black  text-white py-[5px] px-2.5 w-fit uppercase text-sm'
        >New Applications</button> */}
        </div>
      </div>
      <DashboardGrid />
      <DashboardStatsGrid />
      <VendorsSection />
    </section>
    </ProtectedRoute>
  )
}

export default page
