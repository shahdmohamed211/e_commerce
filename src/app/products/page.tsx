import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ProductCard from '@/components/ProductCard';
import { Metadata } from 'next';
import { getProducts, Product } from '@/lib/api';

export const metadata: Metadata = {
    title: 'All Products - ShopMart',
    description: 'Browse our extensive collection of products.',
};

export default async function ProductsPage() {
    const products = await getProducts();

    const breadcrumbItems = [
        { label: 'Products' },
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1, padding: '48px 0', background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <Breadcrumb items={breadcrumbItems} />

                    <div style={{ marginBottom: '32px' }}>
                        <h1 className="h1" style={{ fontSize: '32px' }}>All Products</h1>
                        <p className="body-md" style={{ color: 'var(--text-secondary)' }}>
                            Showing {products.length} results
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '32px'
                    }}>
                        {products.map((product: Product) => (
                            <ProductCard
                                key={product._id}
                                id={product._id}
                                image={product.imageCover}
                                brand={product.brand.name}
                                title={product.title}
                                category={product.category.name}
                                price={product.price}
                                rating={product.ratingsAverage}
                                reviews={product.ratingsQuantity}
                            />
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
