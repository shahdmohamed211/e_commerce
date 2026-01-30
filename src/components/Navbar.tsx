'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useTheme } from '@/context/ThemeContext';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
    const { token, logoutUser, cartItemsCount, user } = useAuth();
    const { wishlistCount } = useWishlist();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileRef]);

    return (
        <header className="w-full">
            <nav className="sticky top-0 z-[100] w-full h-20 bg-primary/95 backdrop-blur-md text-primary border-b border-subtle flex items-center justify-center">
                <div className="grid grid-cols-3 items-center w-full max-w-container px-12 h-full md:px-6">
                    {/* Left: Logo Group */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-3 no-underline cursor-pointer group">
                            <div className="w-10 h-10 bg-black text-white dark:bg-white dark:text-black rounded-xl flex items-center justify-center font-bold text-xl font-inter transition-transform group-hover:rotate-6 shadow-lg shadow-black/10">S</div>
                            <span className="font-bold text-[22px] text-primary tracking-tight">ShopMart</span>
                        </Link>
                    </div>

                    {/* Center: Navigation Links (Desktop) */}
                    <div className="flex items-center justify-center gap-12 hidden md:flex">
                        <Link href="/products" className="font-bold text-[15px] text-primary no-underline transition-all hover:opacity-100 relative group py-1">
                            Products
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full"></span>
                        </Link>
                        <Link href="/brands" className="font-bold text-[15px] text-primary no-underline transition-all hover:opacity-100 relative group py-1">
                            Brands
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full"></span>
                        </Link>
                        <Link href="/categories" className="font-bold text-[15px] text-primary no-underline transition-all hover:opacity-100 relative group py-1">
                            Categories
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full"></span>
                        </Link>
                    </div>

                    {/* Right: Icons */}
                    <div className="flex items-center justify-end gap-6">
                        {/* Profile Dropdown */}
                        <div className="relative flex items-center" ref={profileRef}>
                            <button
                                onClick={toggleProfile}
                                className={`flex items-center justify-center p-2 text-primary hover:bg-secondary rounded-full transition-all duration-300 ${isProfileOpen ? 'bg-secondary' : ''}`}
                                aria-label="Account"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-primary border border-subtle rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] py-3 z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                                    {token ? (
                                        <>
                                            <div className="px-5 py-4 border-b border-subtle mb-2">
                                                <p className="text-[15px] font-bold text-primary truncate">{user?.name || 'Account'}</p>
                                                <p className="text-[12px] text-pale-sky truncate font-medium">{user?.email}</p>
                                            </div>

                                            <button
                                                onClick={() => { toggleTheme(); setIsProfileOpen(false); }}
                                                className="w-full flex items-center gap-4 px-5 py-2.5 text-[14px] text-primary hover:bg-secondary transition-all font-medium text-left"
                                            >
                                                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                                                    {theme === 'light' ? (
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                                                    ) : (
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                                                    )}
                                                </div>
                                                <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                                            </button>

                                            <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 px-5 py-2.5 text-[14px] text-primary hover:bg-secondary transition-all font-medium no-underline">
                                                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                                </div>
                                                <span>Profile Settings</span>
                                            </Link>

                                            <Link href="/allorders" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 px-5 py-2.5 text-[14px] text-primary hover:bg-secondary transition-all font-medium no-underline">
                                                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                                                </div>
                                                <span>Orders</span>
                                            </Link>

                                            <Link href="/wishlist" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 px-5 py-2.5 text-[14px] text-primary hover:bg-secondary transition-all font-medium no-underline">
                                                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center relative">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                                    {wishlistCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-primary rounded-full scale-75"></span>}
                                                </div>
                                                <span>Wishlist ({wishlistCount})</span>
                                            </Link>

                                            <div className="border-t border-subtle mt-2 pt-2">
                                                <button
                                                    onClick={() => { logoutUser(); setIsProfileOpen(false); }}
                                                    className="w-full flex items-center gap-4 px-5 py-3 text-[14px] text-red-500 hover:bg-red-50 transition-all font-bold text-left"
                                                >
                                                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                                    </div>
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="px-6 py-4 mb-2">
                                                <p className="text-[17px] font-bold text-primary">Sign in</p>
                                                <p className="text-[13px] text-pale-sky font-medium">To manage your orders and wishlist</p>
                                            </div>

                                            <div className="px-4 flex flex-col gap-2">
                                                <Link href="/login" onClick={() => setIsProfileOpen(false)} className="flex items-center justify-center py-3 bg-primary text-inverse dark:bg-white dark:text-black rounded-xl font-bold text-[14px] no-underline transition-all hover:scale-[1.02] shadow-sm">
                                                    Login
                                                </Link>
                                                <Link href="/register" onClick={() => setIsProfileOpen(false)} className="flex items-center justify-center py-3 bg-secondary text-primary border border-subtle rounded-xl font-bold text-[14px] no-underline transition-all hover:bg-athens-gray">
                                                    Don't have an account?
                                                </Link>
                                            </div>

                                            <div className="border-t border-subtle mt-4 pt-2">
                                                <button
                                                    onClick={() => { toggleTheme(); setIsProfileOpen(false); }}
                                                    className="w-full flex items-center gap-4 px-5 py-2.5 text-[14px] text-primary hover:bg-secondary transition-all font-medium text-left"
                                                >
                                                    <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                                                        {theme === 'light' ? (
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                                                        ) : (
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                                                        )}
                                                    </div>
                                                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cart Icon */}
                        <Link href="/cart" className="relative flex items-center justify-center p-2 text-primary hover:bg-secondary rounded-full transition-all duration-300 no-underline" aria-label="Cart">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill="currentColor" />
                                <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" fill="currentColor" />
                                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="absolute -top-1 -right-1 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 border-2 border-primary">{cartItemsCount}</span>
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                <div className={`fixed top-0 ${isMenuOpen ? 'left-0' : 'left-[-100%]'} w-[300px] h-screen bg-primary z-[101] transition-[left] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] pt-24 px-8 pb-8 shadow-[10px_0_40px_rgba(0,0,0,0.25)]`}>
                    <div className="flex flex-col gap-2">
                        <Link href="/products" className="text-xl font-bold text-primary no-underline py-4 border-b border-subtle flex justify-between items-center group" onClick={() => setIsMenuOpen(false)}>
                            Products
                            <svg className="transition-transform group-hover:translate-x-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </Link>
                        <Link href="/brands" className="text-xl font-bold text-primary no-underline py-4 border-b border-subtle flex justify-between items-center group" onClick={() => setIsMenuOpen(false)}>
                            Brands
                            <svg className="transition-transform group-hover:translate-x-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </Link>
                        <Link href="/categories" className="text-xl font-bold text-primary no-underline py-4 border-b border-subtle flex justify-between items-center group" onClick={() => setIsMenuOpen(false)}>
                            Categories
                            <svg className="transition-transform group-hover:translate-x-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </Link>
                    </div>
                </div>

                {/* Overlay */}
                {isMenuOpen && <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-[6px] z-[100] transition-opacity duration-300" onClick={() => setIsMenuOpen(false)}></div>}
            </nav>
        </header>
    );
}
