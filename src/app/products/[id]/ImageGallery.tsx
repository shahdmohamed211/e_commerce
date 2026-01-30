'use client';

import { useState } from 'react';

interface ImageGalleryProps {
    images: string[];
    mainImage: string;
    title: string;
}

export default function ImageGallery({ images, mainImage, title }: ImageGalleryProps) {
    const allImages = [mainImage, ...images.filter(img => img !== mainImage)];
    const [selectedImage, setSelectedImage] = useState(allImages[0]);

    return (
        <div className="flex flex-col gap-5">
            {/* Main Image */}
            <div className="w-full aspect-square bg-white rounded-3xl overflow-hidden border border-subtle">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={selectedImage}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
            </div>

            {/* Thumbnail List */}
            {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {allImages.map((img, idx) => (
                        <button
                            key={idx}
                            className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 outline-none ${selectedImage === img ? 'border-cod-gray shadow-md transition-all duration-200 scale-95' : 'border-transparent opacity-60 hover:opacity-100 hover:border-default'}`}
                            onClick={() => setSelectedImage(img)}
                            aria-label={`View image ${idx + 1}`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={img}
                                alt={`${title} - Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
