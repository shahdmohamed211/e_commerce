import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center py-32 min-h-[85vh] md:py-24 sm:py-20">
        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="w-full max-w-[1000px] mx-auto flex flex-col items-center">
            <h1 className="font-bold text-[96px] leading-[1] text-primary mb-10 lg:text-7xl md:text-6xl sm:text-[44px] tracking-tighter">
              Welcome to ShopMart
            </h1>
            <p className="text-[22px] leading-[1.6] text-secondary max-w-[700px] mb-14 md:text-lg sm:text-base sm:mb-12 opacity-80 font-medium tracking-tight">
              Discover the latest technology, fashion, and lifestyle products. Quality guaranteed with
              fast shipping and excellent customer service.
            </p>
            <div className="flex items-center justify-center gap-6 sm:flex-col sm:w-full sm:max-w-[300px]">
              <Link
                href="/products"
                className="py-5 px-16 bg-black text-white rounded-xl font-bold text-[18px] no-underline transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-2xl shadow-black/10 hover:shadow-black/20 sm:w-full flex items-center justify-center"
              >
                Shop Now
              </Link>
              <Link
                href="/categories"
                className="py-5 px-16 bg-transparent text-black border-2 border-black rounded-xl font-bold text-[18px] no-underline transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10 sm:w-full flex items-center justify-center"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
