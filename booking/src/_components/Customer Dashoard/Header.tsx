'use client';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';

export type TabType = 'home' | 'history' | 'about';

interface DashboardHeaderProps {
    activeTab: TabType;
    setActiveTab: Dispatch<SetStateAction<TabType>>;
    onOpenBookingForm: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    type Slide = {
        id: number;
        image: string;
        alt: string;
        title?: string;
        subtitle?: string;
        description?: string;
        ctaText?: string;
        ctaLink?: string;
        contentClasses?: string;
        imageBrightness?: string;
    };

    const slides: Slide[] = [
        {
            id: 1,
            image: '/Landing/background.png',
            alt: 'galaxy',
            title: 'PAWSPACE PET HOTEL & GROOMING',
            subtitle: "Your best friend's new best friend!",
            contentClasses: 'text-center text-white drop-shadow-lg',
        },
        {
            id: 2,
            image: '/Slides/spaceship.jpg',
            alt: 'spaceship',
            title: 'Extended Stays, Stellar Savings!',
            description: 'Enjoy exceptional discounts for longer boarding durations:',
            contentClasses: 'text-center text-white drop-shadow-lg',
            imageBrightness: 'brightness-[0.3]',
        },
        {
            id: 3,
            image: '/Slides/pawspace-background.png',
            alt: 'pawspace-logo'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 7000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div className="relative w-full overflow-hidden rounded-lg mb-6 mx-auto max-w-full lg:max-w-7xl px-4">
            <div className="relative h-[300px] md:h-[400px] lg:h-[450px] w-full rounded-lg overflow-hidden">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center
            ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                        <img
                            src={slide.image}
                            alt={slide.alt}
                            className={`absolute inset-0 w-full h-full object-cover ${slide.imageBrightness || 'brightness-[0.4]'} transition-all duration-1000 ease-in-out`}
                            style={{ transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)' }}
                        />
                        <div className={`relative z-10 p-4 sm:p-8 ${slide.contentClasses}`}>
                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold mb-2 leading-tight">
                                {slide.title}
                            </h1>
                            <p className="text-base sm:text-lg lg:text-xl font-light mb-3 text-white/90">
                                {slide.subtitle}
                            </p>
                            {slide.description && (
                                <p className="text-xs sm:text-sm lg:text-base mb-4 max-w-xl mx-auto text-white/80">
                                    {slide.description}
                                </p>
                            )}

                            {slide.id === 2 && (
                                <div className="flex justify-center gap-2 sm:gap-4 mt-6">
                                    <div className="bg-white/15 backdrop-blur-sm p-3 rounded-lg border border-white/20 transition-transform hover:scale-105 duration-300 flex-1 min-w-0">
                                        <p className="text-xl sm:text-3xl lg:text-4xl font-bold mb-1">10% OFF</p>
                                        <p className="text-xs sm:text-sm lg:text-base">for 7-night stays</p>
                                    </div>
                                    <div className="bg-white/15 backdrop-blur-sm p-3 rounded-lg border border-white/20 transition-transform hover:scale-105 duration-300 flex-1 min-w-0">
                                        <p className="text-xl sm:text-3xl lg:text-4xl font-bold mb-1">20% OFF</p>
                                        <p className="text-xs sm:text-sm lg:text-base">for 15+ night stays</p>
                                    </div>
                                </div>
                            )}

                            {slide.ctaText && slide.ctaLink && (
                                <a
                                    href={slide.ctaLink}
                                    className="mt-6 inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-full shadow-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300 transform hover:scale-105"
                                >
                                    {slide.ctaText}
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        aria-label={`Slide ${index + 1}`}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide ? 'bg-white scale-110' : 'bg-white/50'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default DashboardHeader;