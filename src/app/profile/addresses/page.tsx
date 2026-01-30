'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserAddresses, addAddress, removeAddress } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function AddressesPage() {
    const { token } = useAuth();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newAddress, setNewAddress] = useState({ name: '', details: '', phone: '', city: '' });
    const [adding, setAdding] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }
        fetchAddresses();
    }, [token, router]);

    const fetchAddresses = async () => {
        const res = await getUserAddresses();
        if (res.data) setAddresses(res.data);
        setLoading(false);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdding(true);
        try {
            const res = await addAddress(newAddress);
            if (res.status === 'success') {
                setAddresses(res.data);
                setNewAddress({ name: '', details: '', phone: '', city: '' });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setAdding(false);
        }
    };

    const handleRemove = async (id: string) => {
        try {
            const res = await removeAddress(id);
            if (res.status === 'success') {
                setAddresses(res.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="container">
                <div className={styles.addressContainer}>
                    <h1 className={styles.title}>My Addresses</h1>

                    <div className={styles.list}>
                        {addresses.map((addr) => (
                            <div key={addr._id} className={styles.addrCard}>
                                <div>
                                    <div className={styles.addrName}>{addr.name}</div>
                                    <div className={styles.addrDetails}>{addr.details}, {addr.city}</div>
                                    <div className={styles.addrPhone}>{addr.phone}</div>
                                </div>
                                <button onClick={() => handleRemove(addr._id)} className={styles.removeBtn}>Remove</button>
                            </div>
                        ))}
                        {addresses.length === 0 && <p>No addresses saved yet.</p>}
                    </div>

                    <div className={styles.formSection}>
                        <h2>Add New Address</h2>
                        <form onSubmit={handleAdd} className={styles.form}>
                            <input
                                placeholder="Address Label (e.g. Home, Office)"
                                className={styles.input}
                                value={newAddress.name}
                                onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Street Details"
                                className={styles.input}
                                value={newAddress.details}
                                onChange={e => setNewAddress({ ...newAddress, details: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Phone"
                                className={styles.input}
                                value={newAddress.phone}
                                onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                required
                            />
                            <input
                                placeholder="City"
                                className={styles.input}
                                value={newAddress.city}
                                onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                required
                            />
                            <button type="submit" className="btn btn-primary" disabled={adding}>
                                {adding ? 'Adding...' : 'Add Address'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
