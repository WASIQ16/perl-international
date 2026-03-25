"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";
import NavDrawer from "@/app/components/NavDrawer";
import CartDrawer from "@/app/components/CartDrawer";
import { useCart } from "@/app/context/CartContext";
import { CATEGORIES } from "@/app/data/categories";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = CATEGORIES.find((c) => c.slug === slug);
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products?category=${encodeURIComponent(category.title)}`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
          <Link href="/" className="text-accent hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <NavDrawer isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto grid grid-cols-3 h-20 items-center px-6">
          <div className="text-xl md:text-2xl font-black tracking-tighter text-primary dark:text-white">
            <Link href="/">Pearl International</Link>
          </div>

          <div className="flex justify-center">
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="Pearl International Logo"
                width={180}
                height={50}
                className="h-16 md:h-20 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          <div className="flex justify-end items-center gap-4 md:gap-8">
            <button
              onClick={() => setIsNavOpen(true)}
              className="flex items-center gap-2 rounded-xl px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform active:scale-95 group"
            >
              <span className="hidden md:block text-sm font-bold dark:text-white group-hover:text-accent">Explore</span>
              <svg className="h-6 w-6 dark:text-white group-hover:text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform active:scale-95"
            >
              <svg className="h-6 w-6 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-lg">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24">
        {/* Banner */}
        <div className={`relative h-64 md:h-96 w-full overflow-hidden mb-16 bg-gradient-to-br ${category.color}`}>
          <Image
            src={category.image}
            alt={category.title}
            fill
            className="object-cover opacity-30 dark:opacity-40"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-5xl md:text-7xl font-black text-primary dark:text-white mb-4">
              {category.title}
            </h1>
            <p className="max-w-2xl text-lg text-secondary dark:text-slate-300">
              {category.description}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading ? (
              <div className="col-span-full py-24 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
                <p className="text-xl text-secondary dark:text-slate-400">Loading {category.title}...</p>
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-24 text-center">
                <p className="text-xl text-secondary dark:text-slate-400">
                  No products found in this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
