"use client";
import React, { useEffect, useState } from 'react'
import { CiUser } from 'react-icons/ci'
import { CategoryQueryParams } from "@/types";
import { useCategories } from "../_lib/categories";
import { useFetchGenders } from "../_lib/gender";
import { useFetchSizes } from "../_lib/sizes";
import { useFetchColors, addColor } from "../_lib/colors";
import { Product, Vendor } from '../_lib/type'
import { approveProduct, rejectProduct, requestCorrection } from '../_lib/products';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

interface ProductProps {
  vendor: Vendor | null;
  id: string;
  products: Product[];
}

// ✅ Separate component for each product item
interface ProductItemProps {
  item: Product;
  vendor: Vendor | null;
  categoriesArray: any[];
  colorsArray: any[];
  sizesArray: any[];
  updateProductStatus: (productId: string, newStatus: string) => void;
}

function ProductItem({ item, vendor, categoriesArray, colorsArray, sizesArray, updateProductStatus }: ProductItemProps) {
  const [currentMainImage, setCurrentMainImage] = useState(item.images[0]); // ✅ Now safe to use useState
  const [reviewText, setReviewText] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [approving, setApproving] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const mapIdsToNames = (ids: string[], referenceArray: { _id: string; name: string }[]) => {
    return ids
      .map(id => referenceArray.find(ref => ref._id === id)?.name)
      .filter(Boolean)
      .join(", ") || "N/A";
  };

  const formatFabrics = (fabrics: string[]) => fabrics?.join(", ") || "N/A";

  const handeleApproval = async (vendorId: string, prodId: string) => {
    try {
      setApproving(true);
      const res = await approveProduct(vendorId, prodId);
      if (res.success) {
        toast.success(res.message || "Product approved successfully!");
        updateProductStatus(prodId, "Approved");
      } else {
        toast.error(res.message || "Failed to approve product.");
      }
    } catch (error: any) {
      toast.error(error?.message || "An error occurred during approval.")
    } finally {
      setApproving(false)
    }
  }

  const handleReject = async (vendorId: string, prodId: string, reason: string) => {
    if (!reason.trim()) {
      return toast.error("Please provide a rejection reason in the Review Notes.");
    }
    try {
      setRejecting(true);
      const res = await rejectProduct(vendorId, prodId, reason);
      if (res.success) {
        toast.success(res.message || "Product rejected successfully!");
        updateProductStatus(prodId, "Rejected");
        setReviewText("");
      } else {
        toast.error(res.message || "Failed to reject product.");
      }
    } catch (error: any) {
      toast.error(error?.message || "An error occurred during rejection.");
    } finally {
      setRejecting(false)
    }
  }

  const handleRequestCorrection = async (vendor_id: string, prodId: string, review: string) => {
    if (!review.trim()) {
      return toast.error("Please provide a review in the Review Notes.");
    }
    try {
      setRequesting(true);
      const res = await requestCorrection(vendor_id, prodId, review);
      if (res.success) {
        toast.success(res.message || "Request Correction Successful");
        setReviewText("");
      } else {
        toast.error(res.message || "Request Correction Failed");
      }
    } catch (error: any) {
      toast.error(error?.message || "Request Correction Failed");
    } finally {
      setRequesting(false)
    }
  }

  return (
    <div className="p-3 border border-gray-200 mb-4">
      {/* Product Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          {vendor?.brand?.brand_banner ? (
            <img
              src={vendor.brand.brand_banner}
              alt=""
              className="w-10 h-10 rounded-full border border-gray-300 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100">
              <CiUser className="text-black text-[22px]" />
            </div>
          )}
          <div>
            <h1 className="text-sm text-black font-semibold">{vendor?.brand?.brand_name}</h1>
            <p className="text-gray-500 text-xs">
              Submitted: {new Date(item?.created_at).toISOString().split("T")[0]} • ID: {item?.sku}
            </p>
          </div>
        </div>
        {item?.status === "Approved" && (
          <h3 className='text-green-500 font-semibold text-xs'>Approved</h3>
        )}

        {item?.status === "Rejected" && (
          <h3 className='text-red-500 font-semibold text-xs'>Rejected</h3>
        )}

        {item?.status !== "Approved" && item?.status !== "Rejected" && (
          <h3 className="text-yellow-600 font-semibold text-xs">Pending Approval</h3>
        )}
      </div>

      {/* Product Details */}
      <div className="flex gap-7">
        {/* Images */}
        <div className="flex flex-col gap-6 w-[250px]">
          <img
            src={currentMainImage}
            alt="Main Product"
            className="w-full h-[300px] object-cover rounded-md"
          />

          <div className="flex gap-1">
            {item.images.slice(1).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-1/4 h-[50px] object-cover rounded-sm cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setCurrentMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="w-full">
          <h1 className="text-sm font-semibold text-black">{item.name}</h1>
          <div className="flex items-center gap-4 my-3.5">
            <h3 className="text-xl font-semibold text-black">₦{item.discounted_price.toLocaleString()}</h3>
            <h4 className="text-gray-500 text-sm line-through">₦{item.cost_price.toLocaleString()}</h4>
          </div>

          {/* Product info */}
          <div className="flex gap-12">
            <div className="flex flex-col gap-3">
              <h1 className="text-sm font-semibold text-black">Product Details</h1>
              <p className="text-xs text-black flex gap-2">
                <span className="font-semibold">Category:</span> {mapIdsToNames(item.categories, categoriesArray)}
              </p>

              <p className="text-xs text-black flex gap-2"><span className="font-semibold">Color:</span>
                {mapIdsToNames(item.colors, colorsArray)}
              </p>
              <p className="text-xs text-black flex gap-2"><span className="font-semibold">
                Sizes:</span> {mapIdsToNames(item.sizes, sizesArray)}</p>
              <p className="text-xs text-black flex gap-2"><span className="font-semibold">
                Material:</span> {formatFabrics(item.fabrics)}</p>
              <p className="text-xs text-black flex gap-2"><span className="font-semibold">Origin:</span>
                {vendor?.kyc_compliance?.city}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-sm font-semibold text-black">Inventory Information</h1>
              <p className="text-xs text-black flex gap-2"><span className="font-semibold">Stock:</span> {item.quantity} units</p>
              <p className="text-xs text-black flex gap-2"><span className="font-semibold">Shipping:</span> 2–3 business days</p>
              <p className="text-xs text-black flex gap-2"><span className="font-semibold">SKU:</span>
                {item?.sku}</p>
              <p className="text-xs text-black flex gap-2"><span className="font-semibold">Margin:</span> 42%</p>
              <p className="text-xs text-black flex gap-2"><span className="font-semibold">Return Policy:</span> 30 days</p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h1 className="text-sm font-semibold text-black">Product Description</h1>
            <p className="text-xs text-gray-600 leading-relaxed mt-2">{item.description}</p>
          </div>

          <hr className="text-gray-200 my-6" />
          {/* Review Notes */}
          {item?.status === "Approved" ? "" : <div className="mt-8">
            <h1 className="text-sm font-semibold text-black mb-2">Review Notes</h1>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Add notes or feedback about this product submission..."
              className="w-full h-[120px] border border-gray-300 rounded-md text-xs p-3 focus:outline-none focus:ring-1 focus:ring-black resize-none"
            ></textarea>
          </div>}
          {item?.status === "Approved" ? "" :

            <div className='flex gap-3 mt-4'>
              <button
                onClick={() => handleReject(item?.vendor_id, item?._id, reviewText)}
                className='px-5 py-2 text-xs font-semibold uppercase bg-red-600 border
                   border-red-400 text-white'>
                {rejecting ? "Rejecting" : "Reject"}
              </button>
              <button
                onClick={() => handleRequestCorrection(item?.vendor_id, item?._id, reviewText)}
                className='px-5 py-2 text-xs font-semibold uppercase text-gray-700 border
                     border-gray-300 hover:bg-gray-100'>

                {requesting ? "Requesting" : "Request Correction"}

              </button>
              <button
                onClick={() => handeleApproval(item?.vendor_id, item?._id)}
                disabled={item?.status === "Approved"}
                className={`px-5 py-2 text-xs font-semibold uppercase text-white bg-black hover:bg-gray-800
               ${item?.status === "Approved" ? "cursor-not-allowed" : ""}
               `}>
                {approving ? "Approving" : "Approve"}

              </button>
            </div>}
        </div>
      </div>
    </div>
  );
}

// ✅ Main Products component
function Products({ vendor, id, products: initialProducts }: ProductProps) {
  const [productQueue, setProductQueue] = useState<Product[]>(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    setProductQueue(initialProducts);
  }, [initialProducts]);

  const [queryParams, setQueryParams] = useState<CategoryQueryParams>({
    page_number: 1,
    page_size: 10,
    filter: {
      search_term: null,
      countries: {
        $in: [],
      },
    },
    sort_field: "name",
    sort_direction: 1,
  });

  const {
    data: categoriesArray = [],
  } = useCategories(queryParams);

  const {
    data: sizesArray = [],
  } = useFetchSizes();

  const {
    data: colorsArray = [],
  } = useFetchColors();

  const pageSize = 3;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = productQueue.slice(startIndex, endIndex);

  const totalPages = Math.ceil(productQueue.length / pageSize);

  const updateProductStatus = (productId: string, newStatus: string) => {
    setProductQueue(prevProducts =>
      prevProducts.map(p =>
        p._id === productId ? { ...p, status: newStatus } : p
      )
    );
  };

  return (
    <section className="bg-white px-4 mt-3.5 py-3">
      <button
        onClick={() => router.back()}
        className="text-xs flex items-center gap-1 cursor-pointer text-gray-600 mb-5  hover:text-gray-800"
      >
        <FaArrowLeft />
        <span>Back to Vendor Details</span>
      </button>

      {currentProducts.map((item, index) => (
        <ProductItem
          key={item._id || index}
          item={item}
          vendor={vendor}
          categoriesArray={categoriesArray}
          colorsArray={colorsArray}
          sizesArray={sizesArray}
          updateProductStatus={updateProductStatus}
        />
      ))}

      {/* Pagination Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        {currentPage > 1 && (
          <button
            className="px-5 py-2 text-xs font-semibold uppercase border border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Prev
          </button>
        )}

        {currentPage < totalPages && (
          <button
            className="px-5 py-2 text-xs font-semibold uppercase bg-black text-white hover:bg-gray-800"
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        )}
      </div>
    </section>
  )
}

export default Products