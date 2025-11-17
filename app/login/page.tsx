"use client";
import React, { useState } from "react";

function Page() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white min-h-screen flex flex-col text-center text-black">
      {/* Top header */}
      <h1 className="text-[19px] uppercase mt-4">Palmoda</h1>

      {/* Center section */}
      <div className="flex flex-col flex-1 items-center justify-center gap-6">
        <h2 className="text-3xl text-gray-700 font-semibold">Log in</h2>

        <div className="flex items-center justify-center gap-5">
          <button
            onClick={() => setShowForm(true)}
            className="bg-black hidden md:block text-white text-[18px] font-medium py-2 px-[8px]"
          >
            Palmoda Dashboard
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="bg-black hidden md:block text-white text-[18px] font-medium py-2 px-[8px]"
          >
            Merchant Dashboard
          </button>
        </div>

        {/* Login form (appears below on click) */}
        {showForm && (
          <div className="w-full max-w-[380px] mt-6 p-6 border rounded-xl shadow-md animate-slideDown">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Login</h3>

            <form className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />

              <button
                type="submit"
                className="bg-black text-white py-2 rounded-lg text-[17px] font-medium hover:bg-gray-900 transition"
              >
                Log in
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Animation */}
      <style jsx>{`
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Page;
