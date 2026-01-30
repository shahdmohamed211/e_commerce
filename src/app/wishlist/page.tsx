'use client';

import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { getWishlist } from '@/lib/api';

export default function WishlistPage() {
    const { token } = useAuth();
    const { refreshWishlist } = useWishlist();
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const breadcrumbItems = [
        { label: 'My Wishlist' },
    ];

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }
        fetchWishlist();
    }, [token, router]);

    const fetchWishlist = async () => {
        try {
            const res = await getWishlist();
            if (res?.data) {
                setWishlist(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Refresh local list when wishlist context changes
    useEffect(() => {
        if (token) {
            fetchWishlist();
        }
    }, []);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className={styles.container}>
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <p>Loading your wishlist...</p>
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
                <h1 className={styles.title}>My Wishlist</h1>
                <p className={styles.subtitle}>{wishlist.length} items saved</p>

                {wishlist.length > 0 ? (
                    <div className={styles.grid}>
                        {wishlist.map((product) => (
                            <ProductCard
                                key={product._id}
                                id={product._id}
                                image={product.imageCover}
                                brand={product.brand?.name || 'Brand'}
                                title={product.title}
                                category={product.category?.name || 'Category'}
                                price={product.price}
                                rating={product.ratingsAverage}
                                reviews={product.ratingsQuantity}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.84 4.61C20.3292 4.09924 19.7228 3.69397 19.0554 3.41729C18.388 3.14061 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.512 3.14061 14.8446 3.41729C14.1772 3.69397 13.5708 4.09924 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04096 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.3508 11.8792 21.756 11.2728 22.0327 10.6054C22.3094 9.93801 22.4518 9.22252 22.4518 8.5C22.4518 7.77747 22.3094 7.06198 22.0327 6.39459C21.756 5.72721 21.3508 5.12079 20.84 4.61Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p>Your wishlist is empty</p>
                        <span>Browse products and click the heart icon to save them here.</span>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
