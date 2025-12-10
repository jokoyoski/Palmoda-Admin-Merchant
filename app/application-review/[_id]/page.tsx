"use client";
import React, { useEffect, useState } from 'react'
import Applications from '../Applications'
import { useParams } from 'next/navigation';
import { getVendorDetails } from '@/app/_lib/vendors';
import { toast } from 'react-toastify';
import { Vendor, Product } from '@/app/_lib/type';
import { getVendorProducts } from '@/app/_lib/products';
import ProtectedRoute from '@/app/_components/ProtectedRoute';

function Page() {
  const { _id } = useParams();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const vendorId = _id as string;

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const res = await getVendorDetails(_id);

        if (!res?.data) {
          setError("Vendor not found");
          return;
        }
       console.log(res.data);
        setVendor(res.data);
      } catch (error: any) {
        setError(error?.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [_id]);

  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
         const res = await getVendorProducts(_id);
          if (!res?.data) {
          setError("Vendor not found");
          return;
        }
        console.log(res.data.data);
        const firstThreeProducts = res.data.data.slice(0, 3);
        setProducts(firstThreeProducts);
      } catch (error: any) {
        setError("Failed to load vendor details");
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchVendorProducts();
  }, [_id])

  // ⏳ Loading State
  if (loading) {
    return (
      <ProtectedRoute>
        <section className="bg-white min-h-screen px-4 md:px-8 py-6 w-full flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading vendor details...</p>
      </section>
      </ProtectedRoute>
    );
  }

  // ❌ Vendor Not Found / Error
  if (error || !vendor) {
    return (
      <ProtectedRoute>
        <section className="bg-white min-h-screen px-4 md:px-8 py-6 w-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-red-500 font-bold text-lg">{error || "Vendor not found"}</h2>
          <p className="text-gray-600 text-sm mt-2">
            The vendor you are trying to review does not exist or has been removed.
          </p>
        </div>
      </section>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <section className='bg-white min-h-screen px-4 md:px-8 py-6 w-full'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-black font-bold text-xl'>Vendor Applications Review</h1>
          <p className='text-gray-500 text-xs'>Review and process incoming vendor applications</p>
        </div>
        <div className='flex gap-3 items-center'>
          {/* <button className='bg-inherit border border-black text-black py-[5px] px-2.5 w-fit text-xs'>
            Filter Status
          </button>
          <button className='bg-inherit border border-black text-black py-[5px] px-2.5 w-fit text-xs'>
            Sort Date
          </button> */}
        </div>
      </div>

     <Applications vendor={vendor} id={vendorId} products={products || []} setVendor={setVendor}/>
    </section>
    </ProtectedRoute>
  );
}

export default Page;
