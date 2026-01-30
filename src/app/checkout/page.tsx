'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createOrder, createCheckoutSession, getCart, getUserAddresses } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
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
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-container mx-auto px-[var(--container-padding)] py-12 w-full">
                <Breadcrumb items={breadcrumbItems} />

                <div className="max-w-[800px] mx-auto">
                    <h1 className="text-[32px] font-bold mb-8 text-cod-gray">Checkout</h1>

                    {addresses.length > 0 && (
                        <div className="flex flex-col gap-2 mb-8">
                            <label className="text-sm font-semibold text-cod-gray">Select Saved Address</label>
                            <select className="w-full p-4 bg-white border border-default rounded-xl transition-all duration-200 focus:outline-none focus:border-cod-gray cursor-pointer" onChange={handleSelectAddress}>
                                <option value="">-- Choose an address --</option>
                                {addresses.map(a => (
                                    <option key={a._id} value={a._id}>{a.name} ({a.city})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <form onSubmit={handleCashPayment} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-cod-gray">Address Details</label>
                            <input
                                type="text"
                                className="w-full p-4 bg-white border border-default rounded-xl transition-all duration-200 focus:outline-none focus:border-cod-gray placeholder:text-pale-sky"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Street address, apartment, etc."
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-cod-gray">Phone Number</label>
                            <input
                                type="tel"
                                className="w-full p-4 bg-white border border-default rounded-xl transition-all duration-200 focus:outline-none focus:border-cod-gray placeholder:text-pale-sky"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Your phone number"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-cod-gray">City</label>
                            <input
                                type="text"
                                className="w-full p-4 bg-white border border-default rounded-xl transition-all duration-200 focus:outline-none focus:border-cod-gray placeholder:text-pale-sky"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Your city"
                                required
                            />
                        </div>

                        <div className="mt-4 pt-8 border-t border-subtle flex flex-col gap-6">
                            <p className="text-lg font-bold text-cod-gray">Select Payment Method</p>

                            <button
                                type="submit"
                                className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-transparent text-cod-gray border-2 border-cod-gray rounded-xl font-bold text-base cursor-pointer transition-all duration-200 hover:bg-cod-gray hover:text-white disabled:opacity-50 disabled:cursor-not-allowed group"
                                disabled={loading || !isFormValid}
                            >
                                <svg className="group-hover:text-white" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                {loading ? 'Processing...' : 'Pay with Cash on Delivery'}
                            </button>

                            <button
                                type="button"
                                className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-black text-white border-2 border-black rounded-xl font-bold text-base cursor-pointer transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
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
            </main>
            <Footer />
        </div>
    );
}
