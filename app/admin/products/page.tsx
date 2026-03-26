"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const CATEGORIES = ["Stationery", "Electronics", "Crockery", "Disposable Items"];

const EMPTY_FORM = {
    name: "",
    price: "" as any,
    category: CATEGORIES[0],
    description: ""
};

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);
    const [formData, setFormData] = useState({ ...EMPTY_FORM });

    // Multi-image upload state
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
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

    // Helper: get images array from a product (backward compat)
    const getProductImages = (product: any): string[] => {
        if (product.images && product.images.length > 0) return product.images;
        if (product.image) return [product.image];
        return [];
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: String(product.price),
            category: product.category,
            description: product.description
        });
        const imgs = getProductImages(product);
        setExistingImages(imgs);
        setImagePreviews([]);
        setImageFiles([]);
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

    const handleFilesSelect = (files: FileList | File[]) => {
        const newFiles: File[] = [];
        const newPreviews: string[] = [];
        let error = "";

        Array.from(files).forEach((file) => {
            if (!file.type.startsWith("image/")) {
                error = "Some files were skipped — only images are allowed.";
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                error = "Some files were skipped — max 10 MB per image.";
                return;
            }
            newFiles.push(file);
            newPreviews.push(URL.createObjectURL(file));
        });

        if (error) setUploadError(error);
        else setUploadError("");

        setImageFiles((prev) => [...prev, ...newFiles]);
        setImagePreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeNewImage = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const removeExistingImage = (index: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            handleFilesSelect(e.dataTransfer.files);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let uploadedUrls: string[] = [];

        // Upload new images
        if (imageFiles.length > 0) {
            setUploading(true);
            setUploadError("");
            try {
                for (const file of imageFiles) {
                    const uploadFormData = new FormData();
                    uploadFormData.append("file", file);

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
                    uploadedUrls.push(url);
                }
            } catch {
                setUploadError("Network error during upload. Please try again.");
                setUploading(false);
                return;
            }
            setUploading(false);
        }

        // Combine existing images + newly uploaded images
        const allImages = [...existingImages, ...uploadedUrls];

        if (allImages.length === 0) {
            setUploadError("Please add at least one product image.");
            return;
        }

        const method = editingProduct ? "PUT" : "POST";
        const body = editingProduct
            ? { id: editingProduct._id, ...formData, images: allImages, price: parseFloat(String(formData.price)) || 0 }
            : { ...formData, images: allImages, price: parseFloat(String(formData.price)) || 0 };

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
        setImageFiles([]);
        imagePreviews.forEach((p) => URL.revokeObjectURL(p));
        setImagePreviews([]);
        setExistingImages([]);
        setUploadError("");
    };

    const totalImagesCount = existingImages.length + imagePreviews.length;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-[#242553] tracking-tight">Product Management</h1>
                    <p className="text-slate-500 mt-1 font-medium">Add, update, or remove products from your store.</p>
                </div>
                <button
                    onClick={() => { setEditingProduct(null); setFormData({ ...EMPTY_FORM }); setImagePreviews([]); setImageFiles([]); setExistingImages([]); setUploadError(""); setIsModalOpen(true); }}
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
                    {products.map((product) => {
                        const imgs = getProductImages(product);
                        return (
                            <div key={product._id} className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 relative">
                                <div className="aspect-square relative overflow-hidden bg-slate-50">
                                    <Image
                                        src={imgs[0] || "/placeholder.png"}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {imgs.length > 1 && (
                                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-black text-[#242553] shadow-sm">
                                            {imgs.length} images
                                        </div>
                                    )}
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
                        );
                    })}
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

                            {/* Multi-Image Upload */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-black text-slate-400 uppercase tracking-wider">Product Images</label>
                                    <span className="text-xs font-bold text-slate-400">{totalImagesCount} image{totalImagesCount !== 1 ? "s" : ""}</span>
                                </div>

                                {/* Existing Images Grid */}
                                {existingImages.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 mb-2">Current Images</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {existingImages.map((url, idx) => (
                                                <div key={`existing-${idx}`} className="relative group/img aspect-square rounded-2xl overflow-hidden border border-slate-100">
                                                    <Image src={url} alt={`Product image ${idx + 1}`} fill className="object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(idx)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                                    >
                                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                    {idx === 0 && (
                                                        <div className="absolute bottom-2 left-2 bg-[#2587a7] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                                                            Main
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Image Previews Grid */}
                                {imagePreviews.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-emerald-600 mb-2">New Images to Upload</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {imagePreviews.map((preview, idx) => (
                                                <div key={`new-${idx}`} className="relative group/img aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-emerald-300 bg-emerald-50/30">
                                                    <Image src={preview} alt={`New image ${idx + 1}`} fill className="object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNewImage(idx)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                                    >
                                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                    {existingImages.length === 0 && idx === 0 && (
                                                        <div className="absolute bottom-2 left-2 bg-[#2587a7] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                                                            Main
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

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
                                    <div className="py-8 flex flex-col items-center gap-3 text-slate-400">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                                            <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-black text-slate-600">Drop images here or <span className="text-[#2587a7] underline underline-offset-2">click to browse</span></p>
                                            <p className="text-xs font-medium mt-1">PNG, JPG, WEBP up to 10 MB · Multiple files supported</p>
                                        </div>
                                    </div>
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            handleFilesSelect(e.target.files);
                                        }
                                        e.target.value = "";
                                    }}
                                />

                                {uploadError && (
                                    <p className="text-xs font-bold text-red-500 bg-red-50 px-4 py-2 rounded-xl">{uploadError}</p>
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
                                        Uploading Images…
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
