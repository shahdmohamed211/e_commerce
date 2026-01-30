import Cookies from 'js-cookie';

const BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

// --- Types ---

export interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

export interface Brand {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

export interface Product {
    _id: string;
    title: string;
    slug: string;
    description: string;
    quantity: number;
    price: number;
    imageCover: string;
    images: string[];
    category: Category;
    brand: Brand;
    ratingsAverage: number;
    ratingsQuantity: number;
    id?: string; // API sometimes returns id duplicate
}

export interface User {
    name: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

export interface CartProduct {
    count: number;
    _id: string;
    product: Product;
    price: number;
}

export interface CartData {
    _id: string;
    cartOwner: string;
    products: CartProduct[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    totalCartPrice: number;
}

export interface CartResponse {
    status: string;
    numOfCartItems: number;
    data: CartData;
}

// --- Helper for Headers ---
const getHeaders = () => {
    const token = Cookies.get('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { token: token } : {}),
    };
};

// --- API Methods ---

// Auth
export async function register(userData: any) {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return res.json();
}

export async function login(userData: any) {
    const res = await fetch(`${BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return res.json();
}

// Auth (Additional)
export async function forgotPassword(email: string) {
    const res = await fetch(`${BASE_URL}/auth/forgotPasswords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    return res.json();
}

export async function verifyResetCode(resetCode: string) {
    const res = await fetch(`${BASE_URL}/auth/verifyResetCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetCode }),
    });
    return res.json();
}

export async function resetPassword(data: any) {
    const res = await fetch(`${BASE_URL}/auth/resetPassword`, {
        method: 'PUT', // Route API usually uses PUT for reset
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return res.json();
}

// Products (Filter support)
export async function getProducts(params: string = '') {
    try {
        const res = await fetch(`${BASE_URL}/products${params}`);
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error('getProducts error:', error);
        return [];
    }
}

export async function getProductById(id: string): Promise<Product | null> {
    try {
        const res = await fetch(`${BASE_URL}/products/${id}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error('getProductById error:', error);
        return null;
    }
}

// Categories
export async function getCategories(): Promise<Category[]> {
    try {
        const res = await fetch(`${BASE_URL}/categories`);
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error('getCategories error:', error);
        return [];
    }
}

export async function getCategoryById(id: string) {
    try {
        const res = await fetch(`${BASE_URL}/categories/${id}`);
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export async function getSubCategoriesOnCategory(categoryId: string) {
    try {
        const res = await fetch(`${BASE_URL}/categories/${categoryId}/subcategories`);
        if (!res.ok) return { data: [] };
        return res.json();
    } catch (error) {
        return { data: [] };
    }
}

// Brands
export async function getBrands(): Promise<Brand[]> {
    try {
        const res = await fetch(`${BASE_URL}/brands`);
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error('getBrands error:', error);
        return [];
    }
}

export async function getBrandById(id: string) {
    try {
        const res = await fetch(`${BASE_URL}/brands/${id}`);
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

// Cart
export async function getCart(): Promise<CartResponse | null> {
    const token = Cookies.get('token');
    if (!token) return null;
    try {
        const res = await fetch(`${BASE_URL}/cart`, {
            headers: getHeaders(),
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export async function addToCart(productId: string) {
    const res = await fetch(`${BASE_URL}/cart`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ productId }),
    });
    return res.json();
}

export async function updateCartItemCount(productId: string, count: number) {
    const res = await fetch(`${BASE_URL}/cart/${productId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ count }),
    });
    return res.json();
}

export async function removeCartItem(productId: string) {
    const res = await fetch(`${BASE_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    return res.json();
}

export async function clearCart() {
    const res = await fetch(`${BASE_URL}/cart`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    return res.json();
}

// User Profile
export async function getLoggedUserData() {
    const res = await fetch(`${BASE_URL}/users/getMe`, {
        headers: getHeaders(),
    });
    return res.json();
}

export async function updateLoggedUserData(data: any) {
    const res = await fetch(`${BASE_URL}/users/updateMe/`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function updateLoggedUserPassword(data: any) {
    const res = await fetch(`${BASE_URL}/users/changeMyPassword`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
}

// Addresses
export async function getUserAddresses() {
    const res = await fetch(`${BASE_URL}/addresses`, {
        headers: getHeaders(),
    });
    return res.json();
}

export async function addAddress(address: any) {
    const res = await fetch(`${BASE_URL}/addresses`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(address),
    });
    return res.json();
}

export async function removeAddress(addressId: string) {
    const res = await fetch(`${BASE_URL}/addresses/${addressId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    return res.json();
}

// Wishlist
export async function getWishlist() {
    const res = await fetch(`${BASE_URL}/wishlist`, { headers: getHeaders() });
    return res.json();
}

export async function addToWishlist(productId: string) {
    const res = await fetch(`${BASE_URL}/wishlist`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ productId }),
    });
    return res.json();
}

export async function removeFromWishlist(productId: string) {
    const res = await fetch(`${BASE_URL}/wishlist/${productId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    return res.json();
}

// Orders
export async function createOrder(cartId: string, shippingAddress: any) {
    // Queries: url?url=http://localhost:3000 for success redirect if using online payment
    const res = await fetch(`${BASE_URL}/orders/${cartId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ shippingAddress }),
    });
    return res.json();
}

// Online Payment
export async function createCheckoutSession(cartId: string, shippingAddress: any) {
    const url = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${BASE_URL}/orders/checkout-session/${cartId}?url=${url}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ shippingAddress })
        });
        return res.json();
    } catch (err) {
        return { status: 'fail' };
    }
}

export async function getUserOrders(userId: string) {
    const res = await fetch(`${BASE_URL}/orders/user/${userId}`);
    return res.json();
}

// SubCategories
export async function getSubCategories() {
    try {
        const res = await fetch(`${BASE_URL}/subcategories`);
        if (!res.ok) return { data: [] };
        return res.json();
    } catch (error) {
        return { data: [] };
    }
}

export async function getSubCategoryById(id: string) {
    try {
        const res = await fetch(`${BASE_URL}/subcategories/${id}`);
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

// All Orders
export async function getAllOrders() {
    const res = await fetch(`${BASE_URL}/orders`, {
        headers: getHeaders(),
    });
    return res.json();
}

// Verify Token
export async function verifyToken() {
    const token = Cookies.get('token');
    if (!token) return { valid: false };

    try {
        const res = await fetch(`${BASE_URL}/auth/verifyToken`, {
            headers: { token: token },
        });
        if (!res.ok) return { valid: false };
        return res.json();
    } catch (error) {
        return { valid: false };
    }
}

// Get All Users
export async function getAllUsers() {
    const res = await fetch(`${BASE_URL}/users`, {
        headers: getHeaders(),
    });
    return res.json();
}

// Get Specific Address
export async function getAddressById(addressId: string) {
    const res = await fetch(`${BASE_URL}/addresses/${addressId}`, {
        headers: getHeaders(),
    });
    return res.json();
}
