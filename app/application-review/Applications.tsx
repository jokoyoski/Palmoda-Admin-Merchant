"use client"
import React, { useEffect, useState } from 'react'
import { CiUser } from 'react-icons/ci'
import img1 from "../../public/assets/7cd89eaf-57d4-4773-8b5f-0fdce72ef1a5.png"
import img2 from "../../public/assets/b425334f-061c-49bb-b33a-ab716b862a67.png"
import img3 from "../../public/assets/da818fa8-25f0-44c6-9620-eaf3e46b4bba.png"
import Image from 'next/image'
import { Vendor, KycCompliance, Product, VendorMessage } from "@/app/_lib/type";
import { verifyBankDetails, verifyBusiness, verifyVendorIdentity } from '../_lib/admin'
import { toast } from "react-toastify";
import Link from 'next/link'
import {getAllVendorMessages, sendMessage} from "../_lib/message"
import { useRouter } from 'next/navigation'



interface ApplicationsProps {
  vendor: Vendor | null;
  id: string;
  products: Product[];
}


function Applications({ vendor, id, products }: ApplicationsProps) {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  const [messages, setMessages] = useState<VendorMessage[]>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [message_type, setMessageType] = useState("text"); 
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
     const getMessages = async () => {
       try {
        setLoading(true);
                const res = await getAllVendorMessages(id);
                console.log(res.data);
                if (res?.data) {
                  setMessages(res.data);
                } else {
                  setError("No transaction found");
                }
       } catch (err: any) {
          setError(err.message);
       }finally{
        setLoading(false)
       }
     }
     getMessages();
  }, [id])

    // const images = [
    //     {
    //         pic: img1,
    //         text: "Evening Gown",
    //         price: "€1,250"
    //     },
    //     {
    //         pic: img2,
    //         text: "Evening Gown",
    //         price: "€1,250"
    //     },
    //     {
    //         pic: img3,
    //         text: "Evening Gown",
    //         price: "€1,250"
    //     },
    // ]

    

const documents: { label: string; key: keyof KycCompliance }[] = [
  {
    label: "Business Registration",
    key: "business_registration_document"
  },
  {
    label: "Valid Owner ID",
    key: "valid_owner_id"
  },
  {
    label: "Bank Statement",
    key: "bank_statement"
  }
];

const calcProgress = (fields: (string | undefined)[]) => {
  const total = fields.length;
  const filled = fields.filter(f => f && f.trim() !== "").length;
  return Math.round((filled / total) * 100);
};

const getStatus = (percent: number) => {
  if (percent === 100) return { label: "Complete", color: "text-green-600", bar: "bg-green-600" };
  if (percent > 0) return { label: "In Progress", color: "text-yellow-600", bar: "bg-yellow-500" };
  return { label: "Not Started", color: "text-red-600", bar: "bg-red-600" };
};


const businessProgress = calcProgress([
  vendor?.kyc_compliance?.business_registration_document,
  vendor?.kyc_compliance?.registration_number,
]);

const bankProgress = calcProgress([
  vendor?.kyc_compliance?.bank_name,
  vendor?.kyc_compliance?.account_holder_name,
  vendor?.kyc_compliance?.account_number,
  vendor?.kyc_compliance?.bank_statement,
]);

const identityProgress = calcProgress([
  vendor?.email,
  vendor?.contact_person_name,
  vendor?.phone_number,
]);

const overallProgress = Math.round(
  (businessProgress + bankProgress + identityProgress) / 3
);

const businessStatus = getStatus(businessProgress);
const bankStatus = getStatus(bankProgress);
const identityStatus = getStatus(identityProgress);
const overallStatus = getStatus(overallProgress);

const riskFactors = (vendor: any) => {
  const factors = [
    { label: "Established business (5+ years)", value: new Date().getFullYear() - new Date(vendor.created_at).getFullYear() > 5 },
    { label: "Verified business address", value: !!vendor.kyc_compliance?.address_line_one },
    { label: "Tax ID confirmed", value: !!vendor.kyc_compliance?.tax_identification_number },
    { label: "Missing identity verification", value: !vendor.is_identity_verified },
    { label: "International business", value: vendor.kyc_compliance?.country !== "Nigeria" }, // Adjust as needed
  ];

  // Count “true” for risk points
  const riskCount = factors.filter(f => f.value).length;

  // Determine risk level
  let riskLevel: "Low" | "Medium" | "High" = "Low";
  let colorClass = "text-green-500";

  if (riskCount >= 4) {
    riskLevel = "High";
    colorClass = "text-red-600";
  } else if (riskCount >= 2) {
    riskLevel = "Medium";
    colorClass = "text-yellow-500";
  }

  return { factors, riskLevel, colorClass };
};

const { factors, riskLevel, colorClass } = riskFactors(vendor);


const handleApprove = async () => {
  if (approving) return;
  setApproving(true);

  try {
    // Run all API calls in parallel
    const [businessRes, identityRes, bankRes] = await Promise.all([
      verifyBusiness(id),
      verifyVendorIdentity(id),
      verifyBankDetails(id),
    ]);

    // Show toast notifications for each
    toast.success(businessRes.message || "Business verified");
    toast.success(identityRes.message || "Identity verified");
    toast.success(bankRes.message || "Bank details verified");

    toast.success("Vendor approved successfully!");
    router.push("/vendor-management");
  } catch (error: any) {
    toast.error(error.message || "Something went wrong during approval");
  } finally {
    setApproving(false);
  }
};


const handleMessage = async () => {
  if (!content.trim()) {
    return toast.error("Message cannot be empty");
  }

  try {
    setSending(true);
    const res = await sendMessage(id, title, content, message_type);

    if (res?.success === false) {
      toast.error(res.message);
    } else {
      toast.success("Message sent successfully!");
      
      // Refresh messages list
      setMessages((prev) => [...prev, res.data]);
      
      setContent("");
    }

  } catch (error: any) {
    toast.error(error.message || "Failed to send message");
  } finally {
    setSending(false);
  }
};




  return (
    <section>
      {/* begining of application */}
      <div className='border my-5 border-gray-200'>
        <div className='flex items-center justify-between px-3 py-2'>
          <h1 className='text-black font-semibold text-sm'>Application Details:
            {vendor?.is_identity_verified ? 
             <span className=''>
              
              </span> : 
               <span className='text-red-700 text-xs uppercase ml-5'>
              Urgent
              </span>
              }
              </h1>
        <div className='flex items-center gap-2'>
           <p className='text-gray-500 text-xs'>ID: {vendor?._id}</p>
           <p className='text-gray-500 text-xs'>Submitted: {vendor?.created_at}</p>
        </div>
        </div>
        <hr className='text-gray-200 mt-1 mb-2'/>

        <div className='flex gap-4 px-4 py-2'>
         <div className='border border-gray-200 py-3 px-4 w-[300px] flex flex-col gap-3.5'>
            <h1 className='text-black text-sm font-semibold'>Brand Information</h1>
           <div className='flex gap-3'>
  {vendor?.brand?.brand_banner === "" ? (
    <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100">
      <CiUser className='text-black text-[22px]' />
    </div>
  ) : (
    <img
      src={vendor?.brand?.brand_banner}
      alt=""
      className="w-10 h-10 rounded-full border border-gray-300 object-cover"
    />
  )}

  <div>
    <h1 className='text-black text-sm font-semibold mb-0.5'>
      {vendor?.brand?.brand_name}
    </h1>
    <p className='text-gray-500 text-xs mb-0.5'>
      {vendor?.brand?.brand_description}
    </p>
    <p className='text-gray-500 text-xs mt-1.5 mb-0.5'>{vendor?.kyc_compliance?.city}</p>
  </div>
</div>


            <div className='flex flex-col gap-px'>
                <p className='text-gray-500 text-xs mb-0.5'>Business Type</p>
                <h2 className='text-black text-sm'>{vendor?.kyc_compliance?.business_type}</h2>
            </div>

            <div className='flex flex-col gap-px'>
                <p className='text-gray-500 text-xs mb-0.5'>Year Founded</p>
                <h2 className='text-black text-sm'>{vendor?.kyc_compliance?.created_at}</h2>
            </div>

            <div className='flex flex-col gap-px'>
                <p className='text-gray-500 text-xs mb-0.5'>Annual Revenue</p>
                <h2 className='text-black text-sm'>€2.5M - €5M</h2>
            </div>

            <div className='flex flex-col gap-1px'>
                <p className='text-gray-500 text-xs mb-0.5'>Website</p>
                <h2 className='text-black text-sm'>{vendor?.brand?.website_url}</h2>
            </div>
         </div>
         <div className='w-full flex flex-col gap-3.5'>

            <div className='border border-gray-200 py-2 px-4'>
               <h1 className='text-black font-semibold text-sm'>Contact Information</h1>
               <div className='flex gap-12 my-4'>
                 <div className='flex-col gap-1'>
                   <p className='text-gray-500 text-xs'>Primary Contact</p>
                   <h1 className='text-black text-sm font-semibold'>{vendor?.contact_person_name}</h1>
                   <p className='text-gray-500 text-sm'>Founder & Creative Director</p>
                 </div>
                 <div className='flex-col gap-1'>
                   <p className='text-gray-500 text-xs'>Email Address</p>
                   <h1 className='text-black text-sm'>{vendor?.email}</h1>
                 </div>
               </div>

               <div className='flex gap-24 my-4'>
                 <div className='flex-col gap-1'>
                   <p className='text-gray-500 text-xs'>Phone Number</p>
                   <h1 className='text-black text-sm'>{vendor?.phone_number}</h1>
                 </div>
                 <div className='flex-col gap-1'>
                   <p className='text-gray-500 text-xs'>Business Address</p>
                   <h1 className='text-black text-xs'>
                    {vendor?.kyc_compliance?.address_line_one}
                   <span className='ml-3'> {vendor?.kyc_compliance?.city}</span>
                   </h1>
                 </div>
               </div>
            </div>

            <div className='border border-gray-200 py-2 px-4'>
                <h1 className='text-black font-semibold text-sm'>Product Information</h1>
                <div className='flex my-4 gap-8'>
                  {products.length > 0 && products.map((item: Product, index: number) => (
  <div className='' key={index}>
     <img src={item.images[0]} alt={item.name} className='w-[100px] h-[100px] mb-2'/>
     <p className='text-gray-500 text-xs'>{item.name}</p>
     <p className='text-gray-500 text-xs'>€{item.discounted_price}</p>
  </div>
))}
    
                </div>
                {products.length > 0 && <Link href={`/product-review-queue/${id}`} className='
    text-xs font-semibold p-3 border -mt-5 mb-10 border-gray-200
    '>View All Products</Link>}
                
                <div className='mt-6'>
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
                     {documents.map((doc, index) => {
      const value = vendor?.kyc_compliance?.[doc.key];
      const isMissing = !value || value.trim() === "";

      return (
        <div key={index} className='border border-gray-200 p-2'>
          <div className='flex justify-between mb-3'>
            <h1 className='text-black font-semibold text-sm'>{doc.label}</h1>
            <p
              className={`uppercase text-xs ${
                isMissing ? "text-red-600" : "text-green-600"
              }`}
            >
              {isMissing ? "Missing" : "Verified"}
            </p>
          </div>

          <div className='ml-10'>
            <p className='text-xs text-gray-500'>
              {isMissing ? "No file uploaded" : doc.key}
            </p>
            {!isMissing && (
              <p className='text-xs text-gray-500'>Uploaded</p>
            )}
          </div>

          <button
            disabled={isMissing}
            onClick={() => !isMissing && setSelectedDoc(value)}
            className={`w-full my-3 px-4 py-2 uppercase text-xs border 
            ${isMissing
              ? "text-gray-400 border-gray-300 cursor-not-allowed"
              : "text-gray-600 border-gray-600"
            }`}
          >
            {isMissing ? "No Document" : "View Document"}
          </button>
        </div>
      );
    })}
                    </div>

                    <div className='border border-gray-200 '>
                  <div className='px-4 py-3 border-b border-gray-200' id='message'>
                    <h1 className='text-black font-semibold text-sm'>Notes & Communication</h1>
                  </div>
                    {messages.map((message, index) =>
                       ( <div key={index} className='border-b flex justify-between border-gray-200 p-2'>
                         <div className='flex gap-2'> 
                         <div className='w-[350px]'>
                           <h1 className='text-sm font-semibold text-black'>{message.title}</h1>
                          <p className='text-gray-500 text-xs'> {message.content} </p> 
                          </div> 
                    </div> 
                    <p className='text-gray-500 text-xs'>{message.created_at}</p>
                     </div> ))}


                    <div className='px-4 py-3'>
                      <button 
  onClick={() => setShowPopup(true)} 
  className="bg-black text-white px-4 text-xs py-2 rounded"
>
  Add Note
</button>
                    </div>
                    </div>

                    

                </div>
                
               

              </div>
               <div className='flex flex-col gap-4 w-[350px] '>
                    <div className='border border-gray-200 '>
    <h1 className='text-black font-semibold text-sm mb-3 border-b px-4 py-3 border-gray-200'>Verification Status</h1>

    {/* Status Item */}
   <div className='p-4'>
    <div className='flex justify-between items-center mb-2'>
    <p className='text-xs text-gray-700'>Business Registration</p>
    <p className={`text-xs font-semibold ${businessStatus.color}`}>
      {businessStatus.label}
    </p>
  </div>
  <div className='w-full h-1 bg-gray-200 rounded-md mb-3'>
    <div
      className={`h-full ${businessStatus.bar} rounded-md`}
      style={{ width: `${businessProgress}%` }}
    ></div>
  </div>

    <div className='flex justify-between items-center mb-2'>
    <p className='text-xs text-gray-700'>Bank Information</p>
    <p className={`text-xs font-semibold ${bankStatus.color}`}>
      {bankStatus.label}
    </p>
  </div>
  <div className='w-full h-1 bg-gray-200 rounded-md mb-3'>
    <div
      className={`h-full ${bankStatus.bar} rounded-md`}
      style={{ width: `${bankProgress}%` }}
    ></div>
  </div>

   <div className='flex justify-between items-center mb-2'>
    <p className='text-xs text-gray-700'>Identity Verification</p>
    <p className={`text-xs font-semibold ${identityStatus.color}`}>
      {identityStatus.label}
    </p>
  </div>
  <div className='w-full h-1 bg-gray-200 rounded-md mb-3'>
    <div
      className={`h-full ${identityStatus.bar} rounded-md`}
      style={{ width: `${identityProgress}%` }}
    ></div>
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
      <div
        className={`h-full ${overallStatus.bar} rounded-md`}
        style={{ width: `${overallProgress}%` }}
      ></div>
    </div>
    <p className='text-right text-xs text-gray-700 mt-1'>{overallProgress}%</p>
  </div>
  </div>

                    <div>
   </div>
                        
                    </div>

                     <div className='border border-gray-200'>
  <h1 className='text-black font-semibold text-sm mb-3 border-b px-4 py-3 border-gray-200'>
    Risk Assessment
  </h1>
  <div className='p-4'>
    <div className='flex justify-between'>
      <p className='text-gray-500 text-sm'>Risk Level</p>
      <p className={`text-xs ${colorClass}`}>{riskLevel}</p>
    </div>
    <ul className='text-gray-500 mt-3 flex flex-col gap-2 text-xs ml-5'>
      {factors.map((f, i) => (
        <li key={i}>{f.label}</li>
      ))}
    </ul>
  </div>
</div>


                <div className='border border-gray-200 '>
                    <h1 className='text-black font-semibold text-sm mb-3 border-b px-4 py-3
                     border-gray-200'>Decision</h1>
                    <div className='p-4 flex flex-col gap-2'>
                        {vendor?.is_identity_verified ?
                       <button
                         disabled={vendor?.is_identity_verified}
                         className={`w-full py-2 px-4 text-xs ${
        approving ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white"
      }`}
    >
     Approved
      
                         </button> :
                          <button
                         disabled={vendor?.is_identity_verified}
                         onClick={handleApprove}
                         className={`w-full py-2 px-4 text-xs ${
        approving ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white"
      }`}
    >
      {approving ? "Approving..." : "Approve Application"}
      
                         </button>  
                      
                      }
                         <button 
                          disabled={vendor?.is_identity_verified}
                         className='w-full bg-inherit py-2 px-4 text-xs border border-black text-black'>
                          Reject Application</button>
                         <button 
                          disabled={vendor?.is_identity_verified}
                         className='bg-gray-200 text-gray-600 text-xs py-2 px-4
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
      {selectedDoc && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-md max-w-lg w-full shadow-lg">
      <h2 className="text-black text-sm font-semibold mb-3">Document Preview</h2>

      <img
        src={selectedDoc}
        alt="Document"
        className="w-full max-h-[70vh] object-contain rounded"
      />

      <button
        onClick={() => setSelectedDoc(null)}
        className="mt-4 w-full py-2 text-sm border border-black text-black uppercase"
      >
        Close
      </button>
    </div>
  </div>
)}

{showPopup && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
    <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-2xl border border-gray-200">
      
      {/* Popup Header */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Add Note</h2>

      {/* Title Input */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 
        focus:outline-none focus:ring-2  focus:border-transparent"
      />

      {/* Content Input */}
      <textarea
        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2  focus:border-transparent"
        rows={5}
        placeholder="Write your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Action Buttons */}
      <div className="mt-3 flex justify-end gap-3">
        <button
          onClick={() => setShowPopup(false)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            handleMessage();
            setShowPopup(false);
          }}
          className="px-4 py-2 bg-black text-white rounded-md "
        >
          {sending ? "Sending" : "Send"}
        </button>
      </div>
    </div>
  </div>
)}



    </section>
  )
}

export default Applications
