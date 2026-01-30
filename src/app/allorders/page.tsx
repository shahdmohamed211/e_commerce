'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserOrders } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

interface Order {
    id: number;
    _id: string;
    totalOrderPrice: number;
    paymentMethodType: string;
    isPaid: boolean;
    isDelivered: boolean;
    createdAt: string;
    cartItems: {
        product: {
            imageCover: string;
            title: string;
        };
        price: number;
        count: number;
        _id: string;
    }[];
}

export default function OrdersPage() {
    const { token } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const breadcrumbItems = [
        { label: 'Profile', href: '/profile' },
        { label: 'My Orders' },
    ];

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const decoded: any = jwtDecode(token);
            const userId = decoded.id;

            getUserOrders(userId).then((data) => {
                if (Array.isArray(data)) {
                    setOrders(data);
                }
                setLoading(false);
            });
        } catch (e) {
            console.error("Failed to decode token", e);
            setLoading(false);
        }

    }, [token, router]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="max-w-container mx-auto px-[var(--container-padding)] py-12 min-h-[calc(100vh-300px)]">
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-pale-sky">
                        <div className="w-10 h-10 border-3 border-default border-t-cod-gray rounded-full animate-spin"></div>
                        <p>Loading your orders...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="max-w-container mx-auto px-[var(--container-padding)] py-12 min-h-[calc(100vh-300px)]">
                <Breadcrumb items={breadcrumbItems} />
                <h1 className="text-[32px] font-bold mb-8">My Orders</h1>

                <div className="flex flex-col gap-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white border border-default rounded-xl p-6 transition-shadow duration-200 hover:shadow-sm">
                            <div className="flex justify-between items-center flex-wrap gap-3 border-b border-subtle pb-4 mb-4 sm:flex-col sm:items-start">
                                <span className="font-bold text-[18px]">Order #{order.id}</span>
                                <div className="flex gap-2 flex-wrap">
                                    <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                        {order.isPaid ? 'Paid' : 'Unpaid'}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${order.isDelivered ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
                                        {order.isDelivered ? 'Delivered' : 'Pending'}
                                    </span>
                                    <span className="px-3 py-1 bg-secondary rounded-full text-[12px] font-semibold capitalize">{order.paymentMethodType}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4 sm:grid-cols-3">
                                {order.cartItems.map((item) => (
                                    <div key={item._id} className="flex flex-col gap-2">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.product.imageCover}
                                            alt={item.product.title}
                                            className="w-full aspect-square object-cover rounded-lg border border-subtle"
                                        />
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[12px] text-cod-gray line-clamp-2 leading-tight">{item.product.title}</span>
                                            <span className="text-[12px] text-pale-sky font-medium">x{item.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-subtle flex justify-between items-center">
                                <span className="font-bold text-[18px] text-cod-gray">Total: EGP {order.totalOrderPrice.toLocaleString()}</span>
                                <span className="text-pale-sky text-[14px]">
                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {orders.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-pale-sky text-center">
                            <svg className="mb-2 opacity-50" width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="text-[18px] font-semibold text-cod-gray">No orders found</p>
                            <span className="text-[14px]">Your order history will appear here once you make a purchase.</span>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
