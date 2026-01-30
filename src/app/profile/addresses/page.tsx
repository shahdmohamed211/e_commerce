'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserAddresses, addAddress, removeAddress } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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

    if (loading) return <div className="max-w-container mx-auto px-[var(--container-padding)] py-12">Loading...</div>;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-container mx-auto px-[var(--container-padding)] py-12 w-full">
                <div className="max-w-[800px] mx-auto">
                    <h1 className="text-[32px] font-bold mb-10">My Addresses</h1>

                    <div className="flex flex-col gap-4 mb-12">
                        {addresses.map((addr) => (
                            <div key={addr._id} className="flex justify-between items-center bg-white border border-default p-6 rounded-xl hover:shadow-sm transition-shadow duration-200">
                                <div>
                                    <div className="font-bold text-lg text-cod-gray mb-1">{addr.name}</div>
                                    <div className="text-river-bed text-sm mb-1">{addr.details}, {addr.city}</div>
                                    <div className="text-pale-sky text-[13px] font-medium">{addr.phone}</div>
                                </div>
                                <button onClick={() => handleRemove(addr._id)} className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors duration-200 underline bg-transparent border-none cursor-pointer">Remove</button>
                            </div>
                        ))}
                        {addresses.length === 0 && (
                            <div className="text-center py-10 bg-secondary rounded-xl border border-dashed border-subtle">
                                <p className="text-pale-sky">No addresses saved yet.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-secondary p-8 rounded-2xl border border-subtle">
                        <h2 className="text-xl font-bold mb-6">Add New Address</h2>
                        <form onSubmit={handleAdd} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-cod-gray">Address Label</label>
                                <input
                                    placeholder="e.g. Home, Office"
                                    className="w-full p-3.5 bg-white border border-default rounded-lg focus:outline-none focus:border-cod-gray transition-all duration-200"
                                    value={newAddress.name}
                                    onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-cod-gray">Street Details</label>
                                <input
                                    placeholder="Street details, apartment, etc."
                                    className="w-full p-3.5 bg-white border border-default rounded-lg focus:outline-none focus:border-cod-gray transition-all duration-200"
                                    value={newAddress.details}
                                    onChange={e => setNewAddress({ ...newAddress, details: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-cod-gray">Phone</label>
                                    <input
                                        placeholder="Phone number"
                                        className="w-full p-3.5 bg-white border border-default rounded-lg focus:outline-none focus:border-cod-gray transition-all duration-200"
                                        value={newAddress.phone}
                                        onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-cod-gray">City</label>
                                    <input
                                        placeholder="City"
                                        className="w-full p-3.5 bg-white border border-default rounded-lg focus:outline-none focus:border-cod-gray transition-all duration-200"
                                        value={newAddress.city}
                                        onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-black text-white rounded-lg font-bold text-sm mt-4 hover:opacity-90 transition-all duration-200 disabled:opacity-50" disabled={adding}>
                                {adding ? 'Adding...' : 'Add Address'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
