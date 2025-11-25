"use client";
import React, { useState } from 'react'
import { CiUser } from 'react-icons/ci'
import img1 from "../../public/assets/acf62735-b103-4181-8e53-efa013a84b29.png"
import img2 from "../../public/assets/7c6f6e3f-9ad5-47d3-97f3-0e61978d84da.png"
import img3 from "../../public/assets/83ef0ffa-4ff6-4238-ae16-a52c665cb78a.png"
import img4 from "../../public/assets/c02bb544-697e-46df-8aea-0a70631e59b5.png"
import img5 from "../../public/assets/d4d4d3b5-8157-4cd7-bab4-d06e330430e1.png"
import { CategoryQueryParams } from "@/types";
import { useCategories } from "../_lib/categories";
import { useFetchGenders } from "../_lib/gender";
import { useFetchSizes } from "../_lib/sizes";
import { useFetchColors, addColor } from "../_lib/colors";
import Image from 'next/image'
import { Product, Vendor } from '../_lib/type'
import { approveProduct, rejectProduct } from '../_lib/products';
import { toast } from 'react-toastify';
import { FaL } from 'react-icons/fa6';

interface ProductProps {
  vendor: Vendor | null;
  id: string;
  products: Product[];

}


function Products({ vendor, id, products,  }: ProductProps) {
  const [colors, setColors] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
    const [gender, setGender] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rejecting, setRejecting] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [approving, setApproving] = useState(false);

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
        isLoading,
        isError,
        error,
      } = useCategories(queryParams);
    
    
      const {
        data: gendersArray = [],
        isLoading: genderLoading,
        isError: isGenderError,
        error: genderError,
      } = useFetchGenders();
    
      const {
        data: sizesArray = [],
        isLoading: sizesLoading,
        isError: sizesIsError,
        error: sizesError,
      } = useFetchSizes();
    
      const {
        data: colorsArray = [],
        isLoading: colorsLoader,
        isError: colorIsError,
        error: colorError,
      } = useFetchColors();

        const pageSize = 1
      const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = products.slice(startIndex, endIndex);

  const totalPages = Math.ceil(products.length / pageSize);

  const mapIdsToNames = (ids: string[], referenceArray: { _id: string; name: string }[]) => {
  return ids
    .map(id => referenceArray.find(ref => ref._id === id)?.name)
    .filter(Boolean)
    .join(", ") || "N/A";
};

// For fabrics/materials
const formatFabrics = (fabrics: string[]) => fabrics?.join(", ") || "N/A";

  const handeleApproval = async (vednorId: string, prodId: string) => {
     try {
       setApproving(true);
       const res = await approveProduct(vednorId, prodId);
       if(res.success){
   toast.success(res.message);
} else {
   toast.error(res.message);
}
     } catch (error: any) {
       toast.error(error?.message)
     }finally{
      setApproving(false)
     }
  }

  const handleReject = async (vednorId:string, prodId: string, reason: string) => {
     try {
      setRejecting(true);
       const res = await rejectProduct(vednorId, prodId, reason);
       if(res.success){
   toast.success(res.message);
} else {
   toast.error(res.message);
}
     } catch (error: any) {
      toast.error(error?.message);
     }finally{
      setRejecting(false)
     }
  }


  return (
     <section className="bg-white px-4 mt-3.5 py-3">
      {currentProducts.map((item, index) => (
        <div key={index} className="p-3 border border-gray-200 mb-4">
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
                src={item.images[0]}
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
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="w-full">
              <h1 className="text-sm font-semibold text-black">{item.name}</h1>
              <div className="flex items-center gap-4 my-3.5">
                <h3 className="text-xl font-semibold text-black">{item.discounted_price}</h3>
                <h4 className="text-gray-500 text-sm line-through">{item.cost_price}</h4>
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
             {item?.status === "Approved" ? "" :  <div className="mt-8">
                <h1 className="text-sm font-semibold text-black mb-2">Review Notes</h1>
                <textarea
                onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Add notes or feedback about this product submission..."
                  className="w-full h-[120px] border border-gray-300 rounded-md text-xs p-3 focus:outline-none focus:ring-1 focus:ring-black resize-none"
                ></textarea>
              </div>}  
             {item?.status === "Approved" ? "" : 
             
             <div className='flex gap-3 mt-4'>
                 <button className='px-5 py-2 text-xs font-semibold uppercase text-gray-700 border
                  border-gray-300 hover:bg-gray-100'> Flag for Review </button> 
                  <button
                  onClick={() => handleReject(item?.vendor_id, item?._id, rejectReason)}
                  className='px-5 py-2 text-xs font-semibold uppercase bg-red-600 border
                   border-red-400 text-white'>
                    {rejecting ? "Rejecting": "Reject"}
                   </button>
                    <button className='px-5 py-2 text-xs font-semibold uppercase text-gray-700 border
                     border-gray-300 hover:bg-gray-100'> Request Correction </button>
               <button 
               onClick={() => handeleApproval(item?.vendor_id,  item?._id)}
               className='px-5 py-2 text-xs font-semibold uppercase text-white bg-black hover:bg-gray-800'>
               {approving ? "Approving" :   "Approve" }
                 
                 </button> 
                 </div>}
            </div>
          </div>
        </div>
      ))}

      {/* Pagination Buttons */}
      {/* Pagination Buttons */}
<div className="flex justify-end gap-3 mt-6">

  {/* Show Prev only if NOT on first page */}
  {currentPage > 1 && (
    <button
      className="px-5 py-2 text-xs font-semibold uppercase border border-gray-300 text-gray-700 hover:bg-gray-100"
      onClick={() => setCurrentPage(prev => prev - 1)}
    >
      Prev
    </button>
  )}

  {/* Show Next only if NOT on last page */}
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
