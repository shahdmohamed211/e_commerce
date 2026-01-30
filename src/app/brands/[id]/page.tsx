import { getProducts, Product, getBrandById } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function BrandDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const [products, brandData] = await Promise.all([
        getProducts(`?brand=${id}`),
        getBrandById(id)
    ]);

    const brandName = brandData?.data?.name || 'Brand';

    const breadcrumbItems = [
        { label: 'Brands', href: '/brands' },
        { label: brandName },
    ];

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <Breadcrumb items={breadcrumbItems} />

                <h1 className={styles.title}>{brandName} Products</h1>
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
                    <p>No products found for this brand.</p>
                )}
            </div>
            <Footer />
        </>
    );
}
