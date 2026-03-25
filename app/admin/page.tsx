"use client";

import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0,
        pendingOrders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [ordersRes, productsRes] = await Promise.all([
                    fetch("/api/admin/orders"),
                    fetch("/api/products")
                ]);
                
                const orders = await ordersRes.json();
                const products = await productsRes.json();
                
                const totalRevenue = orders.reduce((acc: number, order: any) => acc + order.totalPrice, 0);
                const pendingOrders = orders.filter((order: any) => order.status === "Pending").length;
                
                setStats({
                    totalOrders: orders.length,
                    totalProducts: products.length,
                    totalRevenue,
                    pendingOrders
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { name: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: "💰", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
        { name: "Total Orders", value: stats.totalOrders, icon: "📦", color: "bg-blue-50 text-blue-600 border-blue-100" },
        { name: "Pending Orders", value: stats.pendingOrders, icon: "⏳", color: "bg-amber-50 text-amber-600 border-amber-100" },
        { name: "Total Products", value: stats.totalProducts, icon: "🏷️", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-[#242553] tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-500 mt-1 font-medium">Welcome back! Here's what's happening today.</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-slate-100 rounded-2xl border border-slate-200" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card) => (
                        <div key={card.name} className={`p-6 bg-white rounded-2xl border ${card.color.split(' ')[2]} shadow-sm transition-all hover:shadow-md`}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl">{card.icon}</span>
                                <span className={`text-xs font-black uppercase tracking-widest ${card.color.split(' ')[1]}`}>{card.name}</span>
                            </div>
                            {card.name === "Total Revenue" ? (
                                <div className="text-4xl font-black text-[#242553] mb-1">
                                    {card.value}
                                </div>
                            ) : (
                                <div className="text-3xl font-black text-[#242553] tracking-tighter">
                                    {card.value}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Actions or Recent Activity placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-[#242553] mb-6 tracking-tight">Recent Activity</h3>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 italic font-medium">No recent activity detected.</p>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-[#242553] to-[#2587a7] p-8 rounded-[2rem] text-white shadow-xl shadow-[#242553]/20 relative overflow-hidden group">
                     {/* Decorative waves or blobs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl transition-all group-hover:bg-white/20" />
                    
                    <h3 className="text-xl font-bold mb-4 relative z-10">Administrative Tips</h3>
                    <ul className="space-y-3 text-sm text-white/70 relative z-10 font-medium">
                        <li>• Keep your inventory up to date to avoid overselling.</li>
                        <li>• High-quality images significantly increase conversion rates.</li>
                        <li>• Respond to orders quickly for better customer satisfaction.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
