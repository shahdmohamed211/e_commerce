'use client';

import { useAuth } from '@/context/AuthContext';
import { getCart, updateCartItemCount, removeCartItem, clearCart, CartData } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
    const { token, updateCartCount } = useAuth();
    const [cart, setCart] = useState<CartData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }
        fetchCart();
    }, [token]);

    const fetchCart = async () => {
        try {
            const res = await getCart();
            if (res?.data) {
                setCart(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCount = async (id: string, count: number) => {
        if (count < 1) return;
        try {
            const res = await updateCartItemCount(id, count);
            if (res.status === 'success') {
                setCart(res.data);
                updateCartCount();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemove = async (id: string) => {
        try {
            const res = await removeCartItem(id);
            if (res.status === 'success') {
                setCart(res.data);
                updateCartCount();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleClearCart = async () => {
        try {
            const res = await clearCart();
            if (res.message === 'success') {
                setCart(null);
                updateCartCount();
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-primary flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-subtle border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-primary text-primary flex flex-col font-inter">
            <Navbar />

            <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8 md:py-16">
                {/* Header Section - Exactly as screenshot */}
                <div className="flex flex-col gap-1 mb-14">
                    <h1 className="text-[32px] md:text-[44px] font-bold tracking-tight m-0 leading-tight">Shopping Cart</h1>
                    {cart && <p className="text-[16px] text-secondary opacity-60 font-medium m-0">{cart.products.length} items in your cart</p>}
                </div>

                {cart && cart.products.length > 0 ? (
                    /* Side-by-Side Layout for Desktop, Stacked for Mobile */
                    <div className="flex flex-col lg:flex-row items-start gap-12">

                        {/* 1. Left Column: Cart Items List */}
                        <div className="w-full lg:flex-[2] flex flex-col gap-4">
                            {cart.products.map((item) => (
                                <div key={item._id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-8 bg-secondary border border-subtle rounded-[24px] gap-6 md:gap-0">
                                    <div className="flex flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
                                        {/* Product Image in box */}
                                        <div className="w-28 h-28 bg-white rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-4">
                                            <img
                                                src={item.product.imageCover}
                                                alt={item.product.title}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>

                                        {/* Product Info Group */}
                                        <div className="flex flex-col gap-6">
                                            <div className="flex flex-col gap-1">
                                                <h3 className="font-bold text-[18px] leading-tight m-0 truncate max-w-[420px]">{item.product.title}</h3>
                                                <p className="text-[13px] text-secondary font-medium opacity-50 m-0">
                                                    {item.product.brand?.name} · {item.product.category?.name}
                                                </p>
                                            </div>

                                            {/* Quantity Segment */}
                                            <div className="flex items-center border border-subtle rounded-lg w-fit overflow-hidden bg-primary/40 backdrop-blur-sm">
                                                <button
                                                    className="w-10 h-10 flex items-center justify-center font-bold text-lg hover:bg-white/5 transition-colors cursor-pointer border-none bg-transparent"
                                                    onClick={() => handleUpdateCount(item.product.id || item.product._id, item.count - 1)}
                                                >-</button>
                                                <span className="w-10 text-center font-bold text-[15px] border-x border-subtle/50">{item.count}</span>
                                                <button
                                                    className="w-10 h-10 flex items-center justify-center font-bold text-lg hover:bg-white/5 transition-colors cursor-pointer border-none bg-transparent"
                                                    onClick={() => handleUpdateCount(item.product.id || item.product._id, item.count + 1)}
                                                >+</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action & Price Column - Responsive alignment */}
                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between self-stretch w-full md:w-auto md:py-1 pl-4 md:pl-0 border-t md:border-none border-subtle/10 pt-4 md:pt-0 mt-2 md:mt-0">
                                        <div className="text-right">
                                            <div className="font-bold text-[22px] tracking-tight whitespace-nowrap">
                                                <span className="mr-1.5">EGP</span>
                                                <span>{item.price.toLocaleString()}</span>
                                            </div>
                                            <div className="text-[12px] text-secondary opacity-50 font-medium lowercase tracking-wider mt-1.5">each</div>
                                        </div>
                                        <button
                                            className="text-[14px] text-[#FF4D4D] font-bold bg-transparent border-none cursor-pointer transition-all hover:opacity-100 opacity-90"
                                            onClick={() => handleRemove(item.product.id || item.product._id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 2. Right Column: Summary Card */}
                        <div className="w-full lg:flex-1 lg:min-w-[420px]">
                            <div className="bg-secondary border border-subtle p-6 md:p-10 md:py-12 rounded-[32px] flex flex-col gap-10 sticky top-32">
                                <h2 className="font-bold text-[24px] m-0 tracking-tight text-primary">Order Summary</h2>

                                <div className="flex flex-col gap-5">
                                    <div className="flex justify-between items-center text-[16px] font-medium text-secondary">
                                        <span className="opacity-80">Subtotal ({cart.products.length} items)</span>
                                        <span className="text-primary font-bold">EGP {cart.totalCartPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[16px] font-medium text-secondary">
                                        <span className="opacity-80">Shipping</span>
                                        <span className="text-[#34C759] font-bold tracking-widest text-[14px]">Free</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border-t border-subtle pt-10">
                                    <span className="font-bold text-[22px] tracking-tight text-primary">Total</span>
                                    <span className="font-bold text-[36px] tracking-tighter text-primary">{cart.totalCartPrice.toLocaleString()}</span>
                                </div>

                                <div className="flex flex-col gap-4 mt-2">
                                    <button
                                        className="w-full py-5 bg-transparent text-primary border border-white/20 hover:border-white/40 rounded-xl font-bold text-[16px] cursor-pointer transition-all hover:bg-white/5 shadow-sm"
                                        onClick={() => router.push('/products')}
                                    >
                                        Continue Shopping
                                    </button>
                                    <button
                                        className="w-full py-5.5 bg-black text-white rounded-xl font-bold text-[18px] cursor-pointer transition-all hover:opacity-80 shadow-2xl border border-white/10"
                                        onClick={() => router.push('/checkout')}
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>

                            {/* Clear Cart Button - Red text, matching image */}
                            <div className="flex justify-end mt-8 pr-4">
                                <button
                                    className="flex items-center gap-2.5 p-2 px-4 bg-[#FF4D4D]/5 hover:bg-[#FF4D4D]/15 rounded-xl text-[#FF4D4D] transition-all cursor-pointer border-none bg-transparent group"
                                    onClick={handleClearCart}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                    <span className="text-[13px] font-bold lowercase tracking-wide">clear cart</span>
                                </button>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 text-center gap-10 bg-secondary/10 border-2 border-dashed border-subtle rounded-[50px]">
                        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center opacity-30 shadow-inner">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                        </div>
                        <h2 className="text-[32px] font-bold tracking-tight m-0 text-primary">Your cart is empty</h2>
                        <Link href="/products" className="py-5 px-14 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-bold no-underline transition-transform hover:scale-105 shadow-2xl">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
