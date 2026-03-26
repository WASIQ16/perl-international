"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "../data/products";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const { showPrices } = useSettings();

    const productId = product._id || product.id;
    const productImage = (product.images && product.images.length > 0) ? product.images[0] : product.image;

    return (
        <div className="group relative rounded-[2rem] bg-white border border-slate-100 p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-[#242553]/5 hover:-translate-y-2 hover:border-[#2587a7]/20">
            <Link href={`/product/${productId}`} className="block">
                <div className="relative mb-6 h-64 w-full overflow-hidden rounded-[1.5rem] bg-slate-50">
                    <Image
                        src={productImage || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 rounded-full bg-white/90 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#2587a7] backdrop-blur-md shadow-sm">
                        {product.category}
                    </div>
                </div>

                <div className="px-3">
                    <h3 className="mb-2 text-xl font-black text-[#242553] line-clamp-1 leading-tight">{product.name}</h3>
                    <p className="mb-6 text-sm text-slate-500 font-medium line-clamp-2 min-h-[2.5rem] leading-relaxed">
                        {product.description}
                    </p>
                </div>
            </Link>

            <div className="px-3">
                <div className="flex items-center justify-between mt-auto">
                    {showPrices ? (
                        <span className="text-2xl font-black text-[#242553]">
                            Rs. {product.price.toFixed(2)}
                        </span>
                    ) : (
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                            Price on Request
                        </span>
                    )}
                    <button
                        onClick={() => addToCart(product)}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2587a7] text-white shadow-lg shadow-[#2587a7]/30 transition-all hover:bg-[#1e6d87] active:scale-95 group-hover:rotate-6"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

