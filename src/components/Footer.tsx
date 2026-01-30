'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { getCategories } from '@/lib/api';

export default function Footer() {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        getCategories().then(res => {
            if (res) setCategories(res.slice(0, 5));
        });
    }, []);

    return (
        <footer className={styles.footer}>
            <div className="container">
                <hr className={styles.divider} />
                <div className={styles.content}>

                    {/* Brand Column */}
                    <div className={styles.brandColumn}>
                        <Link href="/" className={styles.logo}>
                            <div className={styles.logoIcon}>S</div>
                            <span className={styles.logoText}>ShopMart</span>
                        </Link>
                        <p className={styles.description}>
                            Your one-stop destination for the latest technology, fashion, and lifestyle products. Quality guaranteed with fast shipping and excellent customer service.
                        </p>
                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                <span>123 Shop Street, Octoper City, DC 12345</span>
                            </div>
                            <div className={styles.contactItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>(+20) 01093333333</span>
                            </div>
                            <div className={styles.contactItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>support@shopmart.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Shop Column */}
                    <div className={styles.linksColumn}>
                        <h3 className={styles.columnTitle}>SHOP</h3>
                        <div className={styles.linkList}>
                            {categories.length > 0 ? categories.map(cat => (
                                <Link key={cat._id} href={`/categories/${cat._id}`} className={styles.link}>
                                    {cat.name}
                                </Link>
                            )) : (
                                <>
                                    <Link href="/categories" className={styles.link}>Electronics</Link>
                                    <Link href="/categories" className={styles.link}>Fashion</Link>
                                </>
                            )}
                            <Link href="/products" className={styles.link}>Deals</Link>
                        </div>
                    </div>

                    {/* Customer Service Column */}
                    <div className={styles.linksColumn}>
                        <h3 className={styles.columnTitle}>CUSTOMER SERVICE</h3>
                        <div className={styles.linkList}>
                            <Link href="#" className={styles.link}>Contact Us</Link>
                            <Link href="#" className={styles.link}>Help Center</Link>
                            <Link href="/allorders" className={styles.link}>Track Your Order</Link>
                            <Link href="#" className={styles.link}>Returns & Exchanges</Link>
                            <Link href="#" className={styles.link}>Size Guide</Link>
                        </div>
                    </div>

                    {/* About Column */}
                    <div className={styles.linksColumn}>
                        <h3 className={styles.columnTitle}>ABOUT</h3>
                        <div className={styles.linkList}>
                            <Link href="#" className={styles.link}>About shopmart</Link>
                            <Link href="#" className={styles.link}>Careers</Link>
                            <Link href="#" className={styles.link}>Press</Link>
                            <Link href="#" className={styles.link}>Investor Relations</Link>
                            <Link href="#" className={styles.link}>Sustainability</Link>
                        </div>
                    </div>

                    {/* Policies Column */}
                    <div className={styles.linksColumn}>
                        <h3 className={styles.columnTitle}>POLICIES</h3>
                        <div className={styles.linkList}>
                            <Link href="#" className={styles.link}>Privacy Policy</Link>
                            <Link href="#" className={styles.link}>Terms of Service</Link>
                            <Link href="#" className={styles.link}>Cookie Policy</Link>
                            <Link href="#" className={styles.link}>Shipping Policy</Link>
                            <Link href="#" className={styles.link}>Refund Policy</Link>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}
