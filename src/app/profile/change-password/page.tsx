'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateLoggedUserPassword } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== rePassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await updateLoggedUserPassword({ currentPassword, password, rePassword });
            if (res.status === 'success' || res.token) {
                setSuccess('Password updated successfully!');
                setTimeout(() => router.push('/profile'), 2000);
            } else {
                setError(res.message || 'Failed to update password');
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
                    <h1 className="text-[32px] font-bold text-center mb-8">Change Password</h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {error && <div className="text-red-500 bg-red-50 p-3 rounded-lg text-sm text-center border border-red-100">{error}</div>}
                        {success && <div className="text-green-600 bg-green-50 p-3 rounded-lg text-sm text-center border border-green-100">{success}</div>}

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-cod-gray">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full p-3.5 bg-alabaster border border-default rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-cod-gray focus:bg-white"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-cod-gray">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3.5 bg-alabaster border border-default rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-cod-gray focus:bg-white"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-cod-gray">Confirm New Password</label>
                            <input
                                type="password"
                                value={rePassword}
                                onChange={(e) => setRePassword(e.target.value)}
                                className="w-full p-3.5 bg-alabaster border border-default rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-cod-gray focus:bg-white"
                                required
                            />
                        </div>

                        <button type="submit" className="w-full py-4 px-6 bg-black text-white rounded-lg font-bold text-sm cursor-pointer transition-transform duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-2" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
