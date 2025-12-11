"use client";
import React, { useEffect, useState } from "react";
import { CiUser } from "react-icons/ci";
import { Vendor, KycCompliance, Product, VendorMessage } from "@/app/_lib/type";
import {
  verifyBankDetails,
  verifyBusiness,
  verifyVendorIdentity,
  revokeBankDetails,
  revokeBusiness,
  revokeVendorIdentity,
} from "../_lib/admin";
import { toast } from "react-toastify";
import Link from "next/link";
import { getAllVendorMessages, sendMessage } from "../_lib/message";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaEye } from "react-icons/fa"; 

interface ApplicationsProps {
  vendor: Vendor | null;
  id: string;
  products: Product[];
  setVendor: React.Dispatch<React.SetStateAction<Vendor | null>>;
}

function Applications({ vendor, id, products, setVendor }: ApplicationsProps) {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  // --- LOADING STATES ---
  const [verifyingBusiness, setVerifyingBusiness] = useState(false);
  const [verifyingIdentity, setVerifyingIdentity] = useState(false);
  const [verifyingBank, setVerifyingBank] = useState(false);
  const [revokingBusiness, setRevokingBusiness] = useState(false);
  const [revokingIdentity, setRevokingIdentity] = useState(false);
  const [revokingBank, setRevokingBank] = useState(false);

  // --- MESSAGING STATES ---
  const [messages, setMessages] = useState<VendorMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [message_type, setMessageType] = useState("text");
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  // Helpers for button disabling
  const isBusinessDocPresent =
    !!vendor?.kyc_compliance?.business_registration_document &&
    !!vendor?.kyc_compliance?.registration_number;
  const isBankDocPresent =
    !!vendor?.kyc_compliance?.bank_statement &&
    !!vendor?.kyc_compliance?.account_number;
  const isIdentityInfoPresent =
    !!vendor?.kyc_compliance?.valid_owner_id && !!vendor?.contact_person_name;

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
      } finally {
        setLoading(false);
      }
    };
    getMessages();
  }, [id]);

  const documents: {
    label: string;
    key: keyof KycCompliance;
    isRequiredForVerification: boolean;
  }[] = [
    {
      label: "Business Registration",
      key: "business_registration_document",
      isRequiredForVerification: true,
    },
    {
      label: "Valid Owner ID",
      key: "valid_owner_id",
      isRequiredForVerification: true,
    },
    {
      label: "Bank Statement",
      key: "bank_statement",
      isRequiredForVerification: true,
    },
  ];

  const handleVerifyBusiness = async () => {
    if (
      verifyingBusiness ||
      vendor?.is_business_verified ||
      !isBusinessDocPresent
    )
      return;
    setVerifyingBusiness(true);
    try {
      const res = await verifyBusiness(id);
      toast.success(res.message || "Business verified successfully!");
      setVendor((prev) =>
        prev ? { ...prev, is_business_verified: true } : prev
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to verify Business");
    } finally {
      setVerifyingBusiness(false);
    }
  };

  const handleRevokeBusiness = async () => {
    setRevokingBusiness(true);
    try {
      const res = await revokeBusiness(id);
      toast.success(
        res.message || "Business verification revoked successfully!"
      );
      setVendor((prev) =>
        prev ? { ...prev, is_business_verified: false } : prev
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke Business verification");
    } finally {
      setRevokingBusiness(false);
    }
  };

  const handleVerifyIdentity = async () => {
    if (
      verifyingIdentity ||
      vendor?.is_identity_verified ||
      !isIdentityInfoPresent
    )
      return;
    setVerifyingIdentity(true);
    try {
      const res = await verifyVendorIdentity(id);
      toast.success(res.message || "Identity verified successfully!");
      setVendor((prev) =>
        prev ? { ...prev, is_identity_verified: true } : prev
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to verify Identity");
    } finally {
      setVerifyingIdentity(false);
    }
  };

  const handleRevokeIdentity = async () => {
    setRevokingIdentity(true);
    try {
      const res = await revokeVendorIdentity(id);
      toast.success(
        res.message || "Identity verification revoked successfully!"
      );
      setVendor((prev) =>
        prev ? { ...prev, is_identity_verified: false } : prev
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke Identity verification");
    } finally {
      setRevokingIdentity(false);
    }
  };

  const handleVerifyBankDetails = async () => {
    if (
      verifyingBank ||
      vendor?.is_bank_information_verified ||
      !isBankDocPresent
    )
      return;
    setVerifyingBank(true);
    try {
      const res = await verifyBankDetails(id);
      toast.success(res.message || "Bank Details verified successfully!");
      setVendor((prev) =>
        prev ? { ...prev, is_bank_information_verified: true } : prev
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to verify Bank Details");
    } finally {
      setVerifyingBank(false);
    }
  };

  const handleRevokeBankDetails = async () => {
    setRevokingBank(true);
    try {
      const res = await revokeBankDetails(id);
      toast.success(
        res.message || "Bank Details verification revoked successfully!"
      );
      setVendor((prev) =>
        prev ? { ...prev, is_bank_information_verified: false } : prev
      );
    } catch (error: any) {
      toast.error(
        error.message || "Failed to revoke Bank Details verification"
      );
    } finally {
      setRevokingBank(false);
    }
  };

  

  const handleFinalApprove = () => {
    if (
      vendor?.is_business_verified &&
      vendor?.is_identity_verified &&
      vendor?.is_bank_information_verified
    ) {
      toast.success(
        "Vendor is fully verified and application can be approved."
      );
      router.push("/vendor-management");
    } else {
      toast.error(
        "Please verify all sections (Business, Identity, Bank) before final approval."
      );
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
        setMessages((prev) => [...prev, res.data]);
        setContent("");
        setShowPopup(false);
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

      {/* Beginning of application */}
      <div className="border my-5 border-gray-200">
        <div className="flex items-center justify-between px-3 py-2">
          <h1 className="text-black font-semibold text-sm">
            Application Details:
            {vendor?.is_business_verified &&
            vendor?.is_identity_verified &&
            vendor?.is_bank_information_verified ? (
              <span className="text-green-700 text-xs uppercase ml-5">
                Verified
              </span>
            ) : (
              <span className="text-red-700 text-xs uppercase ml-5">
                Urgent Review
              </span>
            )}
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-gray-500 text-xs">ID: {vendor?._id}</p>
            <p className="text-gray-500 text-xs">
              Submitted:{" "}
              {vendor?.created_at
                ? new Date(vendor.created_at).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
        <hr className="text-gray-200 mt-1 mb-2" />

        <div className="flex gap-4 px-4 py-2">
          <div className="border border-gray-200 py-3 px-4 w-[300px] flex flex-col gap-3.5">
            <h1 className="text-black text-sm font-semibold">
              Brand Information
            </h1>
            <div className="flex gap-3">
              {vendor?.brand?.brand_banner === "" ? (
                <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100">
                  <CiUser className="text-black text-[22px]" />
                </div>
              ) : (
                <img
                  src={vendor?.brand?.brand_banner}
                  alt="Brand Banner"
                  className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                />
              )}

              <div>
                <h1 className="text-black text-sm font-semibold mb-0.5">
                  {vendor?.brand?.brand_name || "N/A"}
                </h1>
                <p className="text-gray-500 text-xs mb-0.5">
                  {vendor?.brand?.brand_description ||
                    "No description provided"}
                </p>
                <p className="text-gray-500 text-xs mt-1.5 mb-0.5">
                  {vendor?.kyc_compliance?.city || "N/A"}
                </p>
              </div>
            </div>

            {/* ... Other sidebar details ... */}
            <div className="flex flex-col gap-px">
              <p className="text-gray-500 text-xs mb-0.5">Business Type</p>
              <h2 className="text-black text-sm">
                {vendor?.kyc_compliance?.business_type || "N/A"}
              </h2>
            </div>
            {/* ... keeping other fields same ... */}
            <div className="flex flex-col gap-1px">
              <p className="text-gray-500 text-xs mb-0.5">Website</p>
              <h2 className="text-black text-sm">
                {vendor?.brand?.website_url || "N/A"}
              </h2>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3.5">
            <div className="border border-gray-200 py-2 px-4">
              <h1 className="text-black font-semibold text-sm">
                Contact Information
              </h1>
              <div className="flex gap-12 my-4">
                <div className="flex-col gap-1">
                  <p className="text-gray-500 text-xs">Primary Contact</p>
                  <h1 className="text-black text-sm font-semibold">
                    {vendor?.contact_person_name || "N/A"}
                  </h1>
                </div>
                <div className="flex-col gap-1">
                  <p className="text-gray-500 text-xs">Email Address</p>
                  <h1 className="text-black text-sm">
                    {vendor?.email || "N/A"}
                  </h1>
                </div>
              </div>
              <div className="flex gap-24 my-4">
                <div className="flex-col gap-1">
                  <p className="text-gray-500 text-xs">Phone Number</p>
                  <h1 className="text-black text-sm">
                    {vendor?.phone_number || "N/A"}
                  </h1>
                </div>
                <div className="flex-col gap-1">
                  <p className="text-gray-500 text-xs">Business Address</p>
                  <h1 className="text-black text-xs">
                    {vendor?.kyc_compliance?.address_line_one || "N/A"}
                  </h1>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 py-2 px-4">
              <h1 className="text-black font-semibold text-sm">
                Product Information
              </h1>
              <div className="flex my-4 gap-8">
                {products.length > 0 ? (
                  products.slice(0, 3).map((item: Product, index: number) => (
                    <div className="" key={index}>
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-[100px] h-[100px] mb-2 object-cover"
                      />
                      <p className="text-gray-500 text-xs">{item.name}</p>
                      <p className="text-gray-500 text-xs">
                        €{item.discounted_price}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No products submitted yet.
                  </p>
                )}
              </div>
              {products.length > 0 && (
                <Link
                  href={`/product-review-queue/${id}`}
                  className="text-xs font-semibold p-3 border -mt-5 mb-10 border-gray-200"
                >
                  View All Products ({products.length})
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4 my-3">
          <div className="flex flex-col gap-3 w-full">
            <div className="border border-gray-200 ">
              <div className="px-4 py-3 border-b border-gray-200">
                <h1 className="text-black font-semibold text-sm">
                  Documents Verification
                </h1>
              </div>

              {/* GRID FOR DOCUMENTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-3">
                {documents.map((doc, index) => {
                  const value =
                    vendor?.kyc_compliance?.[doc.key as keyof KycCompliance];
                  // Safe cast because the key matches document structure
                  const docUrl = typeof value === "string" ? value : undefined;
                  const isMissing = !docUrl || docUrl.trim() === "";

                  return (
                    <div key={index} className="border border-gray-200 p-3">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <h1 className="text-black font-semibold text-sm">
                            {doc.label}
                          </h1>
                          {!isMissing && docUrl && (
                            <button
                              onClick={() => setSelectedDoc(docUrl)}
                              title="View Document"
                              className="text-gray-500 hover:text-black transition"
                            >
                              <FaEye />
                            </button>
                          )}
                        </div>
                        <p
                          className={`uppercase text-xs font-bold ${
                            isMissing ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {isMissing ? "Missing" : "Uploaded"}
                        </p>
                      </div>

                      {/* --- CONDITIONALLY RENDER BUTTONS BASED ON DOC KEY --- */}

                      {/* 1. Business Registration Buttons */}
                      {doc.key === "business_registration_document" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleVerifyBusiness}
                            disabled={
                              verifyingBusiness ||
                              vendor?.is_business_verified ||
                              !isBusinessDocPresent
                            }
                            className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded transition duration-150 ease-in-out
                              ${
                                vendor?.is_business_verified
                                  ? "bg-green-50 text-green-700 border border-green-300 cursor-not-allowed"
                                  : !isBusinessDocPresent
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-black text-white hover:bg-gray-800"
                              }`}
                          >
                            {vendor?.is_business_verified
                              ? "✓ Verified"
                              : verifyingBusiness
                                ? "Verifying..."
                                : "Verify Business"}
                          </button>
                          {!vendor?.is_business_verified && (
                            <button
                              onClick={handleRevokeBusiness}
                              disabled={revokingBusiness}
                              className="flex-1 py-2.5 px-4 text-xs font-semibold rounded
                                bg-white border border-red-400 text-red-600 hover:bg-red-50
                                transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {revokingBusiness ? "..." : "Revoke"}
                            </button>
                          )}
                        </div>
                      )}

                      {/* 2. Identity Verification Buttons */}
                      {doc.key === "valid_owner_id" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleVerifyIdentity}
                            disabled={
                              verifyingIdentity ||
                              vendor?.is_identity_verified ||
                              !isIdentityInfoPresent
                            }
                            className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded transition duration-150 ease-in-out
                              ${
                                vendor?.is_identity_verified
                                  ? "bg-green-50 text-green-700 border border-green-300 cursor-not-allowed"
                                  : !isIdentityInfoPresent
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-black text-white hover:bg-gray-800"
                              }`}
                          >
                            {vendor?.is_identity_verified
                              ? "✓ Verified"
                              : verifyingIdentity
                                ? "Verifying..."
                                : "Verify Identity"}
                          </button>
                          {!vendor?.is_identity_verified && (
                            <button
                              onClick={handleRevokeIdentity}
                              disabled={revokingIdentity}
                              className="flex-1 py-2.5 px-4 text-xs font-semibold rounded
                                bg-white border border-red-400 text-red-600 hover:bg-red-50
                                transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {revokingIdentity ? "..." : "Revoke"}
                            </button>
                          )}
                        </div>
                      )}

                      {/* 3. Bank Verification Buttons */}
                      {doc.key === "bank_statement" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleVerifyBankDetails}
                            disabled={
                              verifyingBank ||
                              vendor?.is_bank_information_verified ||
                              !isBankDocPresent
                            }
                            className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded transition duration-150 ease-in-out
                              ${
                                vendor?.is_bank_information_verified
                                  ? "bg-green-50 text-green-700 border border-green-300 cursor-not-allowed"
                                  : !isBankDocPresent
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-black text-white hover:bg-gray-800"
                              }`}
                          >
                            {vendor?.is_bank_information_verified
                              ? "✓ Verified"
                              : verifyingBank
                                ? "Verifying..."
                                : "Verify Bank"}
                          </button>
                          {!vendor?.is_bank_information_verified && (
                            <button
                              onClick={handleRevokeBankDetails}
                              disabled={revokingBank}
                              className="flex-1 py-2.5 px-4 text-xs font-semibold rounded
                                bg-white border border-red-400 text-red-600 hover:bg-red-50
                                transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {revokingBank ? "..." : "Revoke"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* FINAL ACTIONS SECTION (MOVED OUTSIDE THE MAP LOOP) */}
              <div className="p-4 flex flex-col gap-2 border-t border-gray-200 mt-2">
                <button
                  onClick={handleFinalApprove}
                  className="w-full bg-black text-white py-3 px-4 text-sm font-semibold rounded hover:bg-gray-800 transition duration-150"
                >
                  Approve Application
                </button>

                {/* <button
                  className="w-full bg-inherit py-2 px-4 text-xs border
                          border-red-500 text-red-500 disabled:cursor-not-allowed hover:bg-red-50 transition duration-150"
                >
                  Reject Application
                </button> */}

                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <h1 className="text-black font-semibold text-sm">
                      Send Vendor Message / Decision Note
                    </h1>
                    <button
                      onClick={() => setShowPopup(true)}
                      className="text-xs underline text-blue-600"
                    >
                      Open Compose Modal
                    </button>
                  </div>
                  <textarea
                    name=""
                    id=""
                    className="border border-gray-200 px-4 py-2 text-sm focus:ring-0 focus:border-black"
                    rows={3}
                    placeholder="Quick note..."
                  ></textarea>
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
          <div className="bg-white p-4 rounded-md max-w-lg w-full shadow-lg relative">
            <h2 className="text-black text-sm font-semibold mb-3">
              Document Preview
            </h2>

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

      {/* Add Note/Message Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-2xl border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Send Message to Vendor</h3>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:border-black"
            />

            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:border-black"
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
  );
}

export default Applications;
