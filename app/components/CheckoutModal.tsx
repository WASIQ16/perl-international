"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
    const { cartItems, totalPrice, clearCart } = useCart();
    const [step, setStep] = useState<"form" | "processing" | "success">("form");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        address: "",
        city: "",
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("processing");

        // Simulate API call
        setTimeout(() => {
            setStep("success");
            clearCart();
        }, 2000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                onClick={step === "form" ? onClose : undefined}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl transition-all duration-300 transform">
                <div className="p-8 md:p-12">
                    {step === "form" && (
                        <>
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-black dark:text-white">Checkout</h2>
                                    <p className="text-secondary dark:text-slate-400">Complete your order details below.</p>
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

                            <div className="grid gap-8 lg:grid-cols-2">
                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold dark:text-white">Full Name</label>
                                        <input
                                            required
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-accent dark:border-slate-800 dark:bg-slate-800 dark:text-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold dark:text-white">Email Address</label>
                                        <input
                                            required
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-accent dark:border-slate-800 dark:bg-slate-800 dark:text-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold dark:text-white">Shipping Address</label>
                                        <textarea
                                            required
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="123 Street Name"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-accent dark:border-slate-800 dark:bg-slate-800 dark:text-white transition-all resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full h-14 rounded-xl bg-accent text-white font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25"
                                    >
                                        Place Order - ${totalPrice.toFixed(2)}
                                    </button>
                                </form>

                                {/* Summary */}
                                <div className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-800/50">
                                    <h3 className="mb-4 font-bold dark:text-white">Order Summary</h3>
                                    <div className="max-h-60 overflow-y-auto space-y-4 mb-6 pr-2">
                                        {cartItems.map((item) => (
                                            <div key={item._id || item.id} className="flex justify-between text-sm">
                                                <span className="text-secondary dark:text-slate-400">
                                                    {item.name} <span className="font-bold">x{item.quantity}</span>
                                                </span>
                                                <span className="font-bold dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between">
                                        <span className="font-bold dark:text-white">Total</span>
                                        <span className="text-xl font-black text-accent">${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {step === "processing" && (
                        <div className="py-20 text-center">
                            <div className="mx-auto mb-6 h-20 w-20 animate-spin rounded-full border-4 border-accent border-t-transparent" />
                            <h2 className="text-2xl font-bold dark:text-white">Processing Order...</h2>
                            <p className="mt-2 text-secondary dark:text-slate-400">Please wait while we finalize your purchase.</p>
                        </div>
                    )}

                    {step === "success" && (
                        <div className="py-20 text-center">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-900/30">
                                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-4xl font-black dark:text-white">Order Confirmed!</h2>
                            <p className="mt-4 text-lg text-secondary dark:text-slate-400">
                                Thank you for your purchase, **{formData.fullName}**! <br />
                                We've sent a confirmation email to **{formData.email}**.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-10 h-14 w-64 rounded-xl bg-accent text-white font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
