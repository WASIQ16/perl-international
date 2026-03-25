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
          <Link href="/" className="text-[#2587a7] hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <NavDrawer isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto grid grid-cols-3 h-20 items-center px-6">
          <div className="text-xl md:text-2xl font-black tracking-tighter text-[#242553]">
            <Link href="/">Pearl International</Link>
          </div>

          <div className="flex justify-center">
            <Link href="/">
              <Image
                src="/logo.png"
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
              className="flex items-center gap-2 rounded-xl px-4 py-2 hover:bg-slate-50 transition-all active:scale-95 group"
            >
              <span className="hidden md:block text-sm font-bold text-[#242553] group-hover:text-[#2587a7]">Explore</span>
              <svg className="h-6 w-6 text-[#242553] group-hover:text-[#2587a7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full p-2 hover:bg-slate-50 transition-all active:scale-95 text-[#242553] hover:text-[#2587a7]"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#2587a7] text-[10px] font-bold text-white shadow-lg">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-24">
        {/* Banner */}
        <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden mb-16 bg-[#242553]/5">
          <Image
            src={category.image}
            alt={category.title}
            fill
            className="object-cover opacity-10"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-5xl md:text-8xl font-black text-[#242553] mb-4 tracking-tighter">
              {category.title}
            </h1>
            <p className="max-w-2xl text-lg text-slate-500 font-medium">
              {category.description}
            </p>
            <div className="mt-8 h-1.5 w-20 bg-[#2587a7] rounded-full" />
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading ? (
              <div className="col-span-full py-24 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#2587a7] border-t-transparent mx-auto mb-4" />
                <p className="text-lg text-slate-400 font-medium">Sourcing quality products...</p>
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-32 text-center">
                <div className="mb-6 opacity-20">
                    <svg className="mx-auto h-20 w-20 text-[#242553]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <p className="text-xl text-slate-400 font-medium">
                  We're currently restocking this collection. Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
