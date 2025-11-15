"use client";
import Link from "next/link";
import React from "react";
import {
  FiUserCheck,
  FiUsers,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { MdOutlineRateReview } from "react-icons/md";
import { usePathname } from "next/navigation";
import { IoMdInformationCircle } from "react-icons/io";
import { BsGraphUp } from "react-icons/bs";

function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar on login page
  if (pathname.includes("login")) {
    return null;
  }

  const links = [
    { href: "/application-review", label: "Application Review", icon: <FiUserCheck /> },
    { href: "/product-review-queue", label: "Product Review Queue", icon: <MdOutlineRateReview /> },
    { href: "/vendor-management", label: "Vendor Management", icon: <FiUsers /> },
    { href: "/", label: "Analytics", icon: <BsGraphUp /> },
    { href: "/settings", label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <aside
      className="hidden md:flex flex-col w-[230px] h-fit sticky left-0
      bg-white border-r border-gray-200 p-5 overflow-y-auto"
    >
      <nav className="flex flex-col gap-5  text-[15px]">
        {links.map(({ href, label, icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 font-semibold text-black rounded-md px-2 py-2 transition-all duration-200 
                ${
                  isActive
                    ? "bg-gray-100 text-black"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
            >
              {icon} {label}
            </Link>
          );
        })}

        {/* Divider */}
        <hr className="my-3 border-gray-200" />

        <div className="flex flex-col gap-4 mt-auto">
          <div className="bg-gray-100 text-gray-800 rounded-lg p-3 text-sm">
            <p className="font-medium flex items-center gap-1.5">
              <IoMdInformationCircle />
              Action Required
            </p>
            <p className="text-xs text-gray-600 mt-1">
              5 applications pending for over 48 hours
            </p>
          </div>

          <Link
            href="/logout"
            className="flex items-center gap-3 text-red-500 hover:text-red-700"
          >
            <FiLogOut /> Logout
          </Link>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
