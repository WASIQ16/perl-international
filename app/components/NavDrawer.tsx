"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CATEGORIES } from "../data/categories";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const NAV_LINKS = [
    { name: "Home", href: "#home" },
    { name: "Products", href: "#products" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
];

export default function NavDrawer({ isOpen, onClose }: NavDrawerProps) {
    const router = useRouter();
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

    const handleLinkClick = (href: string, isExternal?: boolean) => {
        onClose();
        if (isExternal) {
            window.open(href, "_blank");
            return;
        }
        if (href.startsWith("#")) {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            router.push(href);
        }
    };

    const handleCategoryClick = (slug: string) => {
        onClose();
        router.push(`/category/${slug}`);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-[110] bg-[#242553]/40 backdrop-blur-md transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed left-0 top-0 z-[111] h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-700 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 p-8 bg-[#fffffe]">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="Pearl International Logo"
                                width={210}
                                height={70}
                                className="h-20 w-auto object-contain"
                            />
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-2xl p-3 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            <svg className="h-6 w-6 text-[#242553]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 overflow-y-auto p-8">
                        <ul className="space-y-6">
                            {NAV_LINKS.map((link) => (
                                <li key={link.name}>
                                    <button
                                        onClick={() => handleLinkClick(link.href)}
                                        className="text-2xl font-black text-[#242553] hover:text-[#2587a7] transition-all transform hover:translate-x-2"
                                    >
                                        {link.name}
                                    </button>
                                </li>
                            ))}

                            {/* Categories Dropdown */}
                            <li>
                                <button
                                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                                    className="flex w-full items-center justify-between text-2xl font-black text-[#242553] hover:text-[#2587a7] transition-all transform hover:translate-x-2"
                                >
                                    <span>Categories</span>
                                    <svg
                                        className={`h-6 w-6 transition-transform duration-300 ${isCategoriesOpen ? "rotate-180" : ""}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                <div className={`grid transition-all duration-300 ease-in-out ${isCategoriesOpen ? "grid-rows-[1fr] mt-6 opacity-100" : "grid-rows-[0fr] mt-0 opacity-0 overflow-hidden"}`}>
                                    <div className="min-h-0 grid gap-3 pl-4">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat.slug}
                                                onClick={() => handleCategoryClick(cat.slug)}
                                                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all group"
                                            >
                                                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                                    <Image
                                                        src={cat.image}
                                                        alt={cat.title}
                                                        width={40}
                                                        height={40}
                                                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                                    />
                                                </div>
                                                <span className="font-bold text-slate-600 group-hover:text-[#2587a7] transition-colors">
                                                    {cat.title}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-slate-100 p-8">
                        <div className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-widest">
                            Contact Us
                        </div>
                        <p className="text-slate-600 mb-2 font-medium">sales@pearlinternational.com</p>
                        <p className="text-slate-600 font-medium">+92-21-34567890</p>
                    </div>
                </div>
            </div>
        </>
    );
}
