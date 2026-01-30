import { getCategories } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import styles from '../grid.module.css';
import Link from 'next/link';

export default async function CategoriesPage() {
    const categories = await getCategories();

    const breadcrumbItems = [
        { label: 'Categories' },
    ];

    return (
        <>
            <Navbar />
            <div className={styles.gridContainer}>
                <Breadcrumb items={breadcrumbItems} />
                <h1 className={styles.title}>All Categories</h1>
                <div className={styles.grid}>
                    {categories.map((cat) => (
                        <Link href={`/categories/${cat._id}`} key={cat._id} className={styles.card}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={cat.image} alt={cat.name} className={styles.image} style={{ height: '250px' }} />
                            <div className={styles.name}>{cat.name}</div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}
