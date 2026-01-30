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
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 bg-secondary">
                <div className="container">
                    <Breadcrumb items={breadcrumbItems} />

                    <div className="mb-8">
                        <h1 className="text-[32px] font-bold">All Products</h1>
                        <p className="text-pale-sky text-base">
                            Showing {products.length} results
                        </p>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8">
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
