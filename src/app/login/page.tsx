'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { login } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await login({ email, password });

            if (res.message === 'success') {
                loginUser(res.token, res.user);
            } else {
                setError(res.message || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-10 bg-secondary px-5">
                <div className="w-full max-w-[480px] bg-white p-12 rounded-xl shadow-sm border border-default sm:p-8">
                    <h1 className="text-[28px] font-bold mb-8 text-center text-cod-gray">Welcome Back</h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {error && <div className="text-[#DC2626] text-sm">{error}</div>}

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-cod-gray">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-default rounded-lg text-base outline-none transition-colors duration-200 focus:border-cod-gray"
                                required
                                placeholder="name@example.com"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-cod-gray">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-default rounded-lg text-base outline-none transition-colors duration-200 focus:border-cod-gray"
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex justify-end">
                            <Link href="/forgot-password" className="text-cod-gray font-semibold underline ml-1 text-sm">
                                Forgot Password?
                            </Link>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-river-bed">
                        Don&apos;t have an account?
                        <Link href="/register" className="text-cod-gray font-bold underline ml-1">Sign up</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}
