import { getBrands } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';

export default async function BrandsPage() {
    const brands = await getBrands();

    const breadcrumbItems = [
        { label: 'Brands' },
    ];

    return (
        <>
            <Navbar />
            <div className="max-w-container mx-auto py-12 px-[var(--container-padding)]">
                <Breadcrumb items={breadcrumbItems} />
                <h1 className="text-[32px] font-bold mb-8 text-center">All Brands</h1>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
                    {brands.map((brand) => (
                        <Link href={`/brands/${brand._id}`} key={brand._id} className="flex flex-col bg-white border border-default rounded-xl overflow-hidden transition-shadow duration-200 cursor-pointer hover:shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={brand.image} alt={brand.name} className="w-full aspect-square object-contain bg-secondary p-4" />
                            <div className="p-4 font-semibold text-center text-cod-gray text-[18px]">{brand.name}</div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}
