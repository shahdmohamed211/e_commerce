import React from 'react';

interface StarRatingProps {
    rating: number;
    size?: number;
    activeColor?: string;
    inactiveColor?: string;
}

export default function StarRating({
    rating,
    size = 16,
    activeColor = "text-yellow-400",
    inactiveColor = "text-gray-400 dark:text-gray-500"
}: StarRatingProps) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Full Stars
    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <svg key={`full-${i}`} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={activeColor}>
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
        );
    }

    // Half Star
    if (hasHalfStar) {
        stars.push(
            <div key="half" className="relative" style={{ width: size, height: size }}>
                {/* Empty star background for the half star */}
                <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`absolute top-0 left-0 ${inactiveColor}`}>
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                {/* Half filled star overlay */}
                <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`absolute top-0 left-0 ${activeColor} overflow-hidden`} style={{ width: '50%' }}>
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                {/* Clip logic is tricky with SVG unless using defs/mask. Simplest approach for "Half" is distinct SVG path */}
                <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`absolute top-0 left-0 ${activeColor}`}>
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77V2L12 2Z" fill="none" /> {/* Dummy */}
                    <path d="M22 9.27L15.09 8.26L12 2V17.77L18.18 21.02L17 14.14L22 9.27Z" fillOpacity="0" /> {/* Right side transparent? No, easier to just draw Left Half */}
                    <path d="M12 2L9.09 8.26L2 9.27L7 14.14L5.82 21.02L12 17.77V2Z" />
                </svg>
            </div>
        );
        // Wait, the div logic above tries to stack them, but SVG inside SVG needs careful width/viewbox.
        // Let's use a specific Half Star SVG Path or Defs.
        // The path above `M12 2L9.09 8.26...` is the left half.
        // Let's rewrite the loop to be cleaner using purely SVG paths for Full, Half, Empty.
    }

    return (
        <div className="flex items-center space-x-0.5">
            {[...Array(5)].map((_, i) => {
                const isFull = i < Math.floor(rating);
                const isHalf = i === Math.floor(rating) && rating % 1 >= 0.5;

                return (
                    <div key={i} className="relative">
                        {/* Background Star (Empty) */}
                        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={inactiveColor}>
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>

                        {/* Foreground Star (Filled - absolute over empty) */}
                        {(isFull || isHalf) && (
                            <div className={`absolute top-0 left-0 overflow-hidden ${isHalf ? 'w-1/2' : 'w-full'}`}>
                                <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={activeColor}>
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                </svg>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
