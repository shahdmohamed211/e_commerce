import { getProductById, getProducts, Product } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ProductCard from '@/components/ProductCard';
import StarRating from '@/components/StarRating';
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
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-container mx-auto px-[var(--container-padding)] py-12 w-full">
                <Breadcrumb items={breadcrumbItems} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 items-start">
                    {/* Image Gallery */}
                    <ImageGallery
                        images={product.images || []}
                        mainImage={product.imageCover}
                        title={product.title}
                    />

                    {/* Product Info */}
                    <div className="flex flex-col items-start gap-1 pt-4">
                        {/* Brand */}
                        <div className="font-bold text-[13px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-0">{product.brand?.name}</div>

                        {/* Title */}
                        <h1 className="text-[32px] font-bold leading-tight text-primary m-0">{product.title}</h1>

                        <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={product.ratingsAverage} size={18} />
                            <span className="text-primary font-bold text-[14px] ml-1">{product.ratingsAverage}</span>
                            <span className="text-gray-500 dark:text-gray-400 text-[13px] font-medium">({product.ratingsQuantity} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="text-[28px] font-bold text-primary mt-4">EGP {product.price.toLocaleString()}</div>

                        {/* Description */}
                        <div className="mt-4">
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[15px] max-w-xl">{product.description}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-8 w-full">
                            <AddToCartButton productId={product._id} />
                            <WishlistButton productId={product._id} />
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {filteredRelated.length > 0 && (
                    <section className="mt-16 pt-10 border-t border-subtle">
                        <h2 className="text-[28px] font-bold mb-10 text-cod-gray">Related Products</h2>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8">
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
        </div>
    );
}
