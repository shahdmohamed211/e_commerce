'use client';

import { useState } from 'react';
import { verifyResetCode, resetPassword } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../auth.module.css';
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
                // But reset API usually returns the token
                loginUser(res.token, { name: 'User', email, role: 'user' }); // API might not return full user obj here, handle gracefully
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
        <>
            <Navbar />
            <div className={styles.formContainer}>
                <div className={styles.formBox}>
                    <h1 className={styles.title}>Reset Password</h1>

                    {step === 1 ? (
                        <form onSubmit={handleVerify} className={styles.form}>
                            {error && <div className={styles.error}>{error}</div>}
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Reset Code</label>
                                <input
                                    type="text"
                                    value={resetCode}
                                    onChange={(e) => setResetCode(e.target.value)}
                                    className={styles.input}
                                    required
                                    placeholder="Enter code sent to email"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleReset} className={styles.form}>
                            {error && <div className={styles.error}>{error}</div>}
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.input}
                                    required
                                    placeholder="Confirm your email"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className={styles.input}
                                    required
                                    placeholder="Enter new password"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Reseting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                </div>
            </div>
            <Footer />
        </>
    );
}
