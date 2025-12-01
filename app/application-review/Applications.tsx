"use client"
import React, { useEffect, useState } from 'react'
import { CiUser } from 'react-icons/ci'
import Image from 'next/image' // Assuming img1, img2, img3 are local imports but not used in the final version, keeping the import for completeness
import { Vendor, KycCompliance, Product, VendorMessage } from "@/app/_lib/type";
import { verifyBankDetails, verifyBusiness, verifyVendorIdentity } from '../_lib/admin'
import { toast } from "react-toastify";
import Link from 'next/link'
import {getAllVendorMessages, sendMessage} from "../_lib/message"
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'

// NOTE: Local image imports (img1, img2, img3) are commented out as they are not used in the products map logic.

interface ApplicationsProps {
  vendor: Vendor | null;
  id: string;
  products: Product[];
}


function Applications({ vendor, id, products }: ApplicationsProps) {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  
  // --- NEW SEPARATE LOADING STATES ---
  const [verifyingBusiness, setVerifyingBusiness] = useState(false);
  const [verifyingIdentity, setVerifyingIdentity] = useState(false);
  const [verifyingBank, setVerifyingBank] = useState(false);
  // ------------------------------------

  const [messages, setMessages] = useState<VendorMessage[]>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [message_type, setMessageType] = useState("text"); 
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  // Helper to check if a document is present for disabling verification buttons
  const isBusinessDocPresent = !!vendor?.kyc_compliance?.business_registration_document && !!vendor?.kyc_compliance?.registration_number;
  const isBankDocPresent = !!vendor?.kyc_compliance?.bank_statement && !!vendor?.kyc_compliance?.account_number;
  const isIdentityInfoPresent = !!vendor?.kyc_compliance?.valid_owner_id && !!vendor?.contact_person_name;
  
  // NOTE: Assuming isIdentityInfoPresent is a better check than just contact_person_name,
  // I added valid_owner_id check here, and it will also be disabled if the document is missing.

  useEffect(() => {
      const getMessages = async () => {
        try {
        setLoading(true);
            const res = await getAllVendorMessages(id);
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

const documents: { label: string; key: keyof KycCompliance; isRequiredForVerification: boolean }[] = [
  {
    label: "Business Registration",
    key: "business_registration_document",
    isRequiredForVerification: true // Used to determine button enable/disable
  },
  {
    label: "Valid Owner ID",
    key: "valid_owner_id",
    isRequiredForVerification: true
  },
  {
    label: "Bank Statement",
    key: "bank_statement",
    isRequiredForVerification: true
  }
];

const calcProgress = (fields: (string | undefined)[]) => {
  const total = fields.length;
  const filled = fields.filter(f => f && f.trim() !== "").length;
  return total > 0 ? Math.round((filled / total) * 100) : 0;
};

const getStatus = (percent: number) => {
  if (percent === 100) return { label: "Complete", color: "text-green-600", bar: "bg-green-600" };
  if (percent > 0) return { label: "In Progress", color: "text-yellow-600", bar: "bg-yellow-500" };
  return { label: "Not Started", color: "text-red-600", bar: "bg-red-600" };
};


// Updated progress calculation to reflect mandatory fields
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
  vendor?.kyc_compliance?.valid_owner_id
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


const handleVerifyBusiness = async () => {
    if (verifyingBusiness || vendor?.is_business_verified || !isBusinessDocPresent) return;
    setVerifyingBusiness(true);
    try {
        const res = await verifyBusiness(id);
        toast.success(res.message || "Business verified successfully!");
        // Note: In a real app, you would dispatch an action or manually update the vendor object
        // to reflect vendor.is_business_verified = true and re-calculate progress.
    } catch (error: any) {
        toast.error(error.message || "Failed to verify Business");
    } finally {
        setVerifyingBusiness(false);
    }
};

const handleVerifyIdentity = async () => {
    if (verifyingIdentity || vendor?.is_identity_verified || !isIdentityInfoPresent) return;
    setVerifyingIdentity(true);
    try {
        const res = await verifyVendorIdentity(id);
        toast.success(res.message || "Identity verified successfully!");
    } catch (error: any) {
        toast.error(error.message || "Failed to verify Identity");
    } finally {
        setVerifyingIdentity(false);
    }
};

const handleVerifyBankDetails = async () => {
    if (verifyingBank || vendor?.is_bank_information_verified || !isBankDocPresent) return;
    setVerifyingBank(true);
    try {
        const res = await verifyBankDetails(id);
        toast.success(res.message || "Bank Details verified successfully!");
    } catch (error: any) {
        toast.error(error.message || "Failed to verify Bank Details");
    } finally {
        setVerifyingBank(false);
    }
};

// --- FINAL APPROVE LOGIC ---
const handleFinalApprove = () => {
    if (vendor?.is_business_verified && vendor?.is_identity_verified && vendor?.is_bank_information_verified) {
        toast.success("Vendor is fully verified and application can be approved.");
        // Implement your final approval API call here if one exists
        router.push("/vendor-management");
    } else {
        toast.error("Please verify all sections (Business, Identity, Bank) before final approval.");
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
      <button
        onClick={() => router.back()}
        className="text-xs flex items-center mt-6 gap-1 cursor-pointer text-gray-600 mb-5 hover:text-gray-800"
      >
        <FaArrowLeft />  
        <span>Back to Vendor Applications</span>
      </button>
      {/* begining of application */}
      <div className='border my-5 border-gray-200'>
        <div className='flex items-center justify-between px-3 py-2'>
          <h1 className='text-black font-semibold text-sm'>
            Application Details:
            {/* Added check for overall verification for urgent status */}
            {vendor?.is_business_verified && vendor?.is_identity_verified && vendor?.is_bank_information_verified ? 
             <span className='text-green-700 text-xs uppercase ml-5'>
                Verified
             </span> : 
              <span className='text-red-700 text-xs uppercase ml-5'>
              Urgent Review
              </span>
              }
              </h1>
          <div className='flex items-center gap-2'>
            <p className='text-gray-500 text-xs'>ID: {vendor?._id}</p>
            <p className='text-gray-500 text-xs'>Submitted: {vendor?.created_at ? new Date(vendor.created_at).toLocaleDateString() : 'N/A'}</p>
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
      alt="Brand Banner"
      className="w-10 h-10 rounded-full border border-gray-300 object-cover"
    />
  )}

  <div>
    <h1 className='text-black text-sm font-semibold mb-0.5'>
      {vendor?.brand?.brand_name || 'N/A'}
    </h1>
    <p className='text-gray-500 text-xs mb-0.5'>
      {vendor?.brand?.brand_description || 'No description provided'}
    </p>
    <p className='text-gray-500 text-xs mt-1.5 mb-0.5'>{vendor?.kyc_compliance?.city || 'N/A'}</p>
  </div>
</div>


            <div className='flex flex-col gap-px'>
                <p className='text-gray-500 text-xs mb-0.5'>Business Type</p>
                <h2 className='text-black text-sm'>{vendor?.kyc_compliance?.business_type || 'N/A'}</h2>
            </div>

            <div className='flex flex-col gap-px'>
                <p className='text-gray-500 text-xs mb-0.5'>Year Founded</p>
                <h2 className='text-black text-sm'>{vendor?.kyc_compliance?.created_at ? new Date(vendor.kyc_compliance.created_at).getFullYear() : 'N/A'}</h2>
            </div>

            <div className='flex flex-col gap-px'>
                <p className='text-gray-500 text-xs mb-0.5'>Annual Revenue</p>
                {/* NOTE: Hardcoded "€2.5M - €5M" replaced with N/A or actual data if available */}
                <h2 className='text-black text-sm'>N/A (Placeholder)</h2>
            </div>

            <div className='flex flex-col gap-1px'>
                <p className='text-gray-500 text-xs mb-0.5'>Website</p>
                <h2 className='text-black text-sm'>{vendor?.brand?.website_url || 'N/A'}</h2>
            </div>
          </div>
          <div className='w-full flex flex-col gap-3.5'>

            <div className='border border-gray-200 py-2 px-4'>
               <h1 className='text-black font-semibold text-sm'>Contact Information</h1>
               <div className='flex gap-12 my-4'>
                 <div className='flex-col gap-1'>
                    <p className='text-gray-500 text-xs'>Primary Contact</p>
                    <h1 className='text-black text-sm font-semibold'>{vendor?.contact_person_name || 'N/A'}</h1>
                    {/* NOTE: Hardcoded "Founder & Creative Director" replaced with N/A or actual data if available */}
                    <p className='text-gray-500 text-sm'>N/A (Role)</p>
                 </div>
                 <div className='flex-col gap-1'>
                    <p className='text-gray-500 text-xs'>Email Address</p>
                    <h1 className='text-black text-sm'>{vendor?.email || 'N/A'}</h1>
                 </div>
               </div>

               <div className='flex gap-24 my-4'>
                 <div className='flex-col gap-1'>
                    <p className='text-gray-500 text-xs'>Phone Number</p>
                    <h1 className='text-black text-sm'>{vendor?.phone_number || 'N/A'}</h1>
                 </div>
                 <div className='flex-col gap-1'>
                    <p className='text-gray-500 text-xs'>Business Address</p>
                    <h1 className='text-black text-xs'>
                     {vendor?.kyc_compliance?.address_line_one || 'N/A'}
                    <span className='ml-3'> {vendor?.kyc_compliance?.city || ''}</span>
                    </h1>
                 </div>
               </div>
            </div>

            <div className='border border-gray-200 py-2 px-4'>
                <h1 className='text-black font-semibold text-sm'>Product Information</h1>
                <div className='flex my-4 gap-8'>
                  {products.length > 0 ? products.slice(0, 3).map((item: Product, index: number) => (
  <div className='' key={index}>
     <img src={item.images[0]} alt={item.name} className='w-[100px] h-[100px] mb-2 object-cover'/>
     <p className='text-gray-500 text-xs'>{item.name}</p>
     <p className='text-gray-500 text-xs'>€{item.discounted_price}</p>
  </div>
)) : <p className='text-gray-500 text-sm'>No products submitted yet.</p>}
  
                </div>
                {products.length > 0 && <Link href={`/product-review-queue/${id}`} className='
   text-xs font-semibold p-3 border -mt-5 mb-10 border-gray-200
   '>View All Products ({products.length})</Link>}
                
                <div className='mt-6'>
                  <h1 className='text-gray-500 text-sm mb-2'>Categories/Niche</h1>
                  {/* NOTE: Hardcoded categories replaced with N/A or actual data if available */}
                  <div className='flex gap-2.5 text-gray-500 text-xs'>
                  <p>N/A (Placeholder)</p>
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
              {isMissing ? "Missing" : "Uploaded"}
            </p>
          </div>

          <div className='ml-10'>
            <p className='text-xs text-gray-500'>
              {isMissing ? "No file uploaded" : doc.key.replace(/_/g, ' ').toUpperCase()}
            </p>
            {!isMissing && (
              <p className='text-xs text-gray-500'>Ready for review</p>
            )}
          </div>

          <button
            disabled={isMissing}
            onClick={() => !isMissing && setSelectedDoc(value)}
            className={`w-full my-3 px-4 py-2 uppercase text-xs border transition duration-150 ease-in-out
            ${isMissing
              ? "text-gray-400 border-gray-300 cursor-not-allowed"
              : "text-black border-black hover:bg-gray-100"
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
                {messages.length > 0 ? messages.map((message, index) =>
                    ( <div key={index} className='border-b flex justify-between border-gray-200 p-2'>
                      <div className='flex gap-2'> 
                      <div className='w-[350px]'>
                         <h1 className='text-sm font-semibold text-black'>{message.title || 'No Title'}</h1>
                       <p className='text-gray-500 text-xs'> {message.content} </p> 
                       </div> 
                      </div> 
                    <p className='text-gray-500 text-xs'>{new Date(message.created_at).toLocaleDateString()}</p>
                    </div> )) : <p className='text-gray-500 text-sm p-4'>No notes or messages yet.</p>}


                <div className='px-4 py-3'>
                  <button 
                  onClick={() => setShowPopup(true)} 
                  className="bg-black text-white px-4 text-xs py-2 rounded hover:bg-gray-800 transition duration-150"
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

    {/* Status Item: Business Registration */}
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

    {/* Status Item: Bank Information */}
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

    {/* Status Item: Identity Verification */}
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

    {/* Status Item: Product Compliance */}
    <div className='flex justify-between items-center mb-3'>
      <p className='text-xs text-gray-700'>Product Compliance</p>
      <p className='text-xs font-semibold text-yellow-600'>In Review ({products.length})</p>
    </div>
    <div className='w-full h-1 bg-gray-200 rounded-md mb-4'>
      {/* NOTE: Hardcoded 40% for product compliance */}
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
    <p className='text-right text-xs text-gray-700 mt-1'>{overallProgress}% - {overallStatus.label}</p>
  </div>
  </div>

    {/* NOTE: Empty div removed */}
                    </div>

                      <div className='border border-gray-200'>
  <h1 className='text-black font-semibold text-sm mb-3 border-b px-4 py-3 border-gray-200'>
    Risk Assessment
  </h1>
  <div className='p-4'>
    <div className='flex justify-between'>
      <p className='text-gray-500 text-sm'>Risk Level</p>
      <p className={`text-xs font-bold ${colorClass}`}>{riskLevel}</p>
    </div>
    <ul className='text-gray-500 mt-3 flex flex-col gap-2 text-xs ml-5 list-disc'>
      {factors.map((f, i) => (
        <li key={i}>{f.label}</li>
      ))}
    </ul>
  </div>
</div>


                <div className='border border-gray-200 '>
                    <h1 className='text-black font-semibold text-sm mb-3 border-b px-4 py-3
                      border-gray-200'>Decision</h1>
                    {/* NOTE: Inner redundant border removed */}
                    <h1 className='text-black font-semibold text-sm mb-3 border-b px-4 py-3
                          border-gray-200'>Verification Actions</h1>
                    <div className='p-4 flex flex-col gap-3'>

                        {/* Business Verification Button */}
                        <button
                            onClick={handleVerifyBusiness}
                            disabled={verifyingBusiness || vendor?.is_business_verified || !isBusinessDocPresent}
                            className={`w-full py-2 px-4 text-xs font-semibold transition duration-150 ease-in-out
                                ${vendor?.is_business_verified 
                                    ? "bg-white text-black border border-black cursor-not-allowed" 
                                    : !isBusinessDocPresent
                                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                      : "bg-black text-white hover:bg-gray-800"
                                }`}
                        >
                            {vendor?.is_business_verified ? "Business Verified" : verifyingBusiness ? "Verifying Business..." : "Verify Business"}
                        </button>

                        {/* Identity Verification Button */}
                        <button
                            onClick={handleVerifyIdentity}
                            disabled={verifyingIdentity || vendor?.is_identity_verified || !isIdentityInfoPresent}
                            className={`w-full py-2 px-4 text-xs font-semibold transition duration-150 ease-in-out
                                ${vendor?.is_identity_verified 
                                    ? "bg-white text-black border border-black cursor-not-allowed" 
                                    : !isIdentityInfoPresent
                                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                      : "bg-black text-white hover:bg-gray-800"
                                }`}
                        >
                            {vendor?.is_identity_verified ? "Identity Verified" : verifyingIdentity ? "Verifying Identity..." : "Verify Identity"}
                        </button>

                        {/* Bank Verification Button */}
                        <button
                            onClick={handleVerifyBankDetails}
                            disabled={verifyingBank || vendor?.is_bank_information_verified || !isBankDocPresent}
                            className={`w-full py-2 px-4 text-xs font-semibold transition duration-150 ease-in-out
                                ${vendor?.is_bank_information_verified 
                                    ? "bg-white text-black border border-black cursor-not-allowed" 
                                    : !isBankDocPresent
                                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                      : "bg-black text-white hover:bg-gray-800"
                                }`}
                        >
                            {vendor?.is_bank_information_verified ? "Bank Details Verified" : verifyingBank ? "Verifying Bank Details..." : "Verify Bank Details"}
                        </button>
                    </div>

                    <div className='p-4 flex flex-col gap-2'>
                        {/* Final Approval Button */}
                       
                        
                        <button 
                         disabled={vendor?.is_identity_verified} // Use a more appropriate check here
                         className='w-full bg-inherit py-2 px-4 text-xs border
                          border-red-500 text-red-500 hover:bg-red-50 transition duration-150'>
                         Reject Application
                        </button>
                        <button 
                         disabled={vendor?.is_identity_verified} // Use a more appropriate check here
                         className='bg-gray-200 text-gray-600 text-xs py-2 px-4 hover:bg-gray-300 transition duration-150
                         '>Request More Information</button>

                         <div className='mt-4 flex flex-col gap-3'>
                            <h1 className='text-black font-semibold text-sm'>Add Decision Note</h1>
                            <textarea 
                            name="" id=""
                            className='border border-gray-200 px-4 py-2 text-sm focus:ring-0 focus:border-black'
                            rows={4}
                            placeholder='Enter your decision notes here'></textarea>
                         </div>
                    </div>
                
                </div>


              </div>
        </div>
      </div>
      {/* ending of application */}
      
      {/* Document Viewer Popup */}
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
        className="mt-4 w-full py-2 text-sm border border-black text-black uppercase hover:bg-gray-100 transition duration-150"
      >
        Close
      </button>
    </div>
  </div>
)}

{/* Add Note Popup */}
{showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-2xl border border-gray-200">
           

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:border-transparent"
            />

            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:border-transparent"
              rows={5}
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="mt-3 flex justify-end gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleMessage}
                disabled={sending}
                className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  )
}

export default Applications