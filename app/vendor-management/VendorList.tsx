import { Vendor } from "../_lib/type";

interface VendorListProps {
  vendors: Vendor[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  businessType: string;
  setBusinessType: React.Dispatch<React.SetStateAction<string>>;
  kyc: string;
  setKyc: React.Dispatch<React.SetStateAction<string>>;
}

export default function VendorList({
  vendors,
  search,
  setSearch,
  businessType,
  setBusinessType,
  kyc,
  setKyc
}: VendorListProps) {

  return (
    <section className="bg-white text-gray-800 w-full mt-6">
      {/* Tabs */}
      <div className="mb-6 flex gap-6 text-sm text-gray-500 font-medium">
        <p className="cursor-pointer hover:text-black">Active Vendors</p>
        <p className="cursor-pointer hover:text-black">Pending Applications</p>
        <p className="cursor-pointer hover:text-black">Rejected Applications</p>
      </div>

      <div className="flex gap-6">
        
        {/* FILTERS */}
        <div className="w-[22%] mb-4 flex flex-col gap-4 border border-gray-200 p-4 rounded-lg bg-gray-50">
           {/* Search */} <label className="text-xs font-medium text-gray-600">Search</label> 
           <input type="text" placeholder="Vendor, brand, product, email"
            className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-black/20" />
             {/* Business Type */} <label className="text-xs font-medium text-gray-600">Business Type</label> 
             <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black/20">
              <option>Any</option> <option>Limited company</option> <option>Sole proprietor</option> 
              </select> {/* Country */} <label className="text-xs font-medium text-gray-600">Country</label>
               <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black/20">
                <option>Any</option> <option>Nigeria</option> <option>Ghana</option> </select> {/* KYC Status */}
                 <label className="text-xs font-medium text-gray-600">KYC Status</label> 
                 <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2
                  focus:ring-black/20"> <option>Any</option> <option>Verified</option> 
                  <option>Pending</option> <option>Unverified</option>
                   </select> {/* Documents Missing */} 
                   <label className="text-xs font-medium text-gray-600">Document Missing</label> 
                   <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black/20"> <option>Any</option> <option>Yes</option> <option>No</option> </select> {/* Onboarding Age */} <label className="text-xs font-medium text-gray-600">Onboarding Age</label> <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black/20"> <option>Any</option> <option>0–3 months</option> <option>3–6 months</option> <option>6–12 months</option> <option>1+ years</option> </select> {/* Last Activity */} <label className="text-xs font-medium text-gray-600">Last Activity</label> <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black/20"> <option>Any</option> <option>Today</option> <option>This week</option> <option>This month</option> <option>1–3 months ago</option> <option>3+ months ago</option> </select> {/* Revenue Range */} <div className="flex flex-col gap-2"> <label className="text-xs font-medium text-gray-600">Revenue Range</label> <div className="flex items-center gap-2"> <input type="number" placeholder="Min" className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-black/20" /> <span className="text-gray-500">-</span> <input type="number" placeholder="Max" className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-black/20" /> </div> </div> {/* NEW CHECKBOX FILTERS */} <div className="flex flex-col gap-2 mt-2"> <label className="text-xs font-medium text-gray-600">More Filters</label> <label className="flex items-center gap-2 text-sm"> <input type="checkbox" className="accent-black" /> Flagged Only </label> <label className="flex items-center gap-2 text-sm"> <input type="checkbox" className="accent-black" /> With Disputes </label> <label className="flex items-center gap-2 text-sm"> <input type="checkbox" className="accent-black" /> Inventory Low </label> </div> {/* ACTION BUTTONS */} <div className="flex gap-4 justify-center mt-4"> <button className="bg-black text-white w-[100px] text-sm py-2 px-4 "> Apply </button> <button className="border border-gray-300 w-[100px] text-gray-700 text-sm py-2 px-4 bg-inherit"> Clear </button> </div> </div>

        {/* TABLE */}
        <div className="w-[78%] bg-white rounded-lg overflow-x-auto border border-gray-200 overflow-hidden">
          <table className="min-w-full table-fixed text-sm">
            <thead className="bg-gray-100 text-gray-600 sticky top-0">
              <tr>
                <th className="py-3 px-4 text-left font-semibold w-[12%]">Vendor</th>
                <th className="py-3 px-4 text-left font-semibold w-[12%]">Business Type</th>
                <th className="py-3 px-4 text-left font-semibold w-[8%]">KYC</th>
                <th className="py-3 px-4 text-left font-semibold w-[8%]">Docs</th>
                <th className="py-3 px-4 text-left font-semibold w-[8%]">Products</th>
                <th className="py-3 px-4 text-left font-semibold w-[10%]">Sales MTD</th>
                <th className="py-3 px-4 text-left font-semibold w-[8%]">Rating</th>
                <th className="py-3 px-4 text-left font-semibold w-[10%]">Last Activity</th>
                <th className="py-3 px-4 text-left font-semibold w-[6%]">Flag</th>
                <th className="py-3 px-4 text-left font-semibold w-[10%]">Status</th>
                <th className="py-3 px-4 text-left font-semibold w-[10%]">Action</th>
              </tr>
            </thead>

            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id} className="border-b border-gray-100 hover:bg-gray-50 transition">

                  <td className="py-3 px-4">{vendor.business_name}</td>

                  <td className="py-3 px-4">Limited company</td>

                  <td className="py-3 px-4">
                    {vendor.is_business_verified &&
                    vendor.is_identity_verified &&
                    vendor.is_bank_information_verified
                      ? "Verified"
                      : "Unverified"}
                  </td>

                  <td className="py-3 px-4">5</td>
                  <td className="py-3 px-4">0</td>
                  <td className="py-3 px-4">₦0</td>
                  <td className="py-3 px-4">0</td>
                  <td className="py-3 px-4 text-xs">{vendor.updated_at}</td>

                  <td className="py-3 px-4"></td>

                  <td className="py-3 px-4">
                    <span className="bg-gray-200 text-gray-900 px-3 py-1 text-xs">
                      {vendor.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="py-3 px-4 flex gap-2">
                    <button className="px-3 py-1 border text-black bg-inherit text-xs">View</button>
                    <button className="px-3 py-1 border text-black bg-inherit text-xs">Suspend</button>
                    <button className="px-3 py-1 border text-black bg-inherit text-xs">Message</button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </section>
  );
}
