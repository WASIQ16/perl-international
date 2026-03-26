"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NavDrawer from "@/app/components/NavDrawer";
import CartDrawer from "@/app/components/CartDrawer";
import { useCart } from "@/app/context/CartContext";
import { useSettings } from "@/app/context/SettingsContext";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  const { addToCart, totalItems } = useCart();
  const { showPrices } = useSettings();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2587a7] border-t-transparent mx-auto mb-4" />
          <p className="text-lg text-slate-500 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center px-6">
          <h1 className="text-4xl font-black text-[#242553] mb-4">Product Not Found</h1>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">The product you're looking for might have been removed or is temporarily unavailable.</p>
          <Link href="/" className="inline-flex h-14 items-center px-8 rounded-full bg-[#2587a7] text-white font-bold hover:bg-[#1e6d87] transition-all active:scale-95 shadow-xl shadow-[#2587a7]/20">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-slate-50">
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

      <main className="pt-32 pb-24 container mx-auto px-6">
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-[#2587a7] font-bold transition-colors group"
        >
          <svg className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to products
        </button>

        <div className="grid gap-12 lg:grid-cols-2 bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-[#242553]/5 border border-slate-100">
          {/* Images Section */}
          <div className="space-y-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-slate-50 group">
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute top-6 left-6 rounded-full bg-white/90 px-5 py-2 text-xs font-black uppercase tracking-widest text-[#2587a7] backdrop-blur-md shadow-sm">
                {product.category}
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImage === idx 
                      ? "border-[#2587a7] scale-105 shadow-lg shadow-[#2587a7]/10" 
                      : "border-transparent hover:border-slate-200"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <div className="mb-2 text-xs font-black text-[#2587a7] uppercase tracking-[0.2em]">{product.category}</div>
            <h1 className="mb-6 text-4xl md:text-5xl font-black text-[#242553] tracking-tighter leading-tight">
              {product.name}
            </h1>
            
            <div className="mb-8">
              {showPrices ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Price</span>
                  <span className="text-4xl font-black text-[#242553]">Rs. {product.price.toFixed(2)}</span>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="text-sm font-bold text-[#242553] uppercase tracking-widest">Price on Request</span>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Contact us for commercial pricing and bulk orders.</p>
                </div>
              )}
            </div>

            <div className="mb-10 space-y-4">
              <h3 className="text-sm font-black text-[#242553] uppercase tracking-wider">Product Description</h3>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mt-auto space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 h-16 rounded-2xl bg-[#2587a7] text-white font-black uppercase tracking-widest text-sm hover:bg-[#1e6d87] transition-all shadow-xl shadow-[#2587a7]/20 active:scale-95 flex items-center justify-center gap-3"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Add to Cart
                </button>
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="h-16 w-16 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-[#242553] hover:bg-slate-50 transition-all active:scale-95"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-[0.2em]">
                Secure Procurement · Nationwide Delivery
              </p>
            </div>
          </div>
        </div>

        {/* Similar Products or more info could go here */}
        <div className="mt-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black text-[#242553] tracking-tight">Our Quality Commitment</h2>
            <div className="mx-auto mt-4 h-1 w-16 bg-[#2587a7] rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Sourcing Excellence", desc: "We partner with top-tier manufacturers to ensure every product meets our rigorous quality standards." },
              { title: "Reliable Logistics", desc: "Efficient order processing and timely delivery to your doorstep, anywhere in the country." },
              { title: "Client Focused", desc: "Dedicated support for all your procurement needs, from single items to bulk industrial orders." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100">
                <h3 className="text-lg font-black text-[#242553] mb-3">{item.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-black tracking-tighter text-[#242553] mb-4 uppercase italic">
            Pearl International
          </div>
          <p className="text-sm text-slate-400 font-medium">
            © {new Date().getFullYear()} Pearl International. Sourcing Excellence for the World.
          </p>
        </div>
      </footer>
    </div>
  );
}
