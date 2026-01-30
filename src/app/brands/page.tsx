import { getBrands } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import styles from '../grid.module.css';
import Link from 'next/link';

export default async function BrandsPage() {
    const brands = await getBrands();

    const breadcrumbItems = [
        { label: 'Brands' },
    ];

    return (
        <>
            <Navbar />
            <div className={styles.gridContainer}>
                <Breadcrumb items={breadcrumbItems} />
                <h1 className={styles.title}>All Brands</h1>
                <div className={styles.grid}>
                    {brands.map((brand) => (
                        <Link href={`/brands/${brand._id}`} key={brand._id} className={styles.card}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={brand.image} alt={brand.name} className={styles.image} style={{ objectFit: 'contain', padding: '16px' }} />
                            <div className={styles.name}>{brand.name}</div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}
