'use client';

import { useState } from 'react';
import { forgotPassword } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../auth.module.css';
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
            <div className={styles.formContainer}>
                <div className={styles.formBox}>
                    <h1 className={styles.title}>Forgot Password</h1>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && <div className={styles.error}>{error}</div>}
                        {message && <div style={{ color: 'green', textAlign: 'center' }}>{message}</div>}

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Code'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
