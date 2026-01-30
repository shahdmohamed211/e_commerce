'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/api';

export default function Footer() {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        getCategories().then(res => {
            if (res) setCategories(res.slice(0, 7));
        });
    }, []);

    return (
        <footer className="bg-primary text-primary py-16 border-t border-subtle w-full font-inter">
            <div className="max-w-[1440px] mx-auto px-6 md:px-10">
                {/* Flex Layout for Desktop (Same Row), Grid/Stack for smaller screens */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8">

                    {/* 1. Brand & Identity */}
                    <div className="flex flex-col gap-6 lg:flex-[1.5]">
                        <Link href="/" className="flex items-center gap-3 no-underline group">
                            <div className="w-10 h-10 bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xl rounded-lg">S</div>
                            <span className="font-bold text-[24px] tracking-tight text-primary">ShopMart</span>
                        </Link>
                        <p className="text-[14px] leading-relaxed text-secondary opacity-80 max-w-[300px] m-0">
                            Your one-stop destination for the latest technology, fashion, and lifestyle products. Quality guaranteed with fast shipping and excellent customer service.
                        </p>

                        <div className="flex flex-col gap-4 mt-2">
                            <div className="flex items-center gap-3 text-[14px] text-secondary">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                <span className="opacity-80">123 Shop Street, Octoper City, DC 12345</span>
                            </div>
                            <div className="flex items-center gap-3 text-[14px] text-secondary">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                <span className="opacity-80">(+20) 01093333333</span>
                            </div>
                            <div className="flex items-center gap-3 text-[14px] text-secondary">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                <span className="opacity-80">support@shopmart.com</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Shop Links */}
                    <div className="flex flex-col gap-6 lg:flex-1">
                        <h3 className="font-bold text-[14px] text-primary uppercase tracking-wider m-0">SHOP</h3>
                        <div className="flex flex-col gap-3">
                            <Link href="/products" className="text-[14px] text-secondary no-underline hover:text-primary transition-colors opacity-80 hover:opacity-100">All Products</Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat._id}
                                    href={`/categories/${cat._id}`}
                                    className="text-[14px] text-secondary no-underline hover:text-primary transition-colors opacity-80 hover:opacity-100"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* 3. Customer Service Links */}
                    <div className="flex flex-col gap-6 lg:flex-1">
                        <h3 className="font-bold text-[14px] text-primary uppercase tracking-wider m-0">CUSTOMER SERVICE</h3>
                        <div className="flex flex-col gap-3">
                            <Link href="#" className="text-[14px] text-secondary no-underline hover:text-primary transition-colors opacity-80 hover:opacity-100">Contact Us</Link>
                            <Link href="#" className="text-[14px] text-secondary no-underline hover:text-primary transition-colors opacity-80 hover:opacity-100">Help Center</Link>
                            <Link href="/allorders" className="text-[14px] text-secondary no-underline hover:text-primary transition-colors opacity-80 hover:opacity-100">Track Your Order</Link>
                            <Link href="#" className="text-[14px] text-secondary no-underline hover:text-primary transition-colors opacity-80 hover:opacity-100">Returns & Exchanges</Link>
                            <Link href="#" className="text-[14px] text-secondary no-underline hover:text-primary transition-colors opacity-80 hover:opacity-100">Size Guide</Link>
                        </div>
                    </div>

                    {/* 4. About Links */}
                    <div className="flex flex-col gap-6 lg:flex-1">
                        <h3 className="font-bold text-[14px] text-primary uppercase tracking-wider m-0">ABOUT</h3>
                        <div className="flex flex-col gap-3">
                            <Link href="#" className="text-[14px] text-secondary no-underline hover:text-primary transition-colors opacity-80 hover:opacity-100">About shopmart</Link>
                            <Link href="#" className="text-[14px] text-secondary no-underline hover:text-primary transition-colors opacity-80 hover:opacity-100">Careers</Link>
                            <Link href="#" className="text-[14px] text-secondary no-underline hover:text-primary transition-colors opacity-80 hover:opacity-100">Press</Link>
                            <Link href="#" className="text-[14px] text-secondary no-underline hover:text-primary transition-colors opacity-80 hover:opacity-100">Investor Relations</Link>
                            <Link href="#" className="text-[14px] text-secondary no-underline hover:text-primary transition-colors opacity-80 hover:opacity-100">Sustainability</Link>
                        </div>
                    </div>

                    {/* 5. Policy Links */}
                    <div className="flex flex-col gap-6 lg:flex-1">
                        <h3 className="font-bold text-[14px] text-primary uppercase tracking-wider m-0">POLICIES</h3>
                        <div className="flex flex-col gap-3">
                            <Link href="#" className="text-[14px] text-secondary no-underline hover:text-primary transition-colors opacity-80 hover:opacity-100">Privacy Policy</Link>
                            <Link href="#" className="text-[14px] text-secondary no-underline hover:text-primary transition-colors opacity-80 hover:opacity-100">Terms of Service</Link>
                            <Link href="#" className="text-[14px] text-secondary no-underline hover:text-primary transition-colors opacity-80 hover:opacity-100">Cookie Policy</Link>
                            <Link href="#" className="text-[14px] text-secondary no-underline hover:text-primary transition-colors opacity-80 hover:opacity-100">Shipping Policy</Link>
                            <Link href="#" className="text-[14px] text-secondary no-underline hover:text-primary transition-colors opacity-80 hover:opacity-100">Refund Policy</Link>
                        </div>
                    </div>

                </div>

                <div className="mt-16 pt-8 border-t border-subtle flex flex-row justify-between items-center sm:flex-col sm:gap-6">
                    <p className="text-[13px] text-secondary opacity-60 m-0">
                        &copy; 2026 ShopMart Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6 opacity-40">
                        <span className="text-[12px] font-bold">VISA</span>
                        <span className="text-[12px] font-bold">MASTERCARD</span>
                        <span className="text-[12px] font-bold">PAYPAL</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
