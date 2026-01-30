'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useState } from 'react';

export default function Navbar() {
    const { token, logoutUser, cartItemsCount } = useAuth();
    const { wishlistCount } = useWishlist();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                {/* Mobile Menu Toggle */}
                <button
                    className={styles.menuToggle}
                    onClick={toggleMenu}
                    aria-label="Toggle Menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {isMenuOpen ? (
                            <>
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </>
                        ) : (
                            <>
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </>
                        )}
                    </svg>
                </button>

                {/* Left: Logo */}
                <Link href="/" className={styles.logo}>
                    <div className={styles.logoIcon}>S</div>
                    <span className={styles.logoText}>ShopMart</span>
                </Link>

                {/* Center: Navigation Links (Desktop) */}
                <div className={styles.links}>
                    <Link href="/products" className={styles.linkItem}>Products</Link>
                    <Link href="/brands" className={styles.linkItem}>Brands</Link>
                    <Link href="/categories" className={styles.linkItem}>Categories</Link>
                </div>

                {/* Right: Icons */}
                <div className={styles.actions}>
                    {/* Profile Icon */}
                    <Link href={token ? "/profile" : "/login"} className={styles.iconButton} aria-label="Profile">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>

                    {/* Cart Icon */}
                    <Link href="/cart" className={styles.iconButton} aria-label="Cart">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill="currentColor" />
                            <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" fill="currentColor" />
                            <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className={styles.badge}>{cartItemsCount}</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
                <div className={styles.mobileLinks}>
                    <Link href="/products" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Products</Link>
                    <Link href="/brands" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Brands</Link>
                    <Link href="/categories" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Categories</Link>
                </div>
            </div>

            {/* Overlay */}
            {isMenuOpen && <div className={styles.overlay} onClick={() => setIsMenuOpen(false)}></div>}
        </nav>
    );
}
