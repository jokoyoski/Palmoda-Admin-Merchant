"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiSearch, FiMenu, FiX, FiUserCheck, FiUsers } from "react-icons/fi";
import { CiUser } from "react-icons/ci";
import React, { useEffect, useRef, useState } from "react";
import {
  FiUserPlus,
  FiFileText,
  FiTag,
  FiGrid,
  FiShoppingCart,
  FiDollarSign,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { BsGraphUp } from "react-icons/bs";
import { MdOutlineRateReview } from "react-icons/md";
import { useAuth } from "../_lib/AuthContext";
import { useRouter } from "next/navigation";

function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [firstname, setfirstName] = useState("");
  const [lastname, setlastName] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    setfirstName(user?.first_name || "");
    setlastName(user?.last_name || "");
  }, [user]);

  useEffect(() => {
    if (!userMenuOpen) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setUserMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [userMenuOpen]);

  if (pathname.includes("login")) return null;

  const navItems = [
    { href: "/application-review", label: "Application Review" , icon: <FiUserCheck />},
    { href: "/product-review-queue", label: "Product Review Queue", icon: <MdOutlineRateReview /> },
    { href: "/vendor-management", label: "Vendor Management", icon: <FiUsers /> },
    { href: "/", label: "Analytics", icon: <BsGraphUp /> },
    { href: "/settings", label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <>
      <header className="flex fixed top-0 left-0 w-full items-center justify-between px-4 py-3 border-b border-b-gray-200 bg-white z-50">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          <Link
            href="/"
            className="uppercase text-black text-[15px] font-semibold"
          >
            Palmoda
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1 w-fit md:w-[400px] focus-within:ring-2 focus-within:ring-gray-300 transition">
          <FiSearch className="text-gray-500 text-[18px]" />
          <input
            type="search"
            placeholder="Search for brands, products and more"
            className="bg-transparent outline-none text-[14px] text-gray-700 placeholder-gray-500 w-full px-2"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-2"
            >
              <CiUser size={25} color="black" />
              <h2 className="font-semibold text-black text-[15px]">
                {firstname} {lastname}
              </h2>
            </button>

            {userMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-full min-w-full rounded-md border border-gray-200 bg-white shadow-lg z-50">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed top-10 left-0 w-full h-screen bg-black/50 z-40 transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <aside
          className={`bg-gray-50 w-64 h-full p-5 overflow-y-auto fixed top-0 left-0 transform transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside menu
        >
          <nav className="flex flex-col gap-5 mt-20 text-[15px]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center font-semibold gap-5 text-[15px]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            <hr className="my-3 border-gray-200" />

            <button
              onClick={logout}
              className="flex items-center gap-3 text-red-500 hover:text-red-700 mt-auto"
            >
              Logout
            </button>
          </nav>
        </aside>
      </div>
    </>
  );
}

export default Header;
