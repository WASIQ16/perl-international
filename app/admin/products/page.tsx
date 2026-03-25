"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const CATEGORIES = ["Stationery", "Electronics", "Crockery", "Disposable Items"];

const EMPTY_FORM = {
    name: "",
    price: "" as any,
    category: CATEGORIES[0],
    image: "",
    description: ""
};

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);
    const [formData, setFormData] = useState({ ...EMPTY_FORM });

    // Image upload state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: String(product.price),
            category: product.category,
            image: product.image,
            description: product.description
        });
        setImagePreview(product.image);
        setImageFile(null);
        setUploadError("");
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
                if (res.ok) fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith("image/")) {
            setUploadError("Please select a valid image file.");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setUploadError("Image must be less than 10 MB.");
            return;
        }
        setUploadError("");
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let imageUrl = formData.image;

        if (imageFile) {
            setUploading(true);
            setUploadError("");
            try {
                const uploadFormData = new FormData();
                uploadFormData.append("file", imageFile);

                const uploadRes = await fetch("/api/admin/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                if (!uploadRes.ok) {
                    const err = await uploadRes.json();
                    setUploadError(err.error || "Upload failed. Please try again.");
                    setUploading(false);
                    return;
                }

                const { url } = await uploadRes.json();
                imageUrl = url;
            } catch {
                setUploadError("Network error during upload. Please try again.");
                setUploading(false);
                return;
            }
            setUploading(false);
        }

        if (!imageUrl) {
            setUploadError("Please select a product image.");
            return;
        }

        const method = editingProduct ? "PUT" : "POST";
        const body = editingProduct
            ? { id: editingProduct._id, ...formData, image: imageUrl, price: parseFloat(String(formData.price)) || 0 }
            : { ...formData, image: imageUrl, price: parseFloat(String(formData.price)) || 0 };

        try {
            const res = await fetch("/api/admin/products", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                closeModal();
                fetchProducts();
            }
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({ ...EMPTY_FORM });
        setImageFile(null);
        setImagePreview("");
        setUploadError("");
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-[#242553] tracking-tight">Product Management</h1>
                    <p className="text-slate-500 mt-1 font-medium">Add, update, or remove products from your store.</p>
                </div>
                <button
                    onClick={() => { setEditingProduct(null); setFormData({ ...EMPTY_FORM }); setImagePreview(""); setImageFile(null); setUploadError(""); setIsModalOpen(true); }}
                    className="bg-[#2587a7] hover:bg-[#1e6d87] text-white font-black px-6 py-3 rounded-2xl shadow-xl shadow-[#2587a7]/20 transition-all active:scale-95 flex items-center gap-2"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-64 bg-slate-100 rounded-3xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 relative">
                            <div className="aspect-square relative overflow-hidden bg-slate-50">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(product)} className="bg-white p-2 rounded-xl shadow-lg hover:text-[#2587a7] transition-colors">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button onClick={() => handleDelete(product._id)} className="bg-white p-2 rounded-xl shadow-lg hover:text-red-500 transition-colors">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="text-xs font-black text-[#2587a7] uppercase tracking-widest mb-1">{product.category}</div>
                                <h3 className="font-bold text-[#242553] truncate mb-2">{product.name}</h3>
                                <div className="text-xl font-black text-[#242553]">Rs. {product.price.toFixed(2)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#242553]/50 backdrop-blur-sm" onClick={closeModal} />
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-[101] overflow-hidden border border-slate-200 animate-in zoom-in-95 fade-in duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-2xl font-black text-[#242553] tracking-tight">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                                <p className="text-sm font-medium text-slate-500 mt-1">Enter your product details below.</p>
                            </div>
                            <button onClick={closeModal} className="rounded-full p-2 hover:bg-slate-100 transition-colors text-slate-400">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Name & Price */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-400 uppercase tracking-wider">Product Name</label>
                                    <input required className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-[#2587a7]/20 transition-all font-medium text-[#242553]" placeholder="Enter product name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-400 uppercase tracking-wider">Price ($)</label>
                                    <input type="number" step="0.01" required className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-[#2587a7]/20 transition-all font-medium text-[#242553]" placeholder="0.00" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-400 uppercase tracking-wider">Category</label>
                                <select className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-[#2587a7]/20 transition-all font-bold text-[#242553]" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-3">
                                <label className="text-sm font-black text-slate-400 uppercase tracking-wider">Product Image</label>

                                {/* Drop Zone */}
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative cursor-pointer rounded-3xl border-2 border-dashed transition-all overflow-hidden ${
                                        isDragging ? "border-[#2587a7] bg-[#2587a7]/5 scale-[0.99]" : "border-slate-200 hover:border-[#2587a7] hover:bg-slate-50"
                                    }`}
                                >
                                    {imagePreview ? (
                                        <div className="relative w-full h-52 group">
                                            <Image src={imagePreview} alt="Product preview" fill className="object-cover rounded-[calc(1.5rem-2px)]" />
                                            <div className="absolute inset-0 bg-[#242553]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[calc(1.5rem-2px)]">
                                                <div className="text-white text-center">
                                                    <svg className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                    <p className="text-sm font-bold">Click to change image</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-12 flex flex-col items-center gap-3 text-slate-400">
                                            <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                                                <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-black text-slate-600">Drop image here or <span className="text-[#2587a7] underline underline-offset-2">click to browse</span></p>
                                                <p className="text-xs font-medium mt-1">PNG, JPG, WEBP up to 10 MB</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileSelect(file);
                                    }}
                                />

                                {uploadError && (
                                    <p className="text-xs font-bold text-red-500 bg-red-50 px-4 py-2 rounded-xl">{uploadError}</p>
                                )}

                                {imageFile && (
                                    <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        {imageFile.name} selected
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-400 uppercase tracking-wider">Description</label>
                                <textarea required rows={3} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-[#2587a7]/20 transition-all font-medium text-[#242553]" placeholder="Tell us about this product..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full bg-[#242553] hover:opacity-90 disabled:opacity-60 text-white font-black py-4 rounded-3xl shadow-xl shadow-[#242553]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                {uploading ? (
                                    <>
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Uploading Image…
                                    </>
                                ) : (
                                    editingProduct ? "Update Product" : "Add Product"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
