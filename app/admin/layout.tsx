"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Simple client-side check for the cookie (though httpOnly cookies aren't accessible)
        // In a real app, you'd use a server component or middleware.
        // For this implementation, we'll check via a small API call or assume redirect on 401.
        if (pathname === "/admin/login") {
            setAuthorized(true);
            return;
        }

        const checkAuth = async () => {
            try {
                const res = await fetch("/api/admin/check-auth");
                if (res.ok) {
                    setAuthorized(true);
                } else {
                    router.replace("/admin/login");
                }
            } catch (error) {
                router.replace("/admin/login");
            }
        };
        checkAuth();
    }, [pathname, router]);

    if (!authorized && pathname !== "/admin/login") {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="h-10 w-10 border-4 border-[#2587a7] border-t-transparent rounded-full animate-spin" />
        </div>;
    }

    const handleLogout = () => {
        document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.replace("/admin/login");
    };


    const navItems = [
        { name: "Dashboard", href: "/admin", icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )},
        { name: "Products", href: "/admin/products", icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        )},
        { name: "Orders", href: "/admin/orders", icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        )},
        { name: "Settings", href: "/admin/settings", icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )},
    ];

    // If user is on the login page, just return the content (no sidebar)
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10 transition-all">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logo.png"
                            alt="Admin Logo"
                            width={120}
                            height={40}
                            className="h-8 w-auto object-contain"
                        />
                        <span className="font-black text-xl tracking-tighter text-[#242553] uppercase italic">Admin</span>
                    </div>
                </div>
                
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                pathname === item.href
                                    ? "bg-[#242553] text-white shadow-lg shadow-[#242553]/20"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-[#2587a7]"
                            }`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 space-y-1">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all w-full text-left"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>

                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-[#2587a7] transition-all"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
