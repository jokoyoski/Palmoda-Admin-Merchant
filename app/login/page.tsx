"use client";
import React, { useState } from "react";
import { useAuth } from "../_lib/AuthContext";
import {adminLogin} from "../_lib/admin"
import { toast } from "react-toastify";

function Page() {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: any) => {
       e.preventDefault();
       setLoading(true);
       try {
         const res = await adminLogin(email, password);
         
   if (res.success) {
     login(res); 
          toast.success("Login Successful");
          setLoading(false);
   }
          
       } catch (error: any) {
        toast.error(error.message);
       }finally{
        setLoading(false);
       }
  }


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
            className="bg-black hidden md:block text-white text-[18px] font-medium py-2 px-2"
          >
            Palmoda Dashboard
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="bg-black hidden md:block text-white text-[18px] font-medium py-2 px-2"
          >
            Merchant Dashboard
          </button>
        </div>

        {/* Login form (appears below on click) */}
        {showForm && (
          <div className="w-full max-w-[380px] mt-6 p-6 border rounded-xl shadow-md animate-slideDown">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Login</h3>

            <form 
             onSubmit={handleLogin}
            className="flex flex-col gap-4">
              <input
                type="email"
                 onChange={(e) => setEmail(e.target.value)}
              value={email}
                placeholder="Email"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="password"
                placeholder="Password"
                 onChange={(e) => setPassword(e.target.value)}
               value={password}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />

              <button
            type="submit"
            disabled={loading} // disable button when loading
            className={`w-full py-2 rounded-lg text-lg font-medium transition 
              ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-black text-white hover:bg-gray-900"}`}
          >
            {loading ? "Logging in..." : "Log In"}
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
