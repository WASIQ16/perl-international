"use client";

import Image from "next/image";
import { Product } from "../data/products";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    return (
        <div className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="relative mb-4 h-64 w-full overflow-hidden rounded-2xl">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 rounded-full bg-white/90 dark:bg-slate-800/90 px-3 py-1 text-xs font-bold text-accent backdrop-blur-sm">
                    {product.category}
                </div>
            </div>

            <div className="px-2">
                <h3 className="mb-2 text-xl font-bold dark:text-white line-clamp-1">{product.name}</h3>
                <p className="mb-4 text-sm text-secondary dark:text-slate-400 line-clamp-2 min-h-[2.5rem]">
                    {product.description}
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-primary dark:text-white">
                        ${product.price.toFixed(2)}
                    </span>
                    <button
                        onClick={() => addToCart(product)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-600 active:scale-95"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
