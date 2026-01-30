'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { register } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== rePassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const res = await register({ name, email, password, rePassword, phone });

            if (res.message === 'success') {
                loginUser(res.token, res.user);
            } else {
                setError(res.message || 'Registration failed');
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
                    <h1 className="text-[28px] font-bold mb-8 text-center text-cod-gray">Create Account</h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {error && <div className="text-[#DC2626] text-sm">{error}</div>}

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-cod-gray">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-default rounded-lg text-base outline-none transition-colors duration-200 focus:border-cod-gray"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-cod-gray">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-default rounded-lg text-base outline-none transition-colors duration-200 focus:border-cod-gray"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-cod-gray">Phone</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-3 border border-default rounded-lg text-base outline-none transition-colors duration-200 focus:border-cod-gray"
                                required
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
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-cod-gray">Confirm Password</label>
                            <input
                                type="password"
                                value={rePassword}
                                onChange={(e) => setRePassword(e.target.value)}
                                className="w-full px-4 py-3 border border-default rounded-lg text-base outline-none transition-colors duration-200 focus:border-cod-gray"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-river-bed">
                        Already have an account?
                        <Link href="/login" className="text-cod-gray font-bold underline ml-1">Login</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}
