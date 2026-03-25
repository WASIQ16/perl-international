"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                router.replace("/admin");
            } else {
                setError("Invalid username or password");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-10 space-y-8 animate-in zoom-in-95 fade-in duration-500">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/logo.png"
                            alt="Pearl International Logo"
                            width={180}
                            height={60}
                            className="mx-auto h-12 w-auto object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-3xl font-black text-[#242553] tracking-tight italic uppercase">Admin Portal</h1>
                    <p className="text-slate-500 mt-2 font-medium">Please sign in to manage your empire.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Username</label>
                        <input
                            required
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#2587a7]/20 transition-all font-bold text-[#242553]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Password</label>
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#2587a7]/20 transition-all font-bold text-[#242553]"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 text-xs font-bold px-4 py-3 rounded-xl border border-red-100 text-center uppercase tracking-widest antialiased">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-[#242553] hover:opacity-90 disabled:opacity-50 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-[#242553]/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                             <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : "Sign In Now"}
                    </button>
                </form>

                <div className="text-center">
                    <button 
                        onClick={() => router.push("/")}
                        className="text-xs font-bold text-slate-400 hover:text-[#2587a7] transition-colors tracking-widest uppercase"
                    >
                        Return to Public Site
                    </button>
                </div>
            </div>
        </div>
    );
}
