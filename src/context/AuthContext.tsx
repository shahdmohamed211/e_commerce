"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { User, CartResponse, getCart } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    token: string | null;
    cartItemsCount: number;
    loginUser: (token: string, user: User) => void;
    logoutUser: () => void;
    updateCartCount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const savedToken = Cookies.get("token");
        // In a real app, you'd decode the JWT to get user info or fetch /auth/me
        // Here we'll just persist the token existence
        if (savedToken) {
            setToken(savedToken);
            // Fetch cart count on load if logged in
            updateCartCount();
        }
    }, []);

    const loginUser = (newToken: string, newUser: User) => {
        Cookies.set("token", newToken, { expires: 7 }); // 7 days
        setToken(newToken);
        setUser(newUser);
        updateCartCount();
        router.push("/");
    };

    const logoutUser = () => {
        Cookies.remove("token");
        setToken(null);
        setUser(null);
        setCartItemsCount(0);
        router.push("/login");
    };

    const updateCartCount = async () => {
        const cart = await getCart();
        if (cart) {
            setCartItemsCount(cart.numOfCartItems);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, cartItemsCount, loginUser, logoutUser, updateCartCount }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
