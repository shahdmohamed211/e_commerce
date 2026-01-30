import { getProductById, getProducts, Product } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton';
import ImageGallery from './ImageGallery';
import WishlistButton from './WishlistButton';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    // Fetch related products (same category)
    const relatedProducts = await getProducts(`?category[in]=${product.category._id}&limit=4`);
    const filteredRelated = relatedProducts.filter((p: Product) => p._id !== product._id).slice(0, 4);

    const breadcrumbItems = [
        { label: 'Products', href: '/products' },
        { label: product.title },
    ];

    return (
        <>
            <Navbar />
            <main className={styles.container}>
                <Breadcrumb items={breadcrumbItems} />

                <div className={styles.detailsWrapper}>
                    {/* Image Gallery */}
                    <ImageGallery
                        images={product.images || []}
                        mainImage={product.imageCover}
                        title={product.title}
                    />

                    {/* Product Info */}
                    <div className={styles.info}>
                        <div>
                            <span className={styles.brand}>{product.brand?.name}</span>
                            <h1 className={styles.title}>{product.title}</h1>
                        </div>

                        <div className={styles.rating}>
                            <span>★ {product.ratingsAverage}</span>
                            <span style={{ color: 'var(--color-pale-sky)' }}>({product.ratingsQuantity} reviews)</span>
                        </div>

                        <div className={styles.price}>EGP {product.price.toLocaleString()}</div>

                        <p className={styles.description}>{product.description}</p>

                        <div className={styles.actions}>
                            <AddToCartButton productId={product._id} />
                            <WishlistButton productId={product._id} />
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {filteredRelated.length > 0 && (
                    <section className={styles.relatedSection}>
                        <h2 className={styles.relatedTitle}>Related Products</h2>
                        <div className={styles.relatedGrid}>
                            {filteredRelated.map((p: Product) => (
                                <ProductCard
                                    key={p._id}
                                    id={p._id}
                                    image={p.imageCover}
                                    brand={p.brand?.name}
                                    title={p.title}
                                    category={p.category?.name}
                                    price={p.price}
                                    rating={p.ratingsAverage}
                                    reviews={p.ratingsQuantity}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}
