'use client';

import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { addToCart } from '@/lib/api';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StarRating from './StarRating';

interface ProductCardProps {
    id: string;
    image: string;
    brand: string;
    title: string;
    category: string;
    price: number;
    rating?: number;
    reviews?: number;
}

export default function ProductCard({
    id,
    image,
    brand,
    title,
    category,
    price,
    rating = 5,
    reviews = 0
}: ProductCardProps) {
    const { token, updateCartCount } = useAuth();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const inWishlist = isInWishlist(id);

    const handleAdd = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!token) {
            router.push('/login');
            return;
        }
        setLoading(true);
        try {
            const res = await addToCart(id);
            if (res.status === 'success') {
                await updateCartCount();
            } else {
                alert(res.message || 'Failed to add to cart');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!token) {
            router.push('/login');
            return;
        }
        await toggleWishlist(id);
    };

    return (
        <Link href={`/products/${id}`} className="flex flex-col bg-white border border-default shadow-sm rounded-[14px] overflow-hidden h-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.4),0_0_40px_rgba(99,102,241,0.2),0_8px_16px_rgba(0,0,0,0.1)] hover:-translate-y-1 group">
            <div className="relative w-full pt-[110%] bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={title} className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.05]" />

                {/* Wishlist Button */}
                <button
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-primary border border-subtle backdrop-blur-[4px] flex items-center justify-center cursor-pointer transition-all duration-200 z-10 shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:scale-110 ${inWishlist ? 'text-[#ef4444] hover:text-[#dc2626]' : 'text-pale-sky hover:text-[#ef4444]'}`}
                    onClick={handleWishlistToggle}
                    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.84 4.61C20.3292 4.09924 19.7228 3.69397 19.0554 3.41729C18.388 3.14061 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.512 3.14061 14.8446 3.41729C14.1772 3.69397 13.5708 4.09924 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04096 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.3508 11.8792 21.756 11.2728 22.0327 10.6054C22.3094 9.93801 22.4518 9.22252 22.4518 8.5C22.4518 7.77747 22.3094 7.06198 22.0327 6.39459C21.756 5.72721 21.3508 5.12079 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            <div className="p-4 flex flex-col gap-2 grow">
                <div>
                    <div className="text-[12px] text-pale-sky uppercase mb-1">{brand}</div>
                    <h3 className="font-bold text-[15.6px] leading-6 text-cod-gray line-clamp-2">{title}</h3>
                    <div className="text-[12px] text-pale-sky">{category}</div>
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={rating} size={14} />
                    <span className="text-[12px] text-pale-sky">({reviews})</span>
                </div>

                <div className="mt-auto pt-4 flex flex-col gap-3">
                    <div className="font-semibold text-[17.4px] leading-7 text-cod-gray">EGP {price.toLocaleString()}</div>
                    <button
                        className="w-full bg-cod-gray-2 text-alabaster border-none rounded-lg p-[10px] font-medium text-[13.6px] leading-5 cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-black hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={handleAdd}
                        disabled={loading}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill="white" />
                            <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" fill="white" />
                            <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.5583 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {loading ? '...' : 'Add To Cart'}
                    </button>
                </div>
            </div>
        </Link>
    );
}
