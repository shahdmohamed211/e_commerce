'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getLoggedUserData } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

export default function ProfilePage() {
    const { token } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }
        getLoggedUserData().then(res => {
            if (res.data) setUserData(res.data);
            setLoading(false);
        });
    }, [token, router]);

    if (loading) return <div className="max-w-container mx-auto px-[var(--container-padding)] py-12">Loading...</div>;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-container mx-auto px-[var(--container-padding)] py-12 w-full">
                <div className="max-w-[800px] mx-auto">
                    <h1 className="text-[32px] font-bold mb-10">Account Settings</h1>

                    <div className="bg-white border border-default rounded-2xl p-8 mb-8">
                        <h2 className="text-xl font-bold mb-6 text-cod-gray pb-4 border-b border-subtle">Personal Information</h2>
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-1">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-bold text-pale-sky uppercase tracking-wider">Name</label>
                                <div className="text-[17px] font-medium text-cod-gray">{userData?.name}</div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-bold text-pale-sky uppercase tracking-wider">Email</label>
                                <div className="text-[17px] font-medium text-cod-gray">{userData?.email}</div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-bold text-pale-sky uppercase tracking-wider">Phone</label>
                                <div className="text-[17px] font-medium text-cod-gray">{userData?.phone || 'Not provided'}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-default rounded-2xl p-8 mb-8">
                        <h2 className="text-xl font-bold mb-6 text-cod-gray pb-4 border-b border-subtle">Preferences</h2>
                        <div className="flex flex-col gap-4">
                            <div
                                className="flex items-center justify-between p-4 bg-secondary rounded-xl cursor-pointer hover:bg-athens-gray transition-colors duration-200"
                                onClick={toggleTheme}
                            >
                                <div className="flex flex-col">
                                    <span className="text-[15px] font-bold text-cod-gray">Theme</span>
                                    <span className="text-sm text-river-bed">{theme === 'light' ? 'Light Mode' : 'Dark Mode'} enabled</span>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${theme === 'dark' ? 'bg-black text-white' : 'bg-white border border-default text-black'}`}>
                                    Switch to {theme === 'light' ? 'Dark' : 'Light'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link href="/profile/addresses" className="flex items-center justify-between p-5 bg-white border border-default rounded-xl no-underline hover:border-cod-gray hover:shadow-sm transition-all duration-200 group">
                            <span className="font-bold text-cod-gray">Manage Addresses</span>
                            <span className="text-pale-sky group-hover:text-cod-gray group-hover:translate-x-1 transition-all duration-200">→</span>
                        </Link>
                        <Link href="/profile/change-password" className="flex items-center justify-between p-5 bg-white border border-default rounded-xl no-underline hover:border-cod-gray hover:shadow-sm transition-all duration-200 group">
                            <span className="font-bold text-cod-gray">Change Password</span>
                            <span className="text-pale-sky group-hover:text-cod-gray group-hover:translate-x-1 transition-all duration-200">→</span>
                        </Link>
                        <Link href="/allorders" className="flex items-center justify-between p-5 bg-white border border-default rounded-xl no-underline hover:border-cod-gray hover:shadow-sm transition-all duration-200 group">
                            <span className="font-bold text-cod-gray">Order History</span>
                            <span className="text-pale-sky group-hover:text-cod-gray group-hover:translate-x-1 transition-all duration-200">→</span>
                        </Link>
                        <Link href="/wishlist" className="flex items-center justify-between p-5 bg-white border border-default rounded-xl no-underline hover:border-cod-gray hover:shadow-sm transition-all duration-200 group">
                            <span className="font-bold text-cod-gray">My Wishlist</span>
                            <span className="text-pale-sky group-hover:text-cod-gray group-hover:translate-x-1 transition-all duration-200">→</span>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
