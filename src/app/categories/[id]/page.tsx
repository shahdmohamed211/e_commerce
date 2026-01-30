import { getProducts, Product, getSubCategoriesOnCategory, getCategoryById } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ProductCard from '@/components/ProductCard';
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
            <div className="max-w-container mx-auto px-[var(--container-padding)] py-12">
                <Breadcrumb items={breadcrumbItems} />

                <div className="flex flex-col gap-6 mb-10">
                    <h1 className="text-[32px] font-bold">{categoryName}</h1>
                    {subCategoriesData.data?.length > 0 && (
                        <div className="flex items-center gap-4 border-b border-subtle pb-4 overflow-x-auto sm:flex-col sm:items-start sm:gap-4 sm:border-none">
                            <span className="text-sm font-semibold text-pale-sky whitespace-nowrap">Subcategories:</span>
                            <div className="flex gap-2.5">
                                <Link
                                    href={`/categories/${id}`}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline whitespace-nowrap ${!subcategory ? 'bg-black text-white shadow-sm' : 'bg-secondary text-primary hover:bg-athens-gray'}`}
                                >
                                    All
                                </Link>
                                {subCategoriesData.data.map((sub: any) => (
                                    <Link
                                        key={sub._id}
                                        href={`/categories/${id}?subcategory=${sub._id}`}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline whitespace-nowrap ${subcategory === sub._id ? 'bg-black text-white shadow-sm' : 'bg-secondary text-primary hover:bg-athens-gray'}`}
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

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
                        <p className="text-lg">No products found in this selection.</p>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
