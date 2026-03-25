"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";
import { CATEGORIES } from "../data/categories";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const NAV_LINKS = [
    { name: "Home", href: "#home" },
    { name: "Categories", href: "#categories" },
    { name: "Products", href: "#products" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
    { name: "Admin Portal", href: "/admin", isExternal: true },
];

export default function NavDrawer({ isOpen, onClose }: NavDrawerProps) {
    const { theme, toggleTheme } = useTheme();

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
                className={`fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed left-0 top-0 z-[111] h-full w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="Pearl International Logo"
                                width={120}
                                height={40}
                                className="h-8 w-auto object-contain"
                            />
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <svg className="h-6 w-6 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 overflow-y-auto p-8">
                        <ul className="space-y-6">
                            {NAV_LINKS.map((link) => (
                                <li key={link.name}>
                                    <button
                                        onClick={() => handleLinkClick(link.href, link.isExternal)}
                                        className="text-2xl font-black text-primary hover:text-accent dark:text-white dark:hover:text-accent transition-all transform hover:translate-x-2"
                                    >
                                        {link.name}
                                    </button>
                                </li>
                            ))}

                            {/* Categories Dropdown */}
                            <li>
                                <button
                                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                                    className="flex w-full items-center justify-between text-2xl font-black text-primary hover:text-accent dark:text-white dark:hover:text-accent transition-all transform hover:translate-x-2"
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
                                                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group group-hover:translate-x-1"
                                            >
                                                <div className={`h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${cat.color}`}>
                                                    <Image
                                                        src={cat.image}
                                                        alt={cat.title}
                                                        width={40}
                                                        height={40}
                                                        className="h-full w-full object-cover opacity-50 transition-transform group-hover:scale-110"
                                                    />
                                                </div>
                                                <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-accent transition-colors">
                                                    {cat.title}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </li>
                        </ul>

                        {/* Dark / Light Toggle */}
                        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Appearance</p>
                            <button
                                onClick={toggleTheme}
                                className="flex items-center justify-between w-full bg-slate-100 dark:bg-slate-800 px-5 py-4 rounded-2xl transition-all hover:bg-slate-200 dark:hover:bg-slate-700 group"
                                aria-label="Toggle theme"
                            >
                                <span className="flex items-center gap-3">
                                    {theme === "dark" ? (
                                        <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                    )}
                                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                                    </span>
                                </span>
                                {/* Toggle pill */}
                                <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${theme === "dark" ? "bg-amber-400" : "bg-slate-400"}`}>
                                    <div className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`} />
                                </div>
                            </button>
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-slate-100 dark:border-slate-800 p-8">
                        <div className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-widest">
                            Contact Us
                        </div>
                        <p className="text-secondary dark:text-slate-400 mb-2">sales@pearlinternational.com</p>
                        <p className="text-secondary dark:text-slate-400">+92-21-34567890</p>
                    </div>
                </div>
            </div>
        </>
    );
}
