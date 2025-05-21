// components/DashboardHeader.tsx
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

  const slides = [
    {
      id: 1,
      content: (
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">PAWSPACE PET HOTEL AND GROOMING</h1>
          <p className="text-xl md:text-2xl font-light text-white/90">Your best friend's new best friend.</p>
        </div>
      ),
      bgClass: 'bg-gradient-to-r from-purple-600 to-indigo-600'
    },
    {
      id: 2,
      content: (
        <div className="text-center text-white">
          <h2 className="text-3xl md:text-3xl font-bold mb-6">Save on longer stays!</h2>
          <div className="flex flex-col md:flex-row justify-center gap-6 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <p className="text-5xl font-bold mb-2">10% OFF</p>
              <p className="text-lg">for 7-night stay</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <p className="text-5xl font-bold mb-2">20% OFF</p>
              <p className="text-lg">for 15-night stay or longer</p>
            </div>
          </div>
        </div>
      ),
      bgClass: 'bg-gradient-to-r from-indigo-600 to-blue-600'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg mb-8 mx-4 mt-4">
      {/* Slideshow */}
      <div className="relative h-64 md:h-80 w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${slide.bgClass} ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="px-4 w-full">
              {slide.content}
            </div>
          </div>
        ))}
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardHeader;