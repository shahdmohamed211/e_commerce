'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { login } from '@/lib/api';
import styles from '../auth.module.css';
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
            <div className={styles.formContainer}>
                <div className={styles.formBox}>
                    <h1 className={styles.title}>Welcome Back</h1>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && <div className={styles.error}>{error}</div>}

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                                required
                                placeholder="name@example.com"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Link href="/forgot-password" className={styles.link} style={{ fontSize: '14px', fontWeight: 500 }}>
                                Forgot Password?
                            </Link>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className={styles.switchText}>
                        Don&apos;t have an account?
                        <Link href="/register" className={styles.link}>Sign up</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}
