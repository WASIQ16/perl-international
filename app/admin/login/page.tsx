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
                // In a real app we'd use a better session, for now we can use a simple cookie or state
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-10 space-y-8 animate-in zoom-in-95 fade-in duration-500">
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
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase">Admin Portal</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Please sign in to manage your empire.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-2">Username</label>
                        <input
                            required
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary transition-all font-bold text-slate-900 dark:text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-2">Password</label>
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary transition-all font-bold text-slate-900 dark:text-white"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-bold px-4 py-3 rounded-xl border border-red-100 dark:border-red-900/30 text-center uppercase tracking-widest antialiased">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-primary hover:bg-blue-700 disabled:opacity-50 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                             <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : "Sign In Now"}
                    </button>
                </form>

                <div className="text-center">
                    <button 
                        onClick={() => router.push("/")}
                        className="text-xs font-bold text-slate-400 hover:text-primary transition-colors tracking-widest uppercase"
                    >
                        Return to Public Site
                    </button>
                </div>
            </div>
        </div>
    );
}
