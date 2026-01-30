'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createOrder, createCheckoutSession, getCart, getUserAddresses } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { token, updateCartCount } = useAuth();
    const [details, setDetails] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [onlineLoading, setOnlineLoading] = useState(false);
    const [cartId, setCartId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }
        const fetchData = async () => {
            const [cart, addrRes] = await Promise.all([getCart(), getUserAddresses()]);
            if (cart?.data?._id) {
                setCartId(cart.data._id);
            } else {
                router.push('/cart');
            }
            if (addrRes.data) setAddresses(addrRes.data);
        };
        fetchData();
    }, [token, router]);

    const handleSelectAddress = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const addr = addresses.find(a => a._id === e.target.value);
        if (addr) {
            setDetails(addr.details);
            setPhone(addr.phone);
            setCity(addr.city);
        }
    };

    const isFormValid = details && phone && city;

    const handleCashPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cartId || !isFormValid) return;

        setLoading(true);
        try {
            const shippingAddress = { details, phone, city };
            const res = await createOrder(cartId, shippingAddress);

            if (res.status === 'success') {
                await updateCartCount();
                router.push('/allorders');
            } else {
                alert(res.message || 'Order failed');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleOnlinePayment = async () => {
        if (!cartId || !isFormValid) {
            alert('Please fill in all shipping details');
            return;
        }

        setOnlineLoading(true);
        try {
            const shippingAddress = { details, phone, city };
            const res = await createCheckoutSession(cartId, shippingAddress);

            if (res.status === 'success' && res.session?.url) {
                // Redirect to Stripe checkout
                window.location.href = res.session.url;
            } else {
                alert(res.message || 'Failed to create checkout session');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setOnlineLoading(false);
        }
    };

    const breadcrumbItems = [
        { label: 'Cart', href: '/cart' },
        { label: 'Checkout' },
    ];

    return (
        <>
            <Navbar />
            <div className="container">
                <Breadcrumb items={breadcrumbItems} />

                <div className={styles.checkoutContainer}>
                    <h1 className={styles.title}>Checkout</h1>

                    {addresses.length > 0 && (
                        <div className={styles.inputGroup} style={{ marginBottom: '24px' }}>
                            <label className={styles.label}>Select Saved Address</label>
                            <select className={styles.input} onChange={handleSelectAddress}>
                                <option value="">-- Choose an address --</option>
                                {addresses.map(a => (
                                    <option key={a._id} value={a._id}>{a.name} ({a.city})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <form onSubmit={handleCashPayment} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Address Details</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Street address, apartment, etc."
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Phone Number</label>
                            <input
                                type="tel"
                                className={styles.input}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Your phone number"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>City</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Your city"
                                required
                            />
                        </div>

                        <div className={styles.paymentOptions}>
                            <p className={styles.paymentLabel}>Select Payment Method</p>

                            <button
                                type="submit"
                                className={styles.cashBtn}
                                disabled={loading || !isFormValid}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                {loading ? 'Processing...' : 'Pay with Cash on Delivery'}
                            </button>

                            <button
                                type="button"
                                className={styles.onlineBtn}
                                onClick={handleOnlinePayment}
                                disabled={onlineLoading || !isFormValid}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                                    <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                {onlineLoading ? 'Redirecting...' : 'Pay Online (Card)'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
