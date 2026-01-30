'use client';

import { useAuth } from '@/context/AuthContext';
import { addToCart } from '@/lib/api';
import { useState } from 'react';
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
            className={`flex-1 py-4 px-8 rounded-xl font-bold text-base cursor-pointer transition-all duration-200 border-none sm:w-full ${added ? 'bg-[#22c55e] text-white' : 'bg-[#000000] text-white hover:opacity-90 dark:bg-[#ffffff] dark:text-[#000000] dark:hover:opacity-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={loading}
        >
            {loading ? 'Adding...' : added ? 'Added to Cart ✓' : 'Add To Cart'}
        </button>
    );
}
