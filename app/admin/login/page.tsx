"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Step = "login" | "forgot" | "verify";

export default function AdminLogin() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("login");
    
    // Form States
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [emailOrUser, setEmailOrUser] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    
    // UI States
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

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

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("/api/admin/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usernameOrEmail: emailOrUser }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setStep("verify");
            } else {
                setError(data.error || "Failed to request reset");
            }
        } catch (err) {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("/api/admin/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    usernameOrEmail: emailOrUser,
                    otp,
                    newPassword
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Password reset successfully. You can now log in.");
                setStep("login");
                // Clear reset fields
                setOtp("");
                setNewPassword("");
                setUsername(emailOrUser); // pre-fill username if possible
            } else {
                setError(data.error || "Failed to reset password");
            }
        } catch (err) {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const resetState = (newStep: Step) => {
        setError("");
        setMessage("");
        setStep(newStep);
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
                    <h1 className="text-3xl font-black text-[#242553] tracking-tight italic uppercase">
                        {step === "login" ? "Admin Portal" : step === "forgot" ? "Reset Password" : "Verify OTP"}
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        {step === "login" && "Please sign in to manage your empire."}
                        {step === "forgot" && "Enter your username or email to receive a code."}
                        {step === "verify" && "Check your email for the 6-digit code."}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 text-xs font-bold px-4 py-3 rounded-xl border border-red-100 text-center uppercase tracking-widest antialiased">
                        {error}
                    </div>
                )}
                
                {message && step !== "login" && (
                    <div className="bg-emerald-50 text-emerald-600 text-xs font-bold px-4 py-3 rounded-xl border border-emerald-100 text-center uppercase tracking-widest antialiased">
                        {message}
                    </div>
                )}

                {/* LOGIN STEP */}
                {step === "login" && (
                    <form onSubmit={handleLogin} className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                        {message && (
                            <div className="bg-emerald-50 text-emerald-600 text-xs font-bold px-4 py-3 rounded-xl border border-emerald-100 text-center uppercase tracking-widest antialiased">
                                {message}
                            </div>
                        )}
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

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-[#242553] hover:opacity-90 disabled:opacity-50 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-[#242553]/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                 <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : "Sign In Now"}
                        </button>

                        <div className="text-center mt-4 border-t border-slate-100 pt-6">
                            <button 
                                type="button"
                                onClick={() => resetState("forgot")}
                                className="text-xs font-bold text-[#2587a7] hover:text-[#1e6d87] transition-colors tracking-widest uppercase"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </form>
                )}

                {/* FORGOT PASSWORD STEP */}
                {step === "forgot" && (
                    <form onSubmit={handleForgotPassword} className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Username or Email</label>
                            <input
                                required
                                type="text"
                                placeholder="admin@example.com"
                                value={emailOrUser}
                                onChange={(e) => setEmailOrUser(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#2587a7]/20 transition-all font-bold text-[#242553]"
                            />
                        </div>

                        <button
                            disabled={loading || !emailOrUser}
                            type="submit"
                            className="w-full bg-[#2587a7] hover:opacity-90 disabled:opacity-50 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-[#2587a7]/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 tracking-widest uppercase text-sm"
                        >
                            {loading ? (
                                 <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : "Send Reset Code"}
                        </button>

                        <div className="text-center mt-4">
                            <button 
                                type="button"
                                onClick={() => resetState("login")}
                                className="text-xs font-bold text-slate-400 hover:text-[#242553] transition-colors tracking-widest uppercase"
                            >
                                Back to Login
                            </button>
                        </div>
                    </form>
                )}

                {/* VERIFY OTP STEP */}
                {step === "verify" && (
                    <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">6-Digit Code</label>
                            <input
                                required
                                type="text"
                                placeholder="123456"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // only numbers
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#2587a7]/20 transition-all font-black text-center tracking-[1em] text-2xl text-[#2587a7] placeholder:text-slate-200 placeholder:tracking-normal placeholder:font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">New Password</label>
                            <input
                                required
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#2587a7]/20 transition-all font-bold text-[#242553]"
                            />
                        </div>

                        <button
                            disabled={loading || otp.length < 6 || !newPassword}
                            type="submit"
                            className="w-full bg-[#242553] hover:opacity-90 disabled:opacity-50 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-[#242553]/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 tracking-widest uppercase text-sm"
                        >
                            {loading ? (
                                 <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : "Secure New Password"}
                        </button>

                        <div className="text-center mt-4">
                            <button 
                                type="button"
                                onClick={() => resetState("forgot")}
                                className="text-xs font-bold text-slate-400 hover:text-[#242553] transition-colors tracking-widest uppercase"
                            >
                                Didn't Receive Code?
                            </button>
                        </div>
                    </form>
                )}

                <div className="text-center pt-2">
                    <button 
                        onClick={() => router.push("/")}
                        className="text-[10px] font-bold text-slate-300 hover:text-slate-500 transition-colors tracking-widest uppercase border-b border-transparent hover:border-slate-300 pb-1"
                    >
                        Return to Public Store
                    </button>
                </div>
            </div>
        </div>
    );
}
