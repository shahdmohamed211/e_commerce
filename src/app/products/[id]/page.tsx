import { getProductById, getProducts, Product } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ProductCard from '@/components/ProductCard';
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

                <div className="grid grid-cols-2 gap-12 mt-8 lg:grid-cols-1 md:gap-8">
                    {/* Image Gallery */}
                    <ImageGallery
                        images={product.images || []}
                        mainImage={product.imageCover}
                        title={product.title}
                    />

                    {/* Product Info */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <span className="text-pale-sky font-semibold text-sm uppercase tracking-wider mb-2 block">{product.brand?.name}</span>
                            <h1 className="text-[40px] font-bold leading-tight text-cod-gray md:text-[32px]">{product.title}</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center bg-supernova/10 px-3 py-1 rounded-lg">
                                <span className="text-supernova font-bold mr-1">★</span>
                                <span className="text-cod-gray font-bold">{product.ratingsAverage}</span>
                            </div>
                            <span className="text-pale-sky text-sm font-medium">({product.ratingsQuantity} reviews)</span>
                        </div>

                        <div className="text-[32px] font-bold text-cod-gray">EGP {product.price.toLocaleString()}</div>

                        <div className="h-[1px] bg-subtle w-full"></div>

                        <div className="flex flex-col gap-4">
                            <h3 className="text-base font-bold text-cod-gray uppercase tracking-wide">Description</h3>
                            <p className="text-river-bed leading-relaxed text-[15px]">{product.description}</p>
                        </div>

                        <div className="flex gap-4 mt-4 sm:flex-col">
                            <AddToCartButton productId={product._id} />
                            <WishlistButton productId={product._id} />
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {filteredRelated.length > 0 && (
                    <section className="mt-24 pt-12 border-t border-subtle">
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
