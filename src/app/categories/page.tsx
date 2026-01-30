import { getCategories } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';

export default async function CategoriesPage() {
    const categories = await getCategories();

    const breadcrumbItems = [
        { label: 'Categories' },
    ];

    return (
        <>
            <Navbar />
            <div className="max-w-container mx-auto py-12 px-[var(--container-padding)]">
                <Breadcrumb items={breadcrumbItems} />
                <h1 className="text-[32px] font-bold mb-8 text-center">All Categories</h1>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
                    {categories.map((cat) => (
                        <Link href={`/categories/${cat._id}`} key={cat._id} className="flex flex-col bg-white border border-default rounded-xl overflow-hidden transition-shadow duration-200 cursor-pointer hover:shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={cat.image} alt={cat.name} className="w-full aspect-square object-cover bg-secondary h-[250px]" />
                            <div className="p-4 font-semibold text-center text-cod-gray text-[18px]">{cat.name}</div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}
