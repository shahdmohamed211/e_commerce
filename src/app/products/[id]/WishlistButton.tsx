'use client';

import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface WishlistButtonProps {
    productId: string;
}

export default function WishlistButton({ productId }: WishlistButtonProps) {
    const { token } = useAuth();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const router = useRouter();

    const inWishlist = isInWishlist(productId);

    const handleClick = async () => {
        if (!token) {
            router.push('/login');
            return;
        }
        await toggleWishlist(productId);
    };

    return (
        <button
            className={`${styles.wishlistBtn} ${inWishlist ? styles.wishlistActive : ''}`}
            onClick={handleClick}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61C20.3292 4.09924 19.7228 3.69397 19.0554 3.41729C18.388 3.14061 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.512 3.14061 14.8446 3.41729C14.1772 3.69397 13.5708 4.09924 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04096 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.3508 11.8792 21.756 11.2728 22.0327 10.6054C22.3094 9.93801 22.4518 9.22252 22.4518 8.5C22.4518 7.77747 22.3094 7.06198 22.0327 6.39459C21.756 5.72721 21.3508 5.12079 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
        </button>
    );
}
