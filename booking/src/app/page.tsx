"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation'; 

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6 inline-block mr-2" viewBox="0 0 24 24">
        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.58 4.76a3 3 0 01-2.84 0L1.5 8.67z" />
        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.408a2.25 2.25 0 002.172 0L22.5 6.908z" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6 inline-block mr-2" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M2.25 6.75A3 3 0 015.25 3.75h1.372c.86 0 1.61.586 1.94 1.454l.758 2.275a1.5 1.5 0 01-.159 1.488l-1.54 1.54a12.75 12.75 0 008.214 8.214l1.54-1.54a1.5 1.5 0 011.488-.159l2.275.758c.86.33 1.454 1.08 1.454 1.94v1.372a3 3 0 01-3 3H7.5a9 9 0 01-9-9V6.75z" clipRule="evenodd" />
    </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6 inline-block mr-2" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a8.717 8.717 0 001.353-.82c1.373-.887 2.844-2.062 4.215-3.362.867-.867 1.724-1.776 2.503-2.713.895-1.059 1.657-2.157 2.15-3.231C22.613 8.35 22.893 7.077 22.893 5.75a7.5 7.5 0 00-15 0c0 1.327.28 2.6.793 3.737.493 1.074 1.255 2.172 2.15 3.231.779.937 1.636 1.846 2.503 2.713.3.3.6.58.903.84l.054.045a9.72 9.72 0 011.347.819zm.877-2.129l.073-.045A8.216 8.216 0 0115.15 17.5c1.196-1.181 2.302-2.328 3.295-3.38.775-.81.996-1.042.845-1.328a4.5 4.5 0 00-8.991 0c-.15.286.07.518.845 1.328.993 1.052 2.1 2.199 3.295 3.38a8.216 8.216 0 011.66 1.077zM12 9a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6 inline-block mr-2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2} fill="none" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v5l3 3" />
    </svg>
);

const imageUrls = {
    spaceBackground: '/Landing/background.png',
    planetsLarge: '/Landing/background2.jpg',
    spaceDogUfo: '/Landing/spaceObject.png',
    spaceObjects: '/Landing/spaceObject.png',
    starCluster1: '/Landing/star_cluster_1.png',
    meteorite: '/Landing/meteorite.png',
    smallPlanet: '/Landing/small_planet.png',
    spaceship: '/Landing/spaceship.png',
    boardingKennels: '/Landing/pet3.jpg',
    groomingShihTzu: '/Landing/groomingShihTzu.jpg',
    groomingMaltese: '/Landing/boarding.jpg',
    happyPuppies: '/Landing/happyPuppies.jpg',
    kittens: '/Landing/kittens.jpg',
    petTreats: '/Landing/petTreats.jpg',
};

interface ParallaxLayerProps {
    src: string;
    speed: number;
    className?: string;
    alt: string;
    style?: React.CSSProperties;
    objectFit?: React.CSSProperties['objectFit'];
}
const ParallaxLayer = ({ src, speed, className, alt, style, objectFit = 'cover' }: ParallaxLayerProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 50}vh`, `${speed * 50}vh`]);
    return (
        <motion.div
            ref={ref}
            style={{ y, ...style, overflow: 'hidden' }}
            className={`absolute inset-0 w-full h-full z-0 ${className}`}
        >
            <Image src={src} alt={alt} fill style={{ objectFit }} priority={speed > 0.5} />
        </motion.div>
    );
};

interface ContentSectionProps {
    children: React.ReactNode;
    className?: string;
    title: string;
    titleColor: string;
}
const ContentSection = ({ children, className, title, titleColor }: ContentSectionProps) => {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);
    return (
        <section ref={ref} className={`relative py-20 px-8 ${className}`}>
            <div className="container mx-auto">
                <h2 className={`text-5xl font-bold text-center mb-12 ${titleColor} font-heading`}>
                    {title}
                </h2>
                <motion.div style={{ y }}>
                    {children}
                </motion.div>
            </div>
        </section>
    );
};

interface BackgroundSectionProps {
    children: React.ReactNode;
    backgroundImage?: string;
    className?: string;
    speed?: number;
    objectFit?: React.CSSProperties['objectFit'];
}
const BackgroundSection = ({
    children,
    backgroundImage,
    className,
    speed = 0.1,
    objectFit = 'cover',
}: BackgroundSectionProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}px`, `${speed * 100}px`]);
    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            {backgroundImage && (
                <motion.div style={{ y }} className="absolute inset-0 w-full h-full z-0">
                    <Image
                        src={backgroundImage}
                        alt="Section background"
                        fill
                        style={{ objectFit, objectPosition: 'center' }}
                        priority={true}
                    />
                </motion.div>
            )}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

function Footer() {
    return (
        <footer className="w-full bg-gradient-to-t from-black via-purple-950 to-violet-900 text-gray-300 py-8 mt-12">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-center px-8 text-center">
                <div className="mb-4 md:mb-0 text-lg font-bold tracking-wide">
                    Pawspace © {new Date().getFullYear()}
                </div>
                <div className="flex space-x-6">

                </div>
            </div>
        </footer>
    );
}

export default function HomePage() {
    const router = useRouter();
    const speedSlow = 0.05;
    const speedStars = 0.15;
    const speedPlanets = 0.3;
    const speedSpaceship = 0.5;
    const speedFasterElements = 0.7;
    const speedFastest = 0.9;

    const handleExploreClick = () => {
        router.push('/login');
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-purple-950 via-indigo-900 to-black text-white font-sans overflow-hidden">
            {/* Space Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
            <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjEiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjIwIiByPSIxIi8+PGNpcmNsZSBjeD0iODAiIGN5PSIxNSIgcj0iMSIvPjxjaXJjbGUgY3g9IjEyMCIgY3k9IjMwIiByPSIxIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMjUiIHI9IjEiLz48Y2lyY2xlIGN4PSIxODAiIGN5PSI0MCIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>

            {/* GLOBAL PARALLAX LAYERS */}
            <ParallaxLayer src={imageUrls.spaceBackground} speed={speedSlow} alt="Deep space background" className="opacity-70" objectFit="cover" />
            <ParallaxLayer src={imageUrls.spaceBackground} speed={speedStars} alt="More stars" className="opacity-50 scale-110" objectFit="cover" />
            <ParallaxLayer src={imageUrls.planetsLarge} speed={speedPlanets} alt="Large planets" className="opacity-80" objectFit="cover" />
            <ParallaxLayer src={imageUrls.spaceObjects} speed={speedSpaceship} alt="Space objects" className="opacity-70" objectFit="cover" />
            <ParallaxLayer src={imageUrls.spaceDogUfo} speed={speedFasterElements} alt="Space dog in UFO" className="opacity-90 scale-75" style={{ left: "70%", top: "15%", width: "auto", height: "auto" }} objectFit="contain" />
            <ParallaxLayer src={imageUrls.smallPlanet} speed={speedFastest} alt="Small planet" className="opacity-80 scale-50" style={{ left: "10%", top: "40%", width: "auto", height: "auto" }} objectFit="contain" />
            <ParallaxLayer src={imageUrls.starCluster1} speed={speedSpaceship} alt="Star cluster" className="opacity-60 scale-125" style={{ right: "5%", top: "60%", width: "auto", height: "auto" }} objectFit="contain" />
            <ParallaxLayer src={imageUrls.meteorite} speed={speedFasterElements + 0.1} alt="Meteorite" className="opacity-70 scale-40" style={{ left: "20%", top: "80%", width: "auto", height: "auto" }} objectFit="contain" />
            <ParallaxLayer src={imageUrls.spaceship} speed={speedFastest + 0.2} alt="Spaceship" className="opacity-90 scale-30" style={{ right: "15%", top: "25%", width: "auto", height: "auto" }} objectFit="contain" />

            {/* Main Content */}
            <div className="relative z-10">
                {/* Hero Section */}
                <section className="min-h-screen flex flex-col items-center justify-center text-center p-4 sm:p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl border border-indigo-500/20"
                    >
                        <div className="flex justify-center mb-6">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Image
                                    src="/Landing/logo.png"
                                    alt="Pawspace Logo"
                                    width={200}
                                    height={200}
                                    className="rounded-full shadow-lg"
                                    priority
                                />
                            </motion.div>
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-heading"
                        >
                            Pawspace
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="text-lg sm:text-xl md:text-2xl mb-6 text-gray-200 font-body"
                        >
                            Your best friend's new best friend!
                        </motion.p>
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            onClick={handleExploreClick}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                        >
                            Explore Our Services
                        </motion.button>

                        {/* Contact Info Cards */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 1 }}
                                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-indigo-500/20"
                            >
                                <div className="flex items-start">
                                    <LocationIcon />
                                    <div className="ml-3 text-left">
                                        <div className="font-semibold text-lg text-white">Our Location</div>
                                        <div className="text-gray-300 text-sm">
                                            2nd Floor, AMJB Building,<br />
                                            Aguinaldo Highway, Palico 4,<br />
                                            Imus, Philippines
                                            <a
                                                href="https://maps.google.com/?q=AMJB+Building,+Aguinaldo+Highway,+Palico+4,+Imus,+Philippines"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block mt-2 text-purple-400 hover:text-purple-300 transition"
                                            >
                                                View on Google Maps
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 1.2 }}
                                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-indigo-500/20"
                            >
                                <div className="flex items-start">
                                    <ClockIcon />
                                    <div className="ml-3 text-left">
                                        <div className="font-semibold text-lg text-white">Working Hours</div>
                                        <div className="text-gray-300 text-sm">
                                            Check-in/Check-out:
                                            <span className="block mt-1 text-yellow-200 font-medium">
                                                9 AM - 7 PM
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className="w-full bg-gradient-to-t from-black via-purple-950 to-violet-900 text-gray-300 py-8 mt-12">
                    <div className="container mx-auto flex flex-col md:flex-row items-center justify-center px-8 text-center">
                        <div className="mb-4 md:mb-0 text-lg font-bold tracking-wide">
                            Pawspace © {new Date().getFullYear()}
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}