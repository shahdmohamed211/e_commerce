'use client';

import { useAuth } from '@/context/AuthContext';
import { getCart, updateCartItemCount, removeCartItem, clearCart, CartData } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
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

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <div className={styles.cartContainer}>
                <div className={styles.headerRow}>
                    <h1 className={styles.header}>Shopping Cart</h1>
                    {cart && <p className={styles.subtitle}>{cart.products.length} items in your cart</p>}
                </div>

                {cart && cart.products.length > 0 ? (
                    <div className={styles.cartGrid}>
                        <div className={styles.itemList}>
                            {cart.products.map((item) => (
                                <div key={item._id} className={styles.item}>
                                    <div className={styles.itemMain}>
                                        <img src={item.product.imageCover} alt={item.product.title} className={styles.itemImage} />
                                        <div className={styles.itemInfo}>
                                            <h3 className={styles.itemTitle}>{item.product.title}</h3>
                                            <p className={styles.itemBrand}>{item.product.brand?.name} · {item.product.category?.name}</p>

                                            <div className={styles.controls}>
                                                <button
                                                    className={styles.quantityBtn}
                                                    onClick={() => handleUpdateCount(item.product.id || item.product._id, item.count - 1)}
                                                >-</button>
                                                <span className={styles.itemCount}>{item.count}</span>
                                                <button
                                                    className={styles.quantityBtn}
                                                    onClick={() => handleUpdateCount(item.product.id || item.product._id, item.count + 1)}
                                                >+</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.itemSpecs}>
                                        <div className={styles.priceContainer}>
                                            <div className={styles.itemPrice}>EGP {item.price.toLocaleString()}</div>
                                            <span className={styles.priceLabel}>each</span>
                                        </div>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => handleRemove(item.product.id || item.product._id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.summaryContainer}>
                            <div className={styles.summary}>
                                <h2 className={styles.summaryTitle}>Order Summary</h2>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal ({cart.products.length} items)</span>
                                    <span>EGP {cart.totalCartPrice.toLocaleString()}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Shipping</span>
                                    <span className={styles.freeLabel}>Free</span>
                                </div>
                                <div className={styles.totalRow}>
                                    <span>Total</span>
                                    <span>{cart.totalCartPrice.toLocaleString()}</span>
                                </div>
                                <div className={styles.summaryActions}>
                                    <button className={styles.continueBtn} onClick={() => router.push('/products')}>
                                        Continue Shopping
                                    </button>
                                    <button className={styles.checkoutBtn} onClick={() => router.push('/checkout')}>
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>

                            <button className={styles.clearBtn} onClick={handleClearCart}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                                clear cart
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.emptyCart}>
                        <p>Your cart is empty.</p>
                        <Link href="/products" className={styles.continueBtn}>Start Shopping</Link>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
