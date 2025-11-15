import React from 'react'

function Page() {
  return (
    <div className="bg-white min-h-screen flex flex-col text-center text-black">
      {/* Top header */}
      <h1 className="text-[19px] uppercase mt-4">Palmoda</h1>

      {/* Centered button section */}
      <div className="flex flex-col flex-1 items-center justify-center gap-6">
            <h2 className='text-3xl text-gray-700 font-semibold'>Log in</h2>
        <div className='flex items-center justify-center gap-5 '>
            <button className="bg-black hidden md:block text-white text-[18px]  font-medium py-2 px-[8px]">
          Palmoda Dashboard
        </button>
        <button className="bg-black hidden md:block text-white text-[18px]  font-medium py-2 px-[8px]">
          Merchant Dashboard
        </button>
        </div>
      </div>
    </div>
  )
}

export default Page
