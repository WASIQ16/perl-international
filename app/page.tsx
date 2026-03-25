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
      <nav className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto grid grid-cols-3 h-20 items-center px-6">
          {/* Left: Site Name */}
          <div className="text-xl md:text-2xl font-black tracking-tighter text-primary dark:text-white">
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

      <main>
        {/* Hero Section */}
        <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/hero_banner_perl.png"
              alt="Hero Banner"
              fill
              className="object-cover opacity-20 dark:opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
          </div>

          <div className="container mx-auto px-6 text-center">
            <h1 className="mb-6 text-5xl font-black tracking-tight text-primary dark:text-white md:text-7xl">
              Reliable Solutions for <br />
              <span className="text-accent">Every Industry.</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-secondary dark:text-slate-400 md:text-xl">
              Pearl International is your premier general order supplier, delivering excellence across stationery, electronics, crockery, and more.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={scrollToProducts}
                className="h-14 w-48 rounded-full bg-accent text-white font-semibold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25"
              >
                Shop Now
              </button>
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="h-14 w-48 rounded-full border border-slate-200 bg-white/50 dark:bg-slate-900/50 backdrop-blur font-semibold hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                Contact Us
              </button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold dark:text-white">Our Product Categories</h2>
              <div className="mx-auto h-1 w-20 bg-accent rounded-full" />
            </div>

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map((cat, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${cat.color} p-8 hover-lift border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer`}
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
                    <h3 className="mb-3 text-2xl font-bold dark:text-white">{cat.title}</h3>
                    <p className="text-sm text-secondary dark:text-slate-400">
                      {cat.description}
                    </p>
                    <button className="mt-6 flex items-center text-sm font-bold text-accent group-hover:underline">
                      Browse Category
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
        <section id="products" className="py-24 bg-slate-50 dark:bg-slate-900/30">
          <div className="container mx-auto px-6">
            <div className="mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-4xl font-bold dark:text-white mb-2">
                  {selectedCategory || "All Products"}
                </h2>
                <p className="text-secondary dark:text-slate-400">
                  Explore our premium selection of high-quality items.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === null
                    ? "bg-accent text-white shadow-lg shadow-blue-500/25"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-accent"
                    }`}
                >
                  All
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="px-6 py-2 rounded-full text-sm font-bold transition-all bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-accent"
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading ? (
                <div className="col-span-full py-24 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
                  <p className="text-xl text-secondary dark:text-slate-400">Loading products...</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))
              )}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-xl text-secondary dark:text-slate-400">No products found in this category.</p>
              </div>
            )}
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-32 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <div className="relative h-[500px] overflow-hidden rounded-[3rem] shadow-2xl">
                <Image
                  src="/hero_banner_perl.png"
                  alt="About Pearl International"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
              </div>
              <div>
                <h2 className="mb-8 text-4xl font-bold dark:text-white md:text-5xl">Efficiency. Quality. <br /><span className="text-accent">Reliability.</span></h2>
                <p className="mb-6 text-lg text-secondary dark:text-slate-400">
                  Established with a vision to streamline industrial and corporate procurement, **Pearl International** has grown into a leading general order supplier. We specialize in sourcing and delivering high-quality goods across diverse sectors.
                </p>
                <p className="mb-8 text-lg text-secondary dark:text-slate-400">
                  Our commitment to excellence ensures that every client receives personalized service, competitive pricing, and timely deliveries—no matter the scale of the order.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-3xl font-black text-accent mb-1">10+</div>
                    <div className="text-sm font-bold uppercase tracking-widest text-secondary dark:text-slate-500">Years Exp.</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-accent mb-1">500+</div>
                    <div className="text-sm font-bold uppercase tracking-widest text-secondary dark:text-slate-500">Clients</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className="py-32 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-6">
            <div className="mb-20 text-center">
              <h2 className="mb-4 text-4xl font-bold dark:text-white">Get In Touch</h2>
              <div className="mx-auto h-1 w-20 bg-accent rounded-full" />
            </div>

            <div className="grid gap-16 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <form className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold dark:text-white">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full rounded-xl border border-slate-200 bg-white p-4 outline-none focus:border-accent dark:border-slate-800 dark:bg-slate-900 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold dark:text-white">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full rounded-xl border border-slate-200 bg-white p-4 outline-none focus:border-accent dark:border-slate-800 dark:bg-slate-900 transition-all" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold dark:text-white">Subject</label>
                    <input type="text" placeholder="General Inquiry" className="w-full rounded-xl border border-slate-200 bg-white p-4 outline-none focus:border-accent dark:border-slate-800 dark:bg-slate-900 transition-all" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold dark:text-white">Message</label>
                    <textarea rows={6} placeholder="How can we help you?" className="w-full rounded-xl border border-slate-200 bg-white p-4 outline-none focus:border-accent dark:border-slate-800 dark:bg-slate-900 transition-all resize-none"></textarea>
                  </div>
                  <button className="h-14 w-full md:w-48 rounded-xl bg-accent text-white font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25">
                    Send Message
                  </button>
                </form>
              </div>

              <div className="space-y-8">
                <div className="rounded-3xl bg-white p-8 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <h3 className="mb-6 text-xl font-bold dark:text-white">Contact Info</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-accent dark:bg-blue-900/30">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor font-white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div>
                        <div className="font-bold dark:text-white">Head Office</div>
                        <div className="text-sm text-secondary dark:text-slate-400 leading-relaxed">123 Corporate Plaza, Business District, Karachi, Pakistan</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-accent dark:bg-blue-900/30">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <div className="font-bold dark:text-white">Email Us</div>
                        <div className="text-sm text-secondary dark:text-slate-400">sales@pearlinternational.com</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-accent dark:bg-blue-900/30">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <div>
                        <div className="font-bold dark:text-white">Call Us</div>
                        <div className="text-sm text-secondary dark:text-slate-400">+92-21-34567890</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="rounded-[3rem] bg-primary p-12 text-center text-white shadow-2xl md:p-24 relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl -z-10 animate-pulse" />
              <h2 className="mb-8 text-4xl font-bold md:text-5xl">Ready to partner with us?</h2>
              <p className="mx-auto mb-10 max-w-xl text-lg text-slate-300">
                Get high-quality supplies delivered on time, every time. Contact our sales team for a custom quote.
              </p>
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="h-16 w-64 rounded-xl bg-white text-primary font-bold hover:bg-slate-100 transition-all text-black"
              >
                Get a Quote Now
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 dark:border-slate-800 bg-background">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-black tracking-tighter text-primary dark:text-white mb-2 uppercase">
            Pearl International
          </div>
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Pearl International Logo"
              width={150}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-sm text-secondary dark:text-slate-500">
            © {new Date().getFullYear()} Pearl International. All rights reserved.
          </p>
          <div className="mt-4">
            <a href="/admin" className="text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">Admin Portal</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
