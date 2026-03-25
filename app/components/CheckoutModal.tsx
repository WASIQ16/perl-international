"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
    const { cartItems, totalPrice, clearCart } = useCart();
    const { showPrices } = useSettings();
    const [step, setStep] = useState<"form" | "processing" | "success">("form");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        address: "",
        city: "",
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStep("processing");

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    cartItems,
                    totalPrice,
                }),
            });

            if (response.ok) {
                setStep("success");
                clearCart();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error || "Failed to process order"}`);
                setStep("form");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Something went wrong. Please try again.");
            setStep("form");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-[#242553]/60 backdrop-blur-xl transition-opacity"
                onClick={step === "form" ? onClose : undefined}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl overflow-hidden rounded-[3rem] bg-white shadow-2xl transition-all duration-500 transform border border-slate-100">
                <div className="p-10 md:p-16">
                    {step === "form" && (
                        <>
                            <div className="mb-12 flex items-center justify-between">
                                <div>
                                    <h2 className="text-4xl font-black text-[#242553] tracking-tighter">Checkout</h2>
                                    <p className="text-slate-400 font-medium mt-1 text-sm uppercase tracking-widest">Complete Your Order</p>
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

                            <div className="grid gap-12 lg:grid-cols-2">
                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                                        <input
                                            required
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full rounded-2xl border-none bg-slate-50 p-5 outline-none focus:ring-2 focus:ring-[#2587a7]/20 text-[#242553] font-bold transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                                        <input
                                            required
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full rounded-2xl border-none bg-slate-50 p-5 outline-none focus:ring-2 focus:ring-[#2587a7]/20 text-[#242553] font-bold transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">City</label>
                                        <input
                                            required
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="New York"
                                            className="w-full rounded-2xl border-none bg-slate-50 p-5 outline-none focus:ring-2 focus:ring-[#2587a7]/20 text-[#242553] font-bold transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Shipping Address</label>
                                        <textarea
                                            required
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="123 Street Name"
                                            className="w-full rounded-2xl border-none bg-slate-50 p-5 outline-none focus:ring-2 focus:ring-[#2587a7]/20 text-[#242553] font-bold transition-all placeholder:text-slate-300 resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full h-16 rounded-2xl bg-[#2587a7] text-white font-black uppercase tracking-widest text-sm hover:bg-[#1e6d87] transition-all shadow-xl shadow-[#2587a7]/20 active:scale-95 mt-4"
                                    >
                                        {showPrices ? `Place Order — Rs. ${totalPrice.toFixed(2)}` : "Request Quote"}
                                    </button>
                                </form>

                                {/* Summary */}
                                <div className="rounded-[2.5rem] bg-slate-50/50 p-8 border border-slate-100">
                                    <h3 className="mb-6 font-black text-[#242553] uppercase tracking-widest text-xs">Order Summary</h3>
                                    <div className="max-h-64 overflow-y-auto space-y-6 mb-8 pr-2 custom-scrollbar">
                                        {cartItems.map((item) => (
                                            <div key={item._id || item.id} className="flex justify-between items-center text-sm">
                                                <div className="flex flex-col">
                                                    <span className="text-[#242553] font-black line-clamp-1 mb-1">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[10px] font-black text-[#2587a7] uppercase tracking-tighter">Qty: {item.quantity}</span>
                                                </div>
                                                {showPrices ? (
                                                    <span className="font-black text-[#242553] ml-4 shrink-0">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                                                ) : (
                                                    <span className="font-black text-slate-400 ml-4 shrink-0 uppercase tracking-widest text-[10px]">TBD</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-slate-100 pt-6 flex justify-between items-center">
                                        <span className="font-black text-slate-400 uppercase tracking-widest text-xs">Grand Total</span>
                                        {showPrices ? (
                                            <span className="text-3xl font-black text-[#242553] tracking-tighter">Rs. {totalPrice.toFixed(2)}</span>
                                        ) : (
                                            <span className="text-sm font-black text-[#242553] uppercase tracking-widest">To Be Determined</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {step === "processing" && (
                        <div className="py-24 text-center">
                            <div className="mx-auto mb-10 h-24 w-24 animate-spin rounded-full border-4 border-[#2587a7] border-t-transparent shadow-xl shadow-[#2587a7]/10" />
                            <h2 className="text-4xl font-black text-[#242553] tracking-tight">Securing Excellence</h2>
                            <p className="mt-4 text-slate-400 font-medium">Please wait while we process your premium order.</p>
                        </div>
                    )}

                    {step === "success" && (
                        <div className="py-20 text-center">
                            <div className="mx-auto mb-10 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-green-50 text-green-500 shadow-xl shadow-green-500/10">
                                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-5xl font-black text-[#242553] tracking-tighter mb-4">Order Received</h2>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                Thank you for choosing Pearl International, <strong className="text-[#242553] font-black">{formData.fullName.split(' ')[0]}</strong>! <br />
                                A confirmation has been dispatched to <strong className="text-[#2587a7] font-black">{formData.email}</strong>.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-12 h-16 w-72 rounded-2xl bg-[#242553] text-white font-black uppercase tracking-widest text-sm hover:opacity-90 transition-all shadow-xl shadow-[#242553]/20 active:scale-95"
                            >
                                Return to Gallery
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
