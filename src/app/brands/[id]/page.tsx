import { getProducts, Product, getBrandById } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ProductCard from '@/components/ProductCard';

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
            <div className="max-w-container mx-auto px-[var(--container-padding)] py-12">
                <Breadcrumb items={breadcrumbItems} />

                <h1 className="text-[32px] font-bold mb-8">{brandName} Products</h1>
                {products.length > 0 ? (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8">
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
                    <div className="flex flex-col items-center justify-center py-20 text-center text-pale-sky">
                        <p className="text-lg">No products found for this brand.</p>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
