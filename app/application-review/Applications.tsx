import React from 'react'
import { CiUser } from 'react-icons/ci'
import img1 from "../../public/assets/7cd89eaf-57d4-4773-8b5f-0fdce72ef1a5.png"
import img2 from "../../public/assets/b425334f-061c-49bb-b33a-ab716b862a67.png"
import img3 from "../../public/assets/da818fa8-25f0-44c6-9620-eaf3e46b4bba.png"
import Image from 'next/image'

function Applications() {
    const images = [
        {
            pic: img1,
            text: "Evening Gown",
            price: "€1,250"
        },
        {
            pic: img2,
            text: "Evening Gown",
            price: "€1,250"
        },
        {
            pic: img3,
            text: "Evening Gown",
            price: "€1,250"
        },
    ]
  return (
    <section>
      {/* begining of application */}
      <div className='border my-5 border-gray-200'>
        <div className='flex items-center justify-between px-3 py-2'>
          <h1 className='text-black font-semibold text-sm'>Application Details: <span className='text-red-700 text-xs uppercase ml-5'>Urgent</span></h1>
        <div className='flex items-center gap-2'>
           <p className='text-gray-500 text-xs'>ID: VND-2023-8752</p>
           <p className='text-gray-500 text-xs'>Submitted: Oct 12, 2023</p>
        </div>
        </div>
        <hr className='text-gray-200 mt-1 mb-2'/>

        <div className='flex gap-4 px-4 py-2'>
         <div className='border border-gray-200 py-3 px-4 w-[300px] flex flex-col gap-3.5'>
            <h1 className='text-black text-sm font-semibold'>Brand Information</h1>
            <div className='flex items-center gap-3'>
              <CiUser className='text-black text-[25px]'/>
              <div>
                <h1 className='text-black text-sm font-semibold mb-0.5'>Elegance Atelier</h1>
                <p className='text-gray-500 text-xs mb-0.5'>Luxury Women's Fashion</p>
                <p className='text-gray-500 text-xs mb-0.5'>Paris, France</p>
              </div>
            </div>

            <div className='flex flex-col gap-px'>
                <p className='text-gray-500 text-xs mb-0.5'>Business Type</p>
                <h2 className='text-black text-sm'>Limited Liability Company</h2>
            </div>

            <div className='flex flex-col gap-px'>
                <p className='text-gray-500 text-xs mb-0.5'>Year Founded</p>
                <h2 className='text-black text-sm'>2018</h2>
            </div>

            <div className='flex flex-col gap-px'>
                <p className='text-gray-500 text-xs mb-0.5'>Annual Revenue</p>
                <h2 className='text-black text-sm'>€2.5M - €5M</h2>
            </div>

            <div className='flex flex-col gap-1px'>
                <p className='text-gray-500 text-xs mb-0.5'>Website</p>
                <h2 className='text-black text-sm'>www.eleganceatelier.com</h2>
            </div>
         </div>
         <div className='w-full flex flex-col gap-3.5'>

            <div className='border border-gray-200 py-2 px-4'>
               <h1 className='text-black font-semibold text-sm'>Contact Information</h1>
               <div className='flex gap-12 my-4'>
                 <div className='flex-col gap-1'>
                   <p className='text-gray-500 text-xs'>Primary Contact</p>
                   <h1 className='text-black text-sm font-semibold'>Isabelle Moreau</h1>
                   <p className='text-gray-500 text-sm'>Founder & Creative Director</p>
                 </div>
                 <div className='flex-col gap-1'>
                   <p className='text-gray-500 text-xs'>Email Address</p>
                   <h1 className='text-black text-sm'>isabelle@eleganceatelier.com</h1>
                 </div>
               </div>

               <div className='flex gap-24 my-4'>
                 <div className='flex-col gap-1'>
                   <p className='text-gray-500 text-xs'>Phone Number</p>
                   <h1 className='text-black text-sm'>+33 1 42 68 53 91</h1>
                 </div>
                 <div className='flex-col gap-1'>
                   <p className='text-gray-500 text-xs'>Business Address</p>
                   <h1 className='text-black text-sm'>24 Rue du Faubourg Saint-Honoré, 75008 Paris, France</h1>
                 </div>
               </div>
            </div>

            <div className='border border-gray-200 py-2 px-4'>
                <h1 className='text-black font-semibold text-sm'>Product Information</h1>
                <div className='flex my-4 gap-8'>
                  {images.map((item, index) => (
                    <div className=''>
                       <Image src={item.pic} alt='' className='w-[100px] h-[100px] mb-2'/>
                       <p className='text-gray-500 text-xs'>{item.text}</p>
                       <p className='text-gray-500 text-xs'>{item.price}</p>
                    </div>
                  )
                  )}
                </div>
                <div className='mt-3'>
                  <h1 className='text-gray-500  text-sm mb-2'>Product Information</h1>
                  <div className='flex gap-2.5 text-gray-500  text-xs'>
                  <p>Women's Apparel</p>
                  <p>Evening Wear</p>
                  <p>Accessories</p>
                  <p>Luxury</p>
                  </div>
                </div>
            </div>

         </div>
        </div>
        
        <div className='flex gap-4 my-3'>
              <div className='flex flex-col gap-3 w-full'>
                <div className='border border-gray-200 '>
                  <div className='px-4 py-3 border-b border-gray-200'>
                    <h1 className='text-black font-semibold text-sm'>Documents Verification</h1>
                  </div>
                  <div className='grid grid-cols-2 gap-4 px-4 py-3'>
                      <div className='border border-gray-200 p-2'>
                          <div className='flex justify-between mb-3'>
                             <h1 className='text-black font-semibold text-sm'>Business Registration</h1>
                             <p className='text-green-600 uppercase text-xs'>Verfied</p>
                          </div>
                       <div className='ml-10'>
                           <p className='text-xs text-gray-500'>business_registration.pdf</p>
                           <p className='text-xs text-gray-500'>Uploaded Oct 10, 2023</p>
                       </div>
                       <button className='w-full my-3
                        px-4 py-2 uppercase text-xs text-gray-500 border border-gray-500 bg-inherit'>
                        View Document
                       </button>
                      </div>

                      <div className='border border-gray-200 p-2'>
                          <div className='flex justify-between mb-3'>
                             <h1 className='text-black font-semibold text-sm'>Business Registration</h1>
                             <p className='text-green-600 uppercase text-xs'>Verfied</p>
                          </div>
                       <div className='ml-10'>
                           <p className='text-xs text-gray-500'>business_registration.pdf</p>
                           <p className='text-xs text-gray-500'>Uploaded Oct 10, 2023</p>
                       </div>
                       <button className='w-full my-3
                        px-4 py-2 uppercase text-xs text-gray-500 border border-gray-500 bg-inherit'>
                        View Document
                       </button>
                      </div>

                      <div className='border border-gray-200 p-2'>
                          <div className='flex justify-between mb-3'>
                             <h1 className='text-black font-semibold text-sm'>Business Registration</h1>
                             <p className='text-green-600 uppercase text-xs'>Verfied</p>
                          </div>
                       <div className='ml-10'>
                           <p className='text-xs text-gray-500'>business_registration.pdf</p>
                           <p className='text-xs text-gray-500'>Uploaded Oct 10, 2023</p>
                       </div>
                       <button className='w-full my-3
                        px-4 py-2 uppercase text-xs text-gray-500 border border-gray-500 bg-inherit'>
                        View Document
                       </button>
                      </div>
                    </div>

                    <div className='border border-gray-200 '>
                  <div className='px-4 py-3 border-b border-gray-200'>
                    <h1 className='text-black font-semibold text-sm'>Notes & Communication</h1>
                  </div>
                  <div className='grid grid-cols-1 gap-4 px-4 py-3'>
                      <div className='border-b flex justify-between border-gray-200 p-2'>
                           <div className='flex gap-2'>
                             <CiUser className='text-black text-[25px]'/>
                             <div className='w-[350px]'>
                                <h1 className='text-black font-semibold text-sm'>Sarah Johnson  <span className='ml-5 text-gray-500 text-xs font-light'>Compliance Officer</span></h1>
                                 <p className='text-gray-500 text-xs'>Bank statements look good, but we need to verify the source of funding for their initial inventory. Please request additional documentation.</p>
                             </div>
                           </div>
                           <p className='text-gray-500 text-xs'>Oct 11, 2023 - 14:32</p>
                      </div>

                       <div className='border-b flex justify-between border-gray-200 p-2'>
                           <div className='flex gap-2'>
                             <CiUser className='text-black text-[25px]'/>
                             <div className='w-[350px]'>
                                <h1 className='text-black font-semibold text-sm'>Sarah Johnson  <span className='ml-5 text-gray-500 text-xs font-light'>Compliance Officer</span></h1>
                                 <p className='text-gray-500 text-xs'>Bank statements look good, but we need to verify the source of funding for their initial inventory. Please request additional documentation.</p>
                             </div>
                           </div>
                           <p className='text-gray-500 text-xs'>Oct 11, 2023 - 14:32</p>
                      </div>

                      <div className='flex items-center gap-3'>
                        <input type="text" placeholder='Add a note' className='w-[70%] text-xs text-gray-500 p-2 border border-gray-200' />
                        <button className='bg-black text-xs text-white p-2'>Add</button>
                      </div>
                    </div>
                    </div>

                    

                </div>
                
               

              </div>
               <div className='flex flex-col gap-4 w-[350px] '>
                    <div className='border border-gray-200 '>
    <h1 className='text-black font-semibold text-sm mb-3 border-b px-4 py-3 border-gray-200'>Verification Status</h1>

    {/* Status Item */}
   <div className='p-4'>
     <div className='flex justify-between items-center mb-3'>
      <p className='text-xs text-gray-700'>Business Registration</p>
      <p className='text-xs font-semibold text-green-600'>Complete</p>
    </div>
    <div className='w-full h-1 bg-gray-200 rounded-md mb-3'>
      <div className='h-full bg-green-600 w-full rounded-md'></div>
    </div>

    <div className='flex justify-between items-center mb-3'>
      <p className='text-xs text-gray-700'>Bank Information</p>
      <p className='text-xs font-semibold text-yellow-600'>In Progress</p>
    </div>
    <div className='w-full h-1 bg-gray-200 rounded-md mb-3'>
      <div className='h-full bg-yellow-500 w-[60%] rounded-md'></div>
    </div>

    <div className='flex justify-between items-center mb-3'>
      <p className='text-xs text-gray-700'>Identity Verification</p>
      <p className='text-xs font-semibold text-red-600'>Not Started</p>
    </div>
    <div className='w-full h-1 bg-gray-200 rounded-md mb-3'>
      <div className='h-full bg-red-600 w-[5%] rounded-md'></div>
    </div>

    <div className='flex justify-between items-center mb-3'>
      <p className='text-xs text-gray-700'>Product Compliance</p>
      <p className='text-xs font-semibold text-yellow-600'>In Progress</p>
    </div>
    <div className='w-full h-1 bg-gray-200 rounded-md mb-4'>
      <div className='h-full bg-yellow-500 w-[40%] rounded-md'></div>
    </div>

    {/* OVERALL PROGRESS */}
    <div className='mt-4'>
      <p className='text-xs text-gray-700 mb-2'>Overall Progress</p>
      <div className='w-full h-2 bg-gray-200 rounded-md'>
        <div className='h-full bg-yellow-500 w-[65%] rounded-md'></div>
      </div>
      <p className='text-right text-xs text-gray-700 mt-1'>65%</p>
    </div>
  </div>

                    <div>
   </div>
                        
                    </div>

                     <div className='border border-gray-200 '>
                    <h1 className='text-black font-semibold text-sm mb-3 border-b px-4 py-3 border-gray-200'>Risk Assessment</h1>
                    <div className='p-4'>
                         <div className='flex justify-between'>
                          <p className='text-gray-500 text-sm'>Risk Level</p>
                          <p className='text-yellow-500 text-xs'>Medium</p>
                         </div>
                         <ul className='text-gray-500 mt-3 flex flex-col gap-2 text-xs ml-5'>
                            <li>Established business (5+ years)</li>
                            <li>Verified business address</li>
                            <li>Tax ID confirmed</li>
                            <li>Missing identity verification</li>
                            <li>International business</li>
                         </ul>
                    </div>
                
                </div>

                <div className='border border-gray-200 '>
                    <h1 className='text-black font-semibold text-sm mb-3 border-b px-4 py-3
                     border-gray-200'>Decision</h1>
                    <div className='p-4 flex flex-col gap-2'>
                         <button className='w-full bg-black py-2 px-4 text-xs text-white'>Approve Application</button>
                         <button className='w-full bg-inherit py-2 px-4 text-xs border border-black text-black'>
                          Reject Application</button>
                         <button className='bg-gray-200 text-gray-600 text-xs py-2 px-4
                          '>Request More Information</button>

                          <div className='mt-4 flex flex-col gap-3'>
                             <h1 className='text-black font-semibold text-sm'>Add Decision Note</h1>
                             <textarea name="" id=""
                             className='border border-gray-200 px-4 py-2'
                             placeholder='Enter your decision here'></textarea>
                          </div>
                    </div>
                
                </div>


                </div>



               
         </div>
      </div>
      {/* ending of application */}
    </section>
  )
}

export default Applications
