"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import NavDrawer from "./components/NavDrawer";
import { useCart } from "./context/CartContext";

import { CATEGORIES } from "./data/categories";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { totalItems } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
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
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/category/${slug}`);
  };

  return (
    <div className="min-h-screen hero-gradient">
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <NavDrawer isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto grid grid-cols-3 h-20 items-center px-6">
          {/* Left: Site Name */}
          <div className="text-xl md:text-2xl font-black tracking-tighter text-[#242553]">
            Pearl International
          </div>

          {/* Center: Logo */}
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="Pearl International Logo"
              width={180}
              height={50}
              className="h-16 md:h-20 w-auto object-contain"
              priority
            />
          </div>

          {/* Right: Navigation & Cart */}
          <div className="flex justify-end items-center gap-4 md:gap-8">
            <button
              id="nav-menu-trigger"
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

      <main>
        {/* Hero Section */}
        <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/hero_banner_perl.png"
              alt="Hero Banner"
              fill
              className="object-cover opacity-10"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 to-white" />
          </div>

          <div className="container mx-auto px-6 text-center">
            <h1 className="mb-6 text-5xl font-black tracking-tight text-[#242553] md:text-8xl">
              Reliable Solutions <br />
              <span className="text-gradient">For Every Industry.</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 md:text-xl font-medium">
              Pearl International is your premier general order supplier, delivering excellence across stationery, electronics, crockery, and more.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={scrollToProducts}
                className="h-14 w-52 rounded-full bg-[#2587a7] text-white font-bold hover:bg-[#1e6d87] transition-all shadow-xl shadow-[#2587a7]/20 active:scale-95"
              >
                Start Exploring
              </button>
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="h-14 w-52 rounded-full border-2 border-[#242553]/10 bg-white/50 backdrop-blur font-bold text-[#242553] hover:bg-white transition-all active:scale-95"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="mb-20 text-center">
              <h2 className="mb-4 text-4xl font-black text-[#242553]">Premium Categories</h2>
              <div className="mx-auto h-1.5 w-16 bg-[#2587a7] rounded-full" />
            </div>

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map((cat, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`group relative overflow-hidden rounded-[2.5rem] bg-slate-50 p-8 hover-lift border border-slate-100 shadow-sm cursor-pointer transition-all duration-500 hover:border-[#2587a7]/30`}
                >
                  <div className="relative z-10">
                    <div className="mb-6 h-48 w-full overflow-hidden rounded-2xl">
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        width={400}
                        height={300}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="mb-3 text-2xl font-black text-[#242553]">{cat.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      {cat.description}
                    </p>
                    <button className="mt-6 flex items-center text-sm font-bold text-[#2587a7] transition-all group-hover:gap-3">
                      View Collection
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-24 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-4xl font-black text-[#242553] mb-2 leading-tight">
                  Discover Our Products
                </h2>
                <p className="text-slate-500 font-medium">
                  Curated selection for your professional needs.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-wider transition-all ${selectedCategory === null
                    ? "bg-[#2587a7] text-white shadow-lg shadow-[#2587a7]/20"
                    : "bg-white border border-slate-200 text-[#242553] hover:border-[#2587a7]/30"
                    }`}
                >
                  All
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-wider transition-all bg-white border border-slate-200 text-[#242553] hover:border-[#2587a7]/30"
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading ? (
                <div className="col-span-full py-24 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#2587a7] border-t-transparent mx-auto mb-4" />
                  <p className="text-lg text-slate-400 font-medium">Fetching excellence...</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))
              )}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-xl text-slate-400 font-medium">No products found in this category.</p>
              </div>
            )}
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <div className="relative h-[500px] overflow-hidden rounded-[3rem] shadow-2xl">
                <Image
                  src="/hero_banner_perl.png"
                  alt="About Pearl International"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#242553]/20 backdrop-blur-[2px]" />
              </div>
              <div>
                <h2 className="mb-8 text-4xl font-black text-[#242553] md:text-5xl tracking-tight">Efficiency. Quality. <br /><span className="text-gradient">Reliability.</span></h2>
                <p className="mb-6 text-lg text-slate-500 font-medium leading-relaxed">
                  Established with a vision to streamline industrial and corporate procurement, Pearl International has grown into a leading general order supplier. We specialize in sourcing and delivering high-quality goods across diverse sectors.
                </p>
                <p className="mb-10 text-lg text-slate-500 font-medium leading-relaxed">
                  Our commitment to excellence ensures that every client receives personalized service, competitive pricing, and timely deliveries—no matter the scale of the order.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-4xl font-black text-[#2587a7] mb-1 tracking-tighter">10+</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black text-[#2587a7] mb-1 tracking-tighter">500+</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Happy Clients</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact-form" className="py-32 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="mb-20 text-center">
              <h2 className="mb-4 text-4xl font-black text-[#242553] tracking-tight">Get In Touch</h2>
              <div className="mx-auto h-1.5 w-16 bg-[#2587a7] rounded-full" />
            </div>

            <div className="grid gap-16 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <form className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full rounded-2xl border-none bg-white p-5 outline-none focus:ring-2 focus:ring-[#2587a7]/20 text-[#242553] font-bold transition-all placeholder:text-slate-300 shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full rounded-2xl border-none bg-white p-5 outline-none focus:ring-2 focus:ring-[#2587a7]/20 text-[#242553] font-bold transition-all placeholder:text-slate-300 shadow-sm" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Subject</label>
                    <input type="text" placeholder="General Inquiry" className="w-full rounded-2xl border-none bg-white p-5 outline-none focus:ring-2 focus:ring-[#2587a7]/20 text-[#242553] font-bold transition-all placeholder:text-slate-300 shadow-sm" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Message</label>
                    <textarea rows={6} placeholder="How can we help you?" className="w-full rounded-2xl border-none bg-white p-5 outline-none focus:ring-2 focus:ring-[#2587a7]/20 text-[#242553] font-bold transition-all placeholder:text-slate-300 resize-none shadow-sm"></textarea>
                  </div>
                  <button className="h-16 w-full md:w-56 rounded-2xl bg-[#2587a7] text-white font-black uppercase tracking-widest text-sm hover:bg-[#1e6d87] transition-all shadow-xl shadow-[#2587a7]/20 active:scale-95">
                    Send Message
                  </button>
                </form>
              </div>

              <div className="space-y-8">
                <div className="rounded-[2.5rem] bg-white p-8 border border-slate-100 shadow-sm">
                  <h3 className="mb-8 text-xs font-black text-[#242553] uppercase tracking-[0.2em]">Contact Info</h3>
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2587a7]/10 text-[#2587a7]">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div>
                        <div className="font-black text-[#242553] mb-1">Head Office</div>
                        <div className="text-sm text-slate-500 font-medium leading-relaxed">123 Corporate Plaza, Business District, Karachi, Pakistan</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2587a7]/10 text-[#2587a7]">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <div className="font-black text-[#242553] mb-1">Email Us</div>
                        <div className="text-sm text-slate-500 font-medium">sales@pearlinternational.com</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2587a7]/10 text-[#2587a7]">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <div>
                        <div className="font-black text-[#242553] mb-1">Call Us</div>
                        <div className="text-sm text-slate-500 font-medium">+92-21-34567890</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section id="contact" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="rounded-[4rem] bg-[#242553] p-12 text-center text-white shadow-2xl md:p-24 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[#2587a7]/10 -z-10 blur-3xl group-hover:bg-[#2587a7]/20 transition-all duration-700" />
              <h2 className="mb-8 text-4xl font-black md:text-6xl tracking-tighter">Ready to partner with us?</h2>
              <p className="mx-auto mb-12 max-w-xl text-lg text-slate-300 font-medium">
                Get high-quality supplies delivered on time, every time. Contact our sales team for a custom quote.
              </p>
              <button
                onClick={() => window.location.href = "mailto:sales@pearlinternational.com"}
                className="h-16 w-64 rounded-2xl bg-white text-[#242553] font-black hover:bg-slate-100 transition-all active:scale-95 shadow-xl"
              >
                Get a Quote Now
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-black tracking-tighter text-[#242553] mb-4 uppercase italic">
            Pearl International
          </div>
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="Pearl International Logo"
              width={150}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-sm text-slate-400 font-medium">
            © {new Date().getFullYear()} Pearl International. Sourcing Excellence for the World.
          </p>

        </div>
      </footer>
    </div>
  );
}
