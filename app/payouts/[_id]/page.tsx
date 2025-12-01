"use client";
import ProtectedRoute from '@/app/_components/ProtectedRoute'
import React, { useEffect, useState } from 'react'
import {PayoutType, TransactionType} from "../../_lib/type"
import { useParams } from 'next/navigation'
import {approvePayout, fetchTransactionById, rejectPayout} from "../../_lib/payouts"
import { CiUser } from 'react-icons/ci';
import { toast } from 'react-toastify';

interface ApproveModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: PayoutType | null;
  approving: boolean;
}

interface DeclineModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reason: string;
  setReason: (value: string) => void;
  declining: boolean;
}



const ApproveModal: React.FC<ApproveModalProps> = ({
  open,
  onClose,
  onConfirm,
  transaction,
  approving,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm  flex items-center justify-center z-999">
      <div className="bg-white w-[420px] rounded-md p-5 shadow-md">
        <h2 className="text-sm font-semibold mb-4">Confirm Payment Approval</h2>

        <div className="text-xs text-gray-600 space-y-2">
          <p><span className="text-gray-500">Amount:</span> ₦{transaction?.amount}</p>
          <p><span className="text-gray-500">Vendor:</span> {transaction?.vendor?.business_name}</p>
          <p><span className="text-gray-500">Vendor ID:</span> {transaction?.vendor?._id}</p>
          <p><span className="text-gray-500">Payment Method:</span> Bank Transfer (ACH)</p>
          <p><span className="text-gray-500">Account:</span> **** {transaction?.vendor?.kyc_compliance?.account_number?.slice(-4)}</p>
          <p><span className="text-gray-500">Reference ID:</span> {transaction?.transaction_reference}</p>
        </div>

        <div className="mt-4 bg-gray-100 text-xs text-gray-600 p-3 rounded">
          By approving this payment, funds will be released to the vendor’s bank account.
          <br />This action cannot be undone.
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="text-sm bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-sm bg-black text-white px-4 py-2 rounded"
          >
            {approving ? "Approving" : "Confirm Approval"}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeclineModal: React.FC<DeclineModalProps> = ({
  open,
  onClose,
  onConfirm,
  reason,
  setReason,
  declining,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm  flex items-center justify-center z-[999]">
      <div className="bg-white w-[420px] rounded-md p-5 shadow-md">
        <h2 className="text-sm font-semibold mb-4">Decline Payout</h2>

        <p className="text-xs text-gray-600 mb-3">
          Please provide a reason for declining this payout request. The vendor will be notified immediately.
        </p>

        <p className="text-orange-500 text-xs mb-3">⚠️ This action cannot be undone.</p>

        <label className="text-xs text-gray-500">Decline Reason*</label>
        <select
          className="w-full border p-2 rounded text-xs mt-1"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">Select a reason</option>
          <option value="Invalid documents">Invalid documents</option>
          <option value="Suspicious activity">Suspicious activity</option>
          <option value="Incorrect payout details">Incorrect payout details</option>
        </select>

        <label className="text-xs text-gray-500 mt-3 block">Additional Details*</label>
        <textarea
          className="w-full border p-2 rounded text-xs mt-1 h-20"
          placeholder="Please provide specific details"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="text-sm bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-sm bg-black text-white px-4 py-2 rounded"
          >
           {declining ? "Declining" : "Decline"}
          </button>
        </div>
      </div>
    </div>
  );
};



function page() {
      const {_id} = useParams();
      const [transaction, setTransaction] = useState<PayoutType | null>(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState("");
      const [approveOpen, setApproveOpen] = useState(false);
const [declineOpen, setDeclineOpen] = useState(false);
const [reason, setReason] = useState("");
const [approving, setApproving] = useState(false);
const [declining, setDeclining] = useState(false);

    const fetchTransaction = async () => {
  setLoading(true);
  try {
    const res = await fetchTransactionById(_id);
    if (res?.data) {
      setTransaction(res.data);
    } else {
      setError("No transaction found");
    }
  } catch (err) {
    setError("Failed to fetch transaction");
  }
  setLoading(false);
};


      useEffect(() => {
  fetchTransaction();
}, [_id]);


  const handleApprove = async () => {
  setApproving(true);

  const res = await approvePayout(_id);

  if (res?.success) {
    toast.success("Payout approved!");
    setApproveOpen(false);
    await fetchTransaction();
  } else {
    toast.error(res?.message || "Failed to approve payout");
  }

  setApproving(false);
};

const handleDecline = async () => {
  if (!reason.trim()) return toast.error("Please provide decline reason");

  setDeclining(true);

  const res = await rejectPayout(_id,  reason );

  if (res?.success) {
    toast.success("Payout declined!");
    setDeclineOpen(false);
    await fetchTransaction();
  } else {
    toast.error(res?.message || "Failed to decline payout");
  }

  setDeclining(false);
};

  if (loading) {
  return (
    <ProtectedRoute>
      <section className="bg-gray-200 min-h-screen px-4 md:px-8 py-6 w-full">
        <div className="w-[500px] mx-auto bg-white rounded-md px-4 py-3 animate-pulse">
          <div className="flex justify-between">
            <div className="flex flex-col gap-2.5 text-xs text-gray-300">
              <p className="h-3 bg-gray-300 rounded w-20"></p>
              <p className="h-3 bg-gray-300 rounded w-24"></p>
              <p className="h-3 bg-gray-300 rounded w-16"></p>
            </div>
            <div className="flex flex-col gap-2.5">
              <p className="h-3 bg-gray-300 rounded w-24"></p>
              <p className="h-3 bg-gray-300 rounded w-20"></p>
              <p className="h-3 bg-gray-300 rounded w-16"></p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div>
              <p className="h-3 bg-gray-300 rounded w-28"></p>
              <p className="h-3 bg-gray-300 rounded w-40 mt-1"></p>
            </div>
          </div>

          <div className="mt-6 h-20 bg-gray-300 rounded"></div>
        </div>
      </section>
    </ProtectedRoute>
  );
}

  
  return (
    <ProtectedRoute>
        <section className="bg-gray-200  min-h-screen px-4 md:px-8 py-6 w-full">
             <div className='w-[500px] mx-auto bg-white rounded-md px-4 py-3'>
                <div className='flex justify-between'>
                     <div className='flex flex-col gap-2.5 text-xs text-gray-500'>
                       <p>Request ID</p>
                       <p>Date Requested</p>
                       <p>Status</p>
                     </div>
                     <div className='flex flex-col gap-2.5'>
                        <h3 className='text-black text-sm '>{transaction?.transaction_reference}</h3>
                        <h3 className='text-xs text-gray-500'>{transaction?.created_at}</h3>
                        {transaction?.status === "successful" && <h3 className='text-green-500 font-semibold text-sm'>{transaction.status}</h3>}
                       {transaction?.status === "pending" && <h3 className='text-orange-500 font-semibold text-sm'>{transaction.status}</h3>}
                       {transaction?.status === "failed" && <h3 className='text-red-500 font-semibold text-sm'>{transaction.status}</h3>}
                     </div>
                </div>

                <div className='mt-8 flex items-center gap-2'>
                 {transaction?.vendor?.brand?.brand_banner
  ? (
    <img
      className='w-10'
      src={transaction.vendor.brand.brand_banner}
      alt="Brand Banner"
    />
  )
  : <CiUser size={25}/>
}

                  <div>
                    <h1 className='text-sm font-medium text-black'>{transaction?.vendor.business_name}</h1>
                   {transaction?.vendor?.brand?.brand_description ? (
  <p className='text-gray-500 text-xs'>
    {transaction?.vendor?.brand?.brand_description}
  </p>
) : null}

                  </div>
                </div>

             <div className='flex mt-6 justify-between gap-3'>
              <div className='w-1/2 bg-gray-200 px-4 py-2 rounded-[5px]'>
                <h4 className='text-gray-500  text-xs'>Vendor Since</h4>
                <p className='text-black font-semibold text-sm'>{transaction?.vendor?.created_at}</p>
              </div>
              {/* <div className='w-1/2 bg-gray-200 px-4 py-2 rounded-[5px]'>
              
              </div> */}
              </div>   
                <div className='mt-6 flex justify-between'>
                  <div className='flex flex-col gap-2.5 text-xs text-gray-500'>
                       <p>Amount Requested</p>
                       <p>Payment Method</p>
                       <p>Account Ending</p>
                     </div>
                    <div className='flex flex-col gap-2.5 text-xs text-gray-500'>
                        <h3 className='text-black text-sm '>₦{transaction?.amount}</h3>
                        <p className='text-gray-500 text-xs'>Bank Transfer (ACH)</p>
                        <p className='text-gray-500 text-xs'>***{transaction?.vendor?.kyc_compliance?.account_number.slice(-4)}</p>
                    </div> 

                </div>

                <div className='mt-6 bg-gray-200 px-4 py-2 rounded-[5px]'>
                   <h1 className='text-gray-500 text-xs'>KYC Documents</h1>
                   <div className='flex mt-4 justify-between'>
                      <div className='flex flex-col text-xs text-gray-500 gap-0.5'>
                           <p>Business Registration</p>
                      <p>Tax ID Certificate</p>
                      <p>Bank Statement</p>
                      </div>

                      <div className='flex flex-col text-xs text-gray-500 gap-0.5'>
                          {transaction?.vendor?.kyc_compliance?.business_registration_document !== "" ?
                           <p className='text-green-500 text-xs font-semibold'>Verified</p> : <p className='text-red-500 text-xs font-semibold'>
                                 Unverified
                           </p>  }
                      {transaction?.vendor?.kyc_compliance?.tax_identification_number !== "" ?
                           <p className='text-green-500 text-xs font-semibold'>Verified</p> : <p className='text-red-500 text-xs font-semibold'>
                                 Unverified
                           </p>  }
                      {transaction?.vendor?.kyc_compliance?.bank_statement !== "" ?
                           <p className='text-green-500 text-xs font-semibold'>Verified</p> : <p className='text-red-500 text-xs font-semibold'>
                                 Unverified
                           </p>  }
                      </div>
                   </div>
                </div>

               <div className='flex flex-col gap-2 bg-gray-200 mt-4 mb-5 p-2 rouned-[5px]'>
                 <h1 className='text-black font-semibold text-xs'>Notes</h1>
                 <textarea name="" id=""
                 className='bg-white text-xs p-4'
                 placeholder='Add a note about this payout request'
                 ></textarea>
               </div>

               <div className='flex items-center justify-between gap-2.5 mt-4'>
  <button
    onClick={() => setDeclineOpen(true)}
    className="bg-gray-500 text-white px-4 py-2 rounded text-xs"
  >
    Reject Payout
  </button>

  <button
    onClick={() => setApproveOpen(true)}
    className="bg-gray-800 text-white px-4 py-2 rounded text-xs"
  >
    Approve Payout
  </button>
</div>

             </div>
             <ApproveModal
  open={approveOpen}
  onClose={() => setApproveOpen(false)}
  onConfirm={handleApprove}
  transaction={transaction}
  approving={approving}
/>

<DeclineModal
  open={declineOpen}
  onClose={() => setDeclineOpen(false)}
  onConfirm={handleDecline}
  reason={reason}
  setReason={setReason}
  declining={declining}
/>

        </section>
    </ProtectedRoute>
  )
}

export default page
