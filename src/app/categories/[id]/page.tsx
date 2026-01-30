import { getProducts, Product, getSubCategoriesOnCategory, getCategoryById } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ subcategory?: string }>;
}

export default async function CategoryDetailsPage({ params, searchParams }: PageProps) {
    const { id } = await params;
    const { subcategory } = await searchParams;

    const query = subcategory
        ? `?category[in]=${id}&subcategory=${subcategory}`
        : `?category[in]=${id}`;

    const [products, subCategoriesData, categoryData] = await Promise.all([
        getProducts(query),
        getSubCategoriesOnCategory(id),
        getCategoryById(id)
    ]);

    const categoryName = categoryData?.data?.name || 'Category';

    const breadcrumbItems = [
        { label: 'Categories', href: '/categories' },
        { label: categoryName },
    ];

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <Breadcrumb items={breadcrumbItems} />

                <div className={styles.categoryHeader}>
                    <h1 className={styles.title}>{categoryName}</h1>
                    {subCategoriesData.data?.length > 0 && (
                        <div className={styles.subCatWrapper}>
                            <span>Subcategories:</span>
                            <div className={styles.subCatList}>
                                <Link
                                    href={`/categories/${id}`}
                                    className={`${styles.subCatLink} ${!subcategory ? styles.activeSubCat : ''}`}
                                >
                                    All
                                </Link>
                                {subCategoriesData.data.map((sub: any) => (
                                    <Link
                                        key={sub._id}
                                        href={`/categories/${id}?subcategory=${sub._id}`}
                                        className={`${styles.subCatLink} ${subcategory === sub._id ? styles.activeSubCat : ''}`}
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {products.length > 0 ? (
                    <div className={styles.grid}>
                        {products.map((product: Product) => (
                            <ProductCard
                                key={product._id}
                                id={product._id}
                                image={product.imageCover}
                                brand={product.brand?.name}
                                title={product.title}
                                category={product.category?.name}
                                price={product.price}
                                rating={product.ratingsAverage}
                                reviews={product.ratingsQuantity}
                            />
                        ))}
                    </div>
                ) : (
                    <p className={styles.noProducts}>No products found in this selection.</p>
                )}
            </div>
            <Footer />
        </>
    );
}
