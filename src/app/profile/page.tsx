'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getLoggedUserData } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
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

    if (loading) return <div className="container">Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="container">
                <div className={styles.profileContainer}>
                    <h1 className={styles.title}>Account Settings</h1>

                    <div className={styles.section}>
                        <h2>Personal Information</h2>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <label>Name</label>
                                <div>{userData?.name}</div>
                            </div>
                            <div className={styles.infoItem}>
                                <label>Email</label>
                                <div>{userData?.email}</div>
                            </div>
                            <div className={styles.infoItem}>
                                <label>Phone</label>
                                <div>{userData?.phone || 'Not provided'}</div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2>Preferences</h2>
                        <div className={styles.menu}>
                            <div className={styles.menuItem} onClick={toggleTheme} style={{ cursor: 'pointer' }}>
                                <span>Theme: {theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
                                <span className={styles.arrow} style={{
                                    background: theme === 'dark' ? '#000' : '#eee',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '12px'
                                }}>
                                    Switch to {theme === 'light' ? 'Dark' : 'Light'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.menu}>
                        <Link href="/profile/addresses" className={styles.menuItem}>
                            <span>Manage Addresses</span>
                            <span className={styles.arrow}>→</span>
                        </Link>
                        <Link href="/profile/change-password" className={styles.menuItem}>
                            <span>Change Password</span>
                            <span className={styles.arrow}>→</span>
                        </Link>
                        <Link href="/allorders" className={styles.menuItem}>
                            <span>Order History</span>
                            <span className={styles.arrow}>→</span>
                        </Link>
                        <Link href="/wishlist" className={styles.menuItem}>
                            <span>My Wishlist</span>
                            <span className={styles.arrow}>→</span>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
