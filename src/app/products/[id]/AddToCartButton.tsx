'use client';

import { useAuth } from '@/context/AuthContext';
import { addToCart } from '@/lib/api';
import { useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function AddToCartButton({ productId }: { productId: string }) {
    const { token, updateCartCount } = useAuth();
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);
    const router = useRouter();

    const handleAddToCart = async () => {
        if (!token) {
            router.push('/login');
            return;
        }

        setLoading(true);
        try {
            const res = await addToCart(productId);
            if (res.status === 'success') { // Check API specific success message
                await updateCartCount();
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
            }
        } catch (error) {
            alert('Failed to add to cart');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleAddToCart}
            className={styles.addToCart}
            disabled={loading}
            style={added ? { background: '#10B981' } : {}}
        >
            {loading ? 'Adding...' : added ? 'Added to Cart ✓' : 'Add To Cart'}
        </button>
    );
}
