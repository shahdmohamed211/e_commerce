'use client';

import { useState } from 'react';
import { verifyResetCode, resetPassword } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ResetPasswordPage() {
    const [resetCode, setResetCode] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Verify Code, 2: New Password
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { loginUser } = useAuth();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await verifyResetCode(resetCode);
            if (res.status === 'Success') {
                setStep(2);
            } else {
                setError(res.message || 'Invalid Request');
            }
        } catch (err) {
            setError('Invalid Code');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await resetPassword({ email, newPassword });
            if (res.token) {
                // Auto login
                loginUser(res.token, { name: 'User', email, role: 'user' });
            } else {
                setError('Failed to reset password');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-10 bg-alabaster min-h-[calc(100vh-128px)]">
                <div className="w-full max-w-[450px] bg-white p-10 rounded-[20px] shadow-sm border border-default sm:p-6 sm:rounded-none">
                    <h1 className="text-[32px] font-bold text-center mb-8">Reset Password</h1>

                    {step === 1 ? (
                        <form onSubmit={handleVerify} className="flex flex-col gap-5">
                            {error && <div className="text-red-500 bg-red-50 p-3 rounded-lg text-sm text-center border border-red-100">{error}</div>}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-cod-gray">Reset Code</label>
                                <input
                                    type="text"
                                    value={resetCode}
                                    onChange={(e) => setResetCode(e.target.value)}
                                    className="w-full p-3.5 bg-alabaster border border-default rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-cod-gray focus:bg-white"
                                    required
                                    placeholder="Enter code sent to email"
                                />
                            </div>
                            <button type="submit" className="w-full py-4 px-6 bg-black text-white rounded-lg font-bold text-sm cursor-pointer transition-transform duration-200 hover:scale-[1.02] disabled:opacity-50 mt-2" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleReset} className="flex flex-col gap-5">
                            {error && <div className="text-red-500 bg-red-50 p-3 rounded-lg text-sm text-center border border-red-100">{error}</div>}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-cod-gray">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3.5 bg-alabaster border border-default rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-cod-gray focus:bg-white"
                                    required
                                    placeholder="Confirm your email"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-cod-gray">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-3.5 bg-alabaster border border-default rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-cod-gray focus:bg-white"
                                    required
                                    placeholder="Enter new password"
                                />
                            </div>
                            <button type="submit" className="w-full py-4 px-6 bg-black text-white rounded-lg font-bold text-sm cursor-pointer transition-transform duration-200 hover:scale-[1.02] disabled:opacity-50 mt-2" disabled={loading}>
                                {loading ? 'Reseting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
}
