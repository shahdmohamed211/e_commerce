'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface ImageGalleryProps {
    images: string[];
    mainImage: string;
    title: string;
}

export default function ImageGallery({ images, mainImage, title }: ImageGalleryProps) {
    const allImages = [mainImage, ...images.filter(img => img !== mainImage)];
    const [selectedImage, setSelectedImage] = useState(allImages[0]);

    return (
        <div className={styles.imageGallery}>
            {/* Main Image */}
            <div className={styles.mainImageContainer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={selectedImage}
                    alt={title}
                    className={styles.mainImage}
                />
            </div>

            {/* Thumbnail List */}
            {allImages.length > 1 && (
                <div className={styles.thumbnailList}>
                    {allImages.map((img, idx) => (
                        <button
                            key={idx}
                            className={`${styles.thumbnailBtn} ${selectedImage === img ? styles.thumbnailActive : ''}`}
                            onClick={() => setSelectedImage(img)}
                            aria-label={`View image ${idx + 1}`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={img}
                                alt={`${title} - Thumbnail ${idx + 1}`}
                                className={styles.thumbnail}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
