"use client";

import React, { useEffect, useState } from "react";

interface AdminUser {
    _id: string;
    username: string;
    email: string;
    role: "superadmin" | "admin";
}

export default function AdminSettings() {
    // Price Visibility
    const [showPrices, setShowPrices] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    // Admin Users
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [adminsLoading, setAdminsLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ username: "", email: "", password: "", role: "admin" });
    const [creating, setCreating] = useState(false);
    const [adminMessage, setAdminMessage] = useState("");
    const [adminError, setAdminError] = useState("");

    // Current user role
    const [currentRole, setCurrentRole] = useState<string>("");

    // Fetch store settings
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

    // Fetch admin users
    const fetchAdmins = async () => {
        setAdminsLoading(true);
        try {
            const res = await fetch("/api/admin/admins");
            if (res.ok) {
                const data = await res.json();
                setAdmins(data);
            }
        } catch (error) {
            console.error("Error fetching admins:", error);
        } finally {
            setAdminsLoading(false);
        }
    };

    // Fetch current role
    const fetchRole = async () => {
        try {
            const res = await fetch("/api/admin/me");
            if (res.ok) {
                const data = await res.json();
                setCurrentRole(data.role);
            }
        } catch (error) {
            console.error("Error fetching role:", error);
        }
    };

    useEffect(() => {
        fetchSettings();
        fetchAdmins();
        fetchRole();
    }, []);

    const handleSaveSettings = async () => {
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

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        setAdminError("");
        setAdminMessage("");

        try {
            const res = await fetch("/api/admin/admins", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAdmin),
            });

            const data = await res.json();

            if (res.ok) {
                setAdminMessage(`Admin "${data.username}" created successfully.`);
                setNewAdmin({ username: "", email: "", password: "", role: "admin" });
                setShowCreateForm(false);
                fetchAdmins();
                setTimeout(() => setAdminMessage(""), 3000);
            } else {
                setAdminError(data.error || "Failed to create admin.");
            }
        } catch (error) {
            setAdminError("An error occurred.");
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteAdmin = async (id: string, username: string) => {
        if (!confirm(`Are you sure you want to remove "${username}"?`)) return;

        try {
            const res = await fetch(`/api/admin/admins?id=${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (res.ok) {
                setAdminMessage(`Admin "${username}" removed.`);
                fetchAdmins();
                setTimeout(() => setAdminMessage(""), 3000);
            } else {
                setAdminError(data.error || "Failed to delete admin.");
                setTimeout(() => setAdminError(""), 3000);
            }
        } catch (error) {
            setAdminError("An error occurred.");
        }
    };

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-black text-[#242553] tracking-tight">Store Settings</h1>
                <p className="text-slate-500 mt-1 font-medium">Manage global preferences and admin team.</p>
            </div>

            {/* SECTION 1: Price Visibility */}
            {loading ? (
                <div className="h-40 bg-slate-100 rounded-3xl animate-pulse w-full max-w-2xl" />
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm max-w-2xl p-8 space-y-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-bold text-[#242553] text-lg">Public Price Visibility</h3>
                            <p className="text-sm text-slate-500 font-medium mt-1 pr-6">
                                If enabled, product prices and checkout totals will be visible to all visitors. If disabled, prices will be hidden across the public site.
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
                            onClick={handleSaveSettings}
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

            {/* SECTION 2: Admin Users Management (Super Admin Only) */}
            {currentRole === "superadmin" && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm max-w-2xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-[#242553] text-lg">Admin Team</h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">Manage who has access to the admin portal.</p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="bg-[#2587a7] hover:bg-[#1e6d87] text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-2xl shadow-lg shadow-[#2587a7]/20 transition-all active:scale-95"
                    >
                        {showCreateForm ? "Cancel" : "+ New Admin"}
                    </button>
                </div>

                {/* Feedback Messages */}
                {adminMessage && (
                    <div className="bg-emerald-50 text-emerald-600 text-xs font-bold px-4 py-3 rounded-xl border border-emerald-100 text-center uppercase tracking-widest">
                        {adminMessage}
                    </div>
                )}
                {adminError && (
                    <div className="bg-red-50 text-red-500 text-xs font-bold px-4 py-3 rounded-xl border border-red-100 text-center uppercase tracking-widest">
                        {adminError}
                    </div>
                )}

                {/* Create Admin Form */}
                {showCreateForm && (
                    <form onSubmit={handleCreateAdmin} className="bg-slate-50 rounded-2xl p-6 space-y-4 border border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Username</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="johndoe"
                                    value={newAdmin.username}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                                    className="w-full bg-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2587a7]/20 transition-all font-bold text-[#242553] text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="john@example.com"
                                    value={newAdmin.email}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                    className="w-full bg-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2587a7]/20 transition-all font-bold text-[#242553] text-sm"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    value={newAdmin.password}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                    className="w-full bg-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2587a7]/20 transition-all font-bold text-[#242553] text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Role</label>
                                <select
                                    value={newAdmin.role}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                                    className="w-full bg-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2587a7]/20 transition-all font-bold text-[#242553] text-sm"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Super Admin</option>
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={creating}
                            className="w-full bg-[#242553] hover:opacity-90 disabled:opacity-50 text-white font-black py-3.5 rounded-xl shadow-xl shadow-[#242553]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
                        >
                            {creating ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating...
                                </>
                            ) : "Create Admin Account"}
                        </button>
                    </form>
                )}

                {/* Admin Users List */}
                {adminsLoading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : admins.length === 0 ? (
                    <p className="text-center text-slate-400 font-medium py-8">No admin accounts found.</p>
                ) : (
                    <div className="space-y-3">
                        {admins.map(admin => (
                            <div key={admin._id} className="flex items-center justify-between bg-slate-50 rounded-2xl px-6 py-4 border border-slate-100 group hover:border-[#2587a7]/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-[#242553] flex items-center justify-center text-white font-black text-sm uppercase">
                                        {admin.username.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-[#242553]">{admin.username}</span>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                                admin.role === "superadmin" 
                                                    ? "bg-amber-100 text-amber-700" 
                                                    : "bg-[#2587a7]/10 text-[#2587a7]"
                                            }`}>
                                                {admin.role === "superadmin" ? "Super Admin" : "Admin"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium">{admin.email}</p>
                                    </div>
                                </div>
                                <div>
                                    {admin.role !== "superadmin" && (
                                        <button
                                            onClick={() => handleDeleteAdmin(admin._id, admin.username)}
                                            className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            )}
        </div>
    );
}
