import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import CheckoutModal from "./CheckoutModal";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
    const { showPrices } = useSettings();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const handleCheckout = () => {
        onClose();
        setIsCheckoutOpen(true);
    };

    return (
        <>
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
            />
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-[100] bg-[#242553]/40 backdrop-blur-md transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed right-0 top-0 z-[101] h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 p-8">
                        <h2 className="text-3xl font-black text-[#242553] tracking-tight">Your Cart</h2>
                        <button
                            onClick={onClose}
                            className="rounded-2xl p-3 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            <svg className="h-6 w-6 text-[#242553]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Items List */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="mb-6 rounded-[2rem] bg-slate-50 p-10">
                                    <svg className="h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <p className="text-lg text-slate-400 font-medium">Your cart is feeling light.</p>
                                <button
                                    onClick={onClose}
                                    className="mt-6 text-[#2587a7] font-black uppercase tracking-widest text-xs hover:tracking-[0.2em] transition-all"
                                >
                                    Start Exploring
                                </button>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item._id || item.id} className="flex gap-6 group">
                                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[1.5rem] bg-slate-50 border border-slate-100">
                                        <Image
                                            src={(item.images && item.images.length > 0 ? item.images[0] : item.image) || "/placeholder.png"}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-center py-1">
                                        <div className="mb-3">
                                            <h4 className="font-black text-[#242553] line-clamp-1 mb-1">{item.name}</h4>
                                            {showPrices ? (
                                                <p className="text-sm text-[#2587a7] font-black tracking-tight">Rs. {item.price.toFixed(2)}</p>
                                            ) : (
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Price on Request</p>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 rounded-xl bg-slate-50 px-3 py-1.5">
                                                <button
                                                    onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                                                    className="text-slate-400 hover:text-[#242553] transition-colors"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                                                    </svg>
                                                </button>
                                                <span className="text-sm font-black text-[#242553] w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                                                    className="text-slate-400 hover:text-[#242553] transition-colors"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item._id || item.id)}
                                                className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                        <div className="border-t border-slate-100 p-8 space-y-6 bg-slate-50/50">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-medium">Subtotal</span>
                                {showPrices ? (
                                    <span className="text-3xl font-black text-[#242553] tracking-tighter">Rs. {totalPrice.toFixed(2)}</span>
                                ) : (
                                    <span className="text-lg font-black text-[#242553] uppercase tracking-widest">Request Quote</span>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                Complimentary shipping on all premium orders. 
                                Taxes calculated at checkout.
                            </p>
                            <button
                                onClick={handleCheckout}
                                className="w-full h-16 rounded-2xl bg-[#2587a7] text-white font-black uppercase tracking-widest text-sm hover:bg-[#1e6d87] transition-all shadow-xl shadow-[#2587a7]/20 active:scale-95"
                            >
                                Proced to Checkout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
