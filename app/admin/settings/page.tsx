"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const router = useRouter();
    const [step, setStep] = useState<"request" | "verify" | "reset">("request");
    
    // Form Input States
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // UI States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        
        try {
            const res = await fetch("/api/admin/settings/send-otp", { method: "POST" });
            const data = await res.json();
            
            if (res.ok) {
                setSuccess("An OTP has been sent to wasiq161102@gmail.com.");
                setStep("verify");
            } else {
                setError(data.error || "Failed to send OTP.");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            const res = await fetch("/api/admin/settings/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otp }),
            });
            const data = await res.json();
            
            if (res.ok) {
                setSuccess("OTP verified! You can now securely reset your password.");
                setStep("reset");
            } else {
                setError(data.error || "Invalid or expired OTP.");
            }
        } catch (err: any) {
            setError(err.message || "Verification failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");
        
        try {
            const res = await fetch("/api/admin/settings/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPassword }),
            });
            
            const data = await res.json();
            
            if (res.ok) {
                setSuccess("Password successfully reset! You will be redirected to the login page.");
                
                // Clear the current session out by redirecting to login to re-authenticate
                setTimeout(() => {
                    document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    router.push("/admin/login");
                }, 3000);
            } else {
                setError(data.error || "Failed to update password.");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred while resetting the password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Admin Settings</h1>
            
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">Security & Password</h2>
                
                <div className="max-w-md">
                    {/* Step 1: Request OTP */}
                    {step === "request" && (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                To protect your account, a One-Time Password (OTP) will be sent to the registered admin email address (wasiq161102@gmail.com) before you can change your password.
                            </p>
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Sending..." : "Send Verification OTP"}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Verify OTP */}
                    {step === "verify" && (
                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <p className="text-sm font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-800/30">
                                An email has been sent to wasiq161102@gmail.com. Please enter the 6-digit code below.
                            </p>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">6-Digit Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="••••••"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Numeric only
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-primary transition-all font-medium text-slate-900 dark:text-white text-center tracking-[1em]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length < 6}
                                className="w-full px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Verifying..." : "Verify Code"}
                            </button>

                            <button 
                                type="button" 
                                onClick={handleSendOTP} 
                                disabled={loading}
                                className="w-full text-xs font-bold text-slate-500 hover:text-primary transition-colors mt-2"
                            >
                                Didn't receive code? Resend Email
                            </button>
                        </form>
                    )}

                    {/* Step 3: Reset Password */}
                    {step === "reset" && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-primary transition-all font-medium text-slate-900 dark:text-white"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-primary transition-all font-medium text-slate-900 dark:text-white"
                                    placeholder="Re-enter new password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {loading ? "Saving..." : "Update Password"}
                            </button>
                        </form>
                    )}

                    {/* Error and Success Messages */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl border border-red-100 dark:border-red-800 flex items-center gap-2">
                            <span>⚠️ {error}</span>
                        </div>
                    )}
                    
                    {success && !success.includes("OTP verified!") && (
                        <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold rounded-xl border border-emerald-100 dark:border-emerald-800 flex items-center gap-2">
                            <span>✅ {success}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
