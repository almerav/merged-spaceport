"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bell, LogOut, Megaphone } from "lucide-react";
import { signOut } from 'next-auth/react';

const links = [
  { href: "/overview", label: "Dashboard", icon: <Home size={18} /> },
  { href: "/notifications", label: "Notifications", icon: <Bell size={18} /> }, // Added Notifications
  { href: "/campaign", label: "Campaign Management", icon: <Megaphone size={18} />},
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-70 min-h-screen bg-[#1c1c1b] text-white px-4 py-6">

      <h2 className="text-xl font-bold mb-8">Spaceport</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
              pathname === link.href
                ? "bg-[#8F8357]"
                : "hover:bg-[#575757] hover:bg-opacity-100 text-white"
            }`} 
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
        <button
          onClick={() =>
            signOut({
              callbackUrl: '/login',
            })
          }
          className="w-full flex items-center gap-3 px-4 py-2 rounded-md transition hover:bg-[#575757]  text-white"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
