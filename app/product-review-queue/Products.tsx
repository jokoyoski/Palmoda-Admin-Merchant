import React from 'react'
import { CiUser } from 'react-icons/ci'
import img1 from "../../public/assets/acf62735-b103-4181-8e53-efa013a84b29.png"
import img2 from "../../public/assets/7c6f6e3f-9ad5-47d3-97f3-0e61978d84da.png"
import img3 from "../../public/assets/83ef0ffa-4ff6-4238-ae16-a52c665cb78a.png"
import img4 from "../../public/assets/c02bb544-697e-46df-8aea-0a70631e59b5.png"
import img5 from "../../public/assets/d4d4d3b5-8157-4cd7-bab4-d06e330430e1.png"
import Image from 'next/image'

function Products() {
  return (
    <section className='bg-white px-4 mt-3.5 py-3'>
      <div className='p-3 border border-gray-200'>
        {/* begining of flex div */}
        <div className='flex justify-between items-center'>
       <div className='flex items-center gap-2'>
        < CiUser className='text-black text-[25px]'/>
        <div>
          <h1 className='text-sm text-black font-semibold'>Elysian Threads</h1>
          <p className='text-gray-500 text-xs'>Submitted: May 12, 2023 • ID: #PRD-78945</p>
        </div>
       </div>
       <h3 className='text-black font-semibold text-xs'>Pending Review</h3>
      </div>
       {/* ending of flex div */}
       {/* begining of products details */}
       <div className='flex gap-4 mt-5'>
        {/* images */}
        <div className='flex flex-col gap-4 w-[250px]'>
          <Image src={img1} alt='' className='w-full h-[300px]' />
          <div className='grid grid-cols-4 gap-1'>
            <Image src={img2} alt='' className='h-[50px]'/>
            <Image src={img3} alt='' className='h-[50px]'/>
            <Image src={img4} alt='' className='h-[50px]'/>
            <Image src={img5} alt='' className='h-[50px]'/>
          </div>
        </div>
        {/* end of images */}
        {/* begining of description */}
        <div className='w-full'>
  <h1 className='text-sm font-semibold text-black'>
    Silk Serenity Blouse - Emerald Edition
  </h1>

  <div className='flex items-center gap-4 my-3.5'>
    <h3 className='text-xl font-semibold text-black'>$189.99</h3>
    <h4 className='text-gray-500 text-sm line-through'>$249.99</h4>
  </div>

  <div className='flex gap-12'>
    {/* PRODUCT DETAILS */}
    <div className='flex flex-col gap-3'>
      <h1 className='text-sm font-semibold text-black'>Product Details</h1>

      <p className='text-xs text-black flex gap-2'>
        <span className='font-semibold'>Category:</span> Women's Blouses
      </p>

      <p className='text-xs text-black flex gap-2'>
        <span className='font-semibold'>Color:</span> Emerald Green
      </p>

      <p className='text-xs text-black flex gap-2'>
        <span className='font-semibold'>Sizes:</span> XS, S, M, L, XL
      </p>

      <p className='text-xs text-black flex gap-2'>
        <span className='font-semibold'>Material:</span> 100% Mulberry Silk
      </p>

      <p className='text-xs text-black flex gap-2'>
        <span className='font-semibold'>Origin:</span> Italy
      </p>
    </div>

    {/* INVENTORY INFORMATION */}
    <div className='flex flex-col gap-3'>
      <h1 className='text-sm font-semibold text-black'>Inventory Information</h1>

      <p className='text-xs text-black flex gap-2'>
        <span className='font-semibold'>Stock:</span> 120 units
      </p>

      <p className='text-xs text-black flex gap-2'>
        <span className='font-semibold'>Shipping:</span> 2–3 business days
      </p>

      <p className='text-xs text-black flex gap-2'>
        <span className='font-semibold'>SKU:</span> ELY-SB-EM-2023
      </p>

      <p className='text-xs text-black flex gap-2'>
        <span className='font-semibold'>Margin:</span> 42%
      </p>

      <p className='text-xs text-black flex gap-2'>
        <span className='font-semibold'>Return Policy:</span> 30 days
      </p>
    </div>
  </div>

  {/* PRODUCT DESCRIPTION */}
  <div className='mt-6'>
    <h1 className='text-sm font-semibold text-black'>Product Description</h1>

    <p className='text-xs text-gray-600 leading-relaxed mt-2'>
      Elevate your wardrobe with our Silk Serenity Blouse in stunning Emerald Green.
      Crafted from 100% Mulberry Silk, this luxurious piece drapes beautifully and
      features elegant gold button details. The relaxed yet sophisticated silhouette
      makes it perfect for both office wear and evening occasions. The rich emerald hue
      complements all skin tones and pairs effortlessly with both neutral and bold
      pieces in your collection.
    </p>
  </div>

  <hr className='text-gray-200 my-6'/>
  {/* REVIEW NOTES */}
<div className='mt-8'>
  <h1 className='text-sm font-semibold text-black mb-2'>Review Notes</h1>

  <textarea
    placeholder='Add notes or feedback about this product submission...'
    className='w-full h-[120px] border border-gray-300 rounded-md text-xs p-3 focus:outline-none focus:ring-1 focus:ring-black resize-none'
  ></textarea>
</div>

{/* ACTION BUTTONS */}
<div className='flex  gap-3 mt-4'>
  
  <button className='px-5 py-2 text-xs font-semibold uppercase text-gray-700 border border-gray-300  hover:bg-gray-100'>
    Flag for Review
  </button>

  

  <button className='px-5 py-2 text-xs font-semibold uppercase
   bg-red-600 border border-red-400 text-white'>
    Reject
  </button>

  <button className='px-5 py-2 text-xs font-semibold uppercase text-gray-700 border border-gray-300  hover:bg-gray-100'>
    Request Correction
  </button>

  <button className='px-5 py-2 text-xs font-semibold uppercase text-white bg-black hover:bg-gray-800'>
    Approve
  </button>
</div>

</div>

        {/* ending of description */}
        
       </div>
       {/* ending of profuct details */}
      </div>
    </section>
  )
}

export default Products
