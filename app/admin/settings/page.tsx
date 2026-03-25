"use client";

import React, { useEffect, useState } from "react";

export default function AdminSettings() {
    const [showPrices, setShowPrices] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/settings");
            if (res.ok) {
                const data = await res.json();
                setShowPrices(data.showPrices);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage("");

        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ showPrices }),
            });

            if (res.ok) {
                setMessage("Settings saved successfully.");
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage("Failed to save settings.");
            }
        } catch (error) {
            setMessage("An error occurred.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-[#242553] tracking-tight">Store Settings</h1>
                <p className="text-slate-500 mt-1 font-medium">Manage global preferences for your public storefront.</p>
            </div>

            {loading ? (
                <div className="h-40 bg-slate-100 rounded-3xl animate-pulse w-full max-w-2xl" />
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm max-w-2xl p-8 space-y-8">
                    
                    {/* Price Visibility Toggle */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-bold text-[#242553] text-lg">Public Price Visibility</h3>
                            <p className="text-sm text-slate-500 font-medium mt-1 pr-6">
                                If enabled, product prices and checkout totals will be visible to all visitors. If disabled, prices will be hidden across the public site (useful for "Quote Only" catalogs).
                            </p>
                        </div>
                        
                        <label className="relative inline-flex items-center cursor-pointer mt-1 flex-shrink-0">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={showPrices}
                                onChange={(e) => setShowPrices(e.target.checked)}
                            />
                            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#2587a7]"></div>
                        </label>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-[#242553] hover:opacity-90 disabled:opacity-50 text-white font-black px-6 py-3 rounded-2xl shadow-xl shadow-[#242553]/20 transition-all active:scale-[0.98] flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : "Save Settings"}
                        </button>

                        {message && (
                            <span className={`text-sm font-bold ${message.includes("success") ? "text-emerald-500" : "text-red-500"}`}>
                                {message}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
