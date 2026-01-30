"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from "@/lib/api";

interface WishlistContextType {
    wishlistIds: string[];
    wishlistCount: number;
    isInWishlist: (productId: string) => boolean;
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    toggleWishlist: (productId: string) => Promise<void>;
    refreshWishlist: () => Promise<void>;
    loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const refreshWishlist = useCallback(async () => {
        const token = Cookies.get("token");
        if (!token) {
            setWishlistIds([]);
            return;
        }

        try {
            setLoading(true);
            const res = await getWishlist();
            if (res?.data) {
                // Extract IDs from wishlist products
                const ids = res.data.map((item: any) => item._id);
                setWishlistIds(ids);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshWishlist();
    }, [refreshWishlist]);

    const isInWishlist = useCallback((productId: string) => {
        return wishlistIds.includes(productId);
    }, [wishlistIds]);

    const addToWishlist = useCallback(async (productId: string) => {
        // Optimistic update
        setWishlistIds(prev => [...prev, productId]);

        try {
            const res = await apiAddToWishlist(productId);
            if (res.status !== "success") {
                // Revert on failure
                setWishlistIds(prev => prev.filter(id => id !== productId));
            }
        } catch (error) {
            // Revert on error
            setWishlistIds(prev => prev.filter(id => id !== productId));
            console.error("Failed to add to wishlist:", error);
        }
    }, []);

    const removeFromWishlist = useCallback(async (productId: string) => {
        // Optimistic update
        setWishlistIds(prev => prev.filter(id => id !== productId));

        try {
            const res = await apiRemoveFromWishlist(productId);
            if (res.status !== "success") {
                // Revert on failure
                setWishlistIds(prev => [...prev, productId]);
            }
        } catch (error) {
            // Revert on error
            setWishlistIds(prev => [...prev, productId]);
            console.error("Failed to remove from wishlist:", error);
        }
    }, []);

    const toggleWishlist = useCallback(async (productId: string) => {
        if (isInWishlist(productId)) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    }, [isInWishlist, addToWishlist, removeFromWishlist]);

    return (
        <WishlistContext.Provider
            value={{
                wishlistIds,
                wishlistCount: wishlistIds.length,
                isInWishlist,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                refreshWishlist,
                loading,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
