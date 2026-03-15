import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import CheckoutModal from "./CheckoutModal";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
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
                className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed right-0 top-0 z-[101] h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-6">
                        <h2 className="text-2xl font-bold dark:text-white">Your Cart</h2>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <svg className="h-6 w-6 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Items List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="mb-4 rounded-full bg-slate-100 dark:bg-slate-800 p-6">
                                    <svg className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <p className="text-secondary dark:text-slate-400">Your cart is empty.</p>
                                <button
                                    onClick={onClose}
                                    className="mt-6 text-accent font-bold hover:underline"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item._id || item.id} className="flex gap-4">
                                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between py-1">
                                        <div>
                                            <h4 className="font-bold dark:text-white line-clamp-1">{item.name}</h4>
                                            <p className="text-sm text-secondary dark:text-slate-400">Rs. {item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1">
                                                <button
                                                    onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                                                    className="text-slate-500 hover:text-accent"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                    </svg>
                                                </button>
                                                <span className="text-sm font-bold dark:text-white w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                                                    className="text-slate-500 hover:text-accent"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item._id || item.id)}
                                                className="text-xs font-bold text-red-500 hover:underline"
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
                        <div className="border-t border-slate-100 dark:border-slate-800 p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                                <span className="text-2xl font-black dark:text-white">Rs. {totalPrice.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-secondary dark:text-slate-500">
                                Shipping and taxes calculated at checkout.
                            </p>
                            <button
                                onClick={handleCheckout}
                                className="w-full h-14 rounded-xl bg-accent text-white font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25"
                            >
                                Checkout Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
