"use client";
import React, { useState } from "react";
import { useAuth } from "../_lib/AuthContext";
import { adminLogin } from "../_lib/admin";
import { toast } from "react-toastify";
import { Button } from "@heroui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

function Page() {
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
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-white min-h-screen flex items-center justify-center text-center text-black px-4">
      <div className="w-full max-w-[420px] flex flex-col items-center gap-6">
        {/* Top header */}
        <h1 className="text-[19px] uppercase">Palmoda</h1>

        {/* Center section */}
        <div className="w-full flex flex-col items-center gap-6">
          <h2 className="text-3xl text-gray-700 font-semibold">Log in</h2>

          <div className="w-full p-6 border rounded-xl shadow-md animate-slideDown">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Login</h3>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="border border-gray-300 w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-0">
                  <Button
                    radius="none"
                    className="bg-transparent"
                    onPress={() => setShowPassword(!showPassword)}
                    isIconOnly
                    startContent={showPassword ? <FaEye /> : <FaEyeSlash />}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg text-lg font-medium transition 
              ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-black text-white hover:bg-gray-900"}`}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
          </div>
        </div>
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
