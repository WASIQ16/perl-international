"use client";

import React from "react";
import Image from "next/image";

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
];

export default function NavDrawer({ isOpen, onClose }: NavDrawerProps) {
    const handleLinkClick = (href: string) => {
        onClose();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed left-0 top-0 z-[111] h-full w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo.svg"
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
                                        onClick={() => handleLinkClick(link.href)}
                                        className="text-2xl font-black text-primary hover:text-accent dark:text-white dark:hover:text-accent transition-all transform hover:translate-x-2"
                                    >
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
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
