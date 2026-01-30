'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserOrders } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './page.module.css';
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
                <div className={styles.container}>
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
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
            <div className={styles.container}>
                <Breadcrumb items={breadcrumbItems} />
                <h1 className={styles.title}>My Orders</h1>

                <div className={styles.orderList}>
                    {orders.map((order) => (
                        <div key={order._id} className={styles.orderCard}>
                            <div className={styles.header}>
                                <span className={styles.orderId}>Order #{order.id}</span>
                                <div className={styles.badges}>
                                    <span className={`${styles.badge} ${order.isPaid ? styles.paid : styles.unpaid}`}>
                                        {order.isPaid ? 'Paid' : 'Unpaid'}
                                    </span>
                                    <span className={`${styles.badge} ${order.isDelivered ? styles.delivered : styles.pending}`}>
                                        {order.isDelivered ? 'Delivered' : 'Pending'}
                                    </span>
                                    <span className={styles.paymentType}>{order.paymentMethodType}</span>
                                </div>
                            </div>

                            <div className={styles.productsGrid}>
                                {order.cartItems.map((item) => (
                                    <div key={item._id} className={styles.productItem}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.product.imageCover}
                                            alt={item.product.title}
                                            className={styles.productImg}
                                        />
                                        <div className={styles.productInfo}>
                                            <span className={styles.productTitle}>{item.product.title}</span>
                                            <span className={styles.productQty}>x{item.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.footer}>
                                <span className={styles.total}>Total: EGP {order.totalOrderPrice.toLocaleString()}</span>
                                <span className={styles.date}>
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
                        <div className={styles.emptyState}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p>No orders found</p>
                            <span>Your order history will appear here once you make a purchase.</span>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
