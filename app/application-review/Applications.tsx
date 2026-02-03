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
import { FaArrowLeft, FaEye, FaFilePdf } from "react-icons/fa";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ApplicationsProps {
  vendor: Vendor | null;
  id: string;
  products: Product[];
  setVendor: React.Dispatch<React.SetStateAction<Vendor | null>>;
}

function Applications({ vendor, id, products, setVendor }: ApplicationsProps) {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [docError, setDocError] = useState<string | null>(null);

  // --- LOADING STATES ---
  const [verifyingBusiness, setVerifyingBusiness] = useState(false);
  const [verifyingIdentity, setVerifyingIdentity] = useState(false);
  const [verifyingBank, setVerifyingBank] = useState(false);
  const [revokingBusiness, setRevokingBusiness] = useState(false);
  const [revokingIdentity, setRevokingIdentity] = useState(false);
  const [revokingBank, setRevokingBank] = useState(false);

  // Revoked Instances
  const [revokedBusiness, setRevokedBusiness] = useState(false);
  const [revokedDocuments, setRevokedDocuments] = useState(false);
  const [revokedBank, setRevokedBank] = useState(false);

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
    if (revokingBusiness) return;
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
      setRevokedBusiness(true);
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
    if (revokingIdentity) return;
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
      setRevokedDocuments(true);
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
    if (revokingBank) return;
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
      setRevokedBank(true);
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

  const isPDF = (url: string) => {
    return url.toLowerCase().endsWith('.pdf') || url.includes('pdf');
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setDocError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading document:', error);
    setDocError('Failed to load document');
  };

  const closeDocumentViewer = () => {
    setSelectedDoc(null);
    setNumPages(0);
    setPageNumber(1);
    setDocError(null);
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

            <div className="flex flex-col gap-px">
              <p className="text-gray-500 text-xs mb-0.5">Business Type</p>
              <h2 className="text-black text-sm">
                {vendor?.kyc_compliance?.business_type || "N/A"}
              </h2>
            </div>
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
              <div className="flex my-4 gap-8 mb-6">
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
                        NGN{(item.discounted_price ?? item.cost_price).toLocaleString()}
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
                              className="text-gray-500 flex items-center gap-1 text-xs ml-5 hover:text-black transition"
                            >
                              <FaEye /> View Document
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
                          <button
                            onClick={handleRevokeBusiness}
                            disabled={revokingBusiness}
                            className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded transition duration-150 ease-in-out
                              ${
                                !vendor?.is_business_verified
                                  ? "bg-red-50 text-red-400 border border-red-200"
                                  : "bg-white border border-red-400 text-red-600 hover:bg-red-50"
                              }`}
                          >
                            {!vendor?.is_business_verified && revokedBusiness
                              ? "✗ Revoked"
                              : revokingBusiness
                                ? "Revoking..."
                                : "Revoke"}
                          </button>
                        </div>
                      )}

                      {/* 2. Identity Verification Buttons */}
                      {doc.key === "valid_owner_id" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleVerifyIdentity}
                            disabled={
                              verifyingIdentity || !isIdentityInfoPresent
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
                          <button
                            onClick={handleRevokeIdentity}
                            disabled={revokingIdentity}
                            className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded transition duration-150 ease-in-out
                              ${
                                !vendor?.is_identity_verified
                                  ? "bg-red-50 text-red-400 border border-red-200"
                                  : "bg-white border border-red-400 text-red-600 hover:bg-red-50"
                              }`}
                          >
                            {!vendor?.is_identity_verified && revokedDocuments
                              ? "✗ Revoked"
                              : revokingIdentity
                                ? "Revoking..."
                                : "Revoke"}
                          </button>
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
                          <button
                            onClick={handleRevokeBankDetails}
                            disabled={revokingBank}
                            className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded transition duration-150 ease-in-out
                              ${
                                !vendor?.is_bank_information_verified
                                  ? "bg-red-50 text-red-400 border border-red-200"
                                  : "bg-white border border-red-400 text-red-600 hover:bg-red-50"
                              }`}
                          >
                            {!vendor?.is_bank_information_verified &&
                            revokedBank
                              ? "✗ Revoked"
                              : revokingBank
                                ? "Revoking..."
                                : "Revoke"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* FINAL ACTIONS SECTION */}
              <div className="p-4 flex flex-col gap-2 border-t border-gray-200 mt-2">
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex flex-col gap-3">
                    <h1 className="text-black font-semibold text-sm">
                      Send Vendor Message / Decision Note
                    </h1>
                    <button
                      onClick={() => setShowPopup(true)}
                      className=" bg-black w-fit text-white px-4 py-2 text-xs font-semibold"
                    >
                      Compose Message for Vendor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Viewer Popup */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 rounded-md max-w-4xl w-full max-h-[90vh] shadow-lg relative flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-black text-sm font-semibold">
                Document Preview
              </h2>
              <a
                href={selectedDoc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                Open in New Tab
              </a>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-50 rounded">
              {docError ? (
                <div className="text-center p-8">
                  <p className="text-red-600 mb-4">{docError}</p>
                  <a
                    href={selectedDoc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Try opening in new tab
                  </a>
                </div>
              ) : isPDF(selectedDoc) ? (
                <div className="flex flex-col items-center">
                  <Document
                    file={selectedDoc}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <div className="text-gray-500 p-8">Loading PDF...</div>
                    }
                  >
                    <Page
                      pageNumber={pageNumber}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="max-w-full"
                    />
                  </Document>
                  {numPages > 1 && (
                    <div className="flex items-center gap-4 mt-4">
                      <button
                        onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                        disabled={pageNumber <= 1}
                        className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-xs text-gray-600">
                        Page {pageNumber} of {numPages}
                      </span>
                      <button
                        onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                        disabled={pageNumber >= numPages}
                        className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src={selectedDoc}
                  alt="Document"
                  className="max-w-full max-h-[70vh] object-contain rounded"
                  onError={() => setDocError('Failed to load image')}
                />
              )}
            </div>

            <button
              onClick={closeDocumentViewer}
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
