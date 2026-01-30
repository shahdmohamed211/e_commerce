'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateLoggedUserPassword } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../../auth.module.css';
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
        <>
            <Navbar />
            <div className={styles.formContainer}>
                <div className={styles.formBox}>
                    <h1 className={styles.title}>Change Password</h1>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && <div className={styles.error}>{error}</div>}
                        {success && <div style={{ color: 'green', textAlign: 'center' }}>{success}</div>}

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Confirm New Password</label>
                            <input
                                type="password"
                                value={rePassword}
                                onChange={(e) => setRePassword(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
