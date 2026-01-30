'use client';

import { useState } from 'react';
import { forgotPassword } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await forgotPassword(email);
            if (res.statusMsg === 'success') {
                setMessage(res.message);
                setTimeout(() => router.push('/reset-password'), 2000);
            } else {
                setError(res.message || 'Failed to send reset code');
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
            <div className="flex-1 flex items-center justify-center p-10 bg-alabaster min-h-[calc(100vh-128px)]">
                <div className="w-full max-w-[450px] bg-white p-10 rounded-[20px] shadow-sm border border-default sm:p-6 sm:rounded-none">
                    <h1 className="text-[32px] font-bold text-center mb-8">Forgot Password</h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {error && <div className="text-red-500 bg-red-50 p-3 rounded-lg text-sm text-center border border-red-100">{error}</div>}
                        {message && <div className="text-green-600 bg-green-50 p-3 rounded-lg text-sm text-center border border-green-100">{message}</div>}

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-cod-gray">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3.5 bg-alabaster border border-default rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-cod-gray focus:bg-white"
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <button type="submit" className="w-full py-4 px-6 bg-black text-white rounded-lg font-bold text-sm cursor-pointer transition-transform duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Code'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
