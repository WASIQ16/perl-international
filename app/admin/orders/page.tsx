"use client";

import React, { useEffect, useState } from "react";

const STATUS_COLORS: any = {
    "Pending": "bg-amber-100 text-amber-700",
    "Processing": "bg-blue-100 text-blue-700",
    "Shipped": "bg-indigo-100 text-indigo-700",
    "Delivered": "bg-emerald-100 text-emerald-700",
    "Cancelled": "bg-red-100 text-red-700",
};

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/orders");
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
            const res = await fetch("/api/admin/orders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (res.ok) {
                setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Order Management</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">View and manage customer orders and their delivery status.</p>
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-8 py-6 text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Order ID / Date</th>
                                    <th className="px-8 py-6 text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Customer</th>
                                    <th className="px-8 py-6 text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Items</th>
                                    <th className="px-8 py-6 text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Total</th>
                                    <th className="px-8 py-6 text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-black text-primary truncate max-w-[120px]">#{order._id.slice(-6).toUpperCase()}</div>
                                            <div className="text-xs text-slate-500 font-medium mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-slate-900 dark:text-white">{order.fullName}</div>
                                            <div className="text-xs text-slate-500 font-medium mt-0.5">{order.email}</div>
                                            <div className="text-xs text-slate-400 font-medium mt-1 italic">{order.city}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                {order.cartItems.length} {order.cartItems.length === 1 ? "item" : "items"}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                                                {order.cartItems.map((i: any) => i.name).join(", ").slice(0, 30)}...
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">Rs. {order.totalPrice.toFixed(2)}</div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="relative inline-block group">
                                                <select
                                                    disabled={updatingId === order._id}
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                    className={`appearance-none font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full border-none cursor-pointer focus:ring-2 focus:ring-primary transition-all text-center ${STATUS_COLORS[order.status] || "bg-slate-100 text-slate-700"}`}
                                                >
                                                    {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                                {updatingId === order._id && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full animate-pulse">
                                                       <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {orders.length === 0 && (
                        <div className="p-20 text-center">
                            <div className="text-4xl mb-4">📭</div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No orders found</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">As soon as customers start buying, you'll see them here.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
