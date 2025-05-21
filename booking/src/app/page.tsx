"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

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
  spaceBackground: '/Landing/background.jpg',
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
          Pawspace &copy; {new Date().getFullYear()}
        </div>
        <div className="flex space-x-6">
          
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const speedSlow = 0.05;
  const speedStars = 0.15;
  const speedPlanets = 0.3;
  const speedSpaceship = 0.5;
  const speedFasterElements = 0.7;
  const speedFastest = 0.9;
  const { scrollYProgress } = useScroll();
  const y30 = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const y20 = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const y40 = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const y10 = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  return (
    <div className="relative bg-gradient-to-b from-purple-900 via-purple-900 to-black text-white font-sans overflow-hidden">
      {/* GLOBAL PARALLAX LAYERS */}
      <ParallaxLayer src={imageUrls.spaceBackground} speed={speedSlow} alt="Deep space background with stars and nebulae" className="opacity-70" objectFit="cover" />
      <ParallaxLayer src={imageUrls.spaceBackground} speed={speedStars} alt="More stars" className="opacity-50 scale-110" objectFit="cover" />
      <ParallaxLayer src={imageUrls.planetsLarge} speed={speedPlanets} alt="Large planets" className="opacity-80 object-cover object-center" objectFit="cover" />
      <ParallaxLayer src={imageUrls.spaceObjects} speed={speedSpaceship} alt="Space objects like moons" className="opacity-70 object-cover object-bottom" objectFit="cover" />
      <ParallaxLayer src={imageUrls.spaceDogUfo} speed={speedFasterElements} alt="Cartoon space dog in UFO" className="opacity-90 scale-75" style={{ left: "70%", top: "15%", width: "auto", height: "auto" }} objectFit="contain" />
      <ParallaxLayer src={imageUrls.smallPlanet} speed={speedFastest} alt="Small floating planet" className="opacity-80 scale-50" style={{ left: "10%", top: "40%", width: "auto", height: "auto" }} objectFit="contain" />
      <ParallaxLayer src={imageUrls.starCluster1} speed={speedSpaceship} alt="Floating star cluster" className="opacity-60 scale-125" style={{ right: "5%", top: "60%", width: "auto", height: "auto" }} objectFit="contain" />
      <ParallaxLayer src={imageUrls.meteorite} speed={speedFasterElements + 0.1} alt="Meteorite" className="opacity-70 scale-40" style={{ left: "20%", top: "80%", width: "auto", height: "auto" }} objectFit="contain" />
      <ParallaxLayer src={imageUrls.spaceship} speed={speedFastest + 0.2} alt="Small spaceship" className="opacity-90 scale-30" style={{ right: "15%", top: "25%", width: "auto", height: "auto" }} objectFit="contain" />

      {/* Main Content Sections */}
      <div className="relative z-10 bg-gradient-to-b from-violet-950 to-black">

        {/* Hero Section */}
        <BackgroundSection backgroundImage={imageUrls.spaceBackground} speed={0.05} className="min-h-screen">
          <section className="relative h-screen flex flex-col items-center justify-center text-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-opacity-60 rounded-lg p-8 max-w-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.4)]"
            >
              <div className="flex justify-center">
                <Image
                  src="/Landing/logo.png"
                  alt="Pawspace Logo"
                  width={200}
                  height={200}
                  className="rounded-full"
                  priority
                />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-4 text-purple-300 font-heading">
                Pawspace
              </h1>
              <p className="text-xl md:text-2xl mb-2 text-gray-200 font-body">
                Your best friend's new best friend!
              </p>
              <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg mb-8">
                Explore Our Services
              </button>
              
              {/* Address and Working Hours - Modern Card Layout with Google Maps link */}
              <div className="mt-4 flex flex-col sm:flex-row justify-center items-stretch gap-6 max-w-2xl mx-auto">
                {/* Location */}
                <div className="flex-1 flex items-center bg-gray-900 bg-opacity-70 rounded-lg p-4 shadow-md">
                  <LocationIcon />
                  <div className="ml-4 text-left">
                    <div className="font-semibold text-lg text-white">Our Location</div>
                    <div className="text-gray-300 text-sm">
                      2nd Floor, AMJB Building, Aguinaldo Highway,<br />
                      Palico 4, Imus, Philippines<br />
                      <a
                        href="https://maps.google.com/?q=AMJB+Building,+Aguinaldo+Highway,+Palico+4,+Imus,+Philippines"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-pink-300 hover:text-pink-400 transition"
                      >
                        View on Google Maps
                      </a>
                    </div>
                  </div>
                </div>
                {/* Divider for desktop */}
                <div className="hidden sm:block w-px bg-gray-700 mx-2" />
                {/* Working Hours */}
                <div className="flex-1 flex items-center bg-gray-900 bg-opacity-70 rounded-lg p-4 shadow-md">
                  <ClockIcon />
                  <div className="ml-4 text-left">
                    <div className="font-semibold text-lg text-white">Working Hours</div>
                    <div className="text-gray-300 text-sm">
                      Check-in/Check-out: 
                    </div>
                    <span className="font-medium text-yellow-200">9 AM - 7 PM</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        </BackgroundSection>

        {/* Services Section */}
        <ContentSection className="bg-opacity-0" title="Explore Our Universe of Services" titleColor="text-teal-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-opacity-60 rounded-lg p-8 max-w-2xl shadow-[0_25px_80px_-10px_rgba(0,0,0,0.8)] hover:shadow-2x transition duration-300 ease-in-out transform hover:-translate-y-2">
              <h3 className="text-3xl font-bold mb-12 text-yellow-400 font-heading">Cosmic Pet Hotel</h3>
              <motion.div style={{ y: y30 }}>
                <Image
                  src={imageUrls.groomingMaltese}
                  alt="Pet boarding kennels"
                  width={600}
                  height={400}
                  className="rounded-lg mb-6 object-cover w-full h-64"
                />
              </motion.div>
              <p className="text-gray-300 mb-4 font-body">
                Give your pet a stellar vacation in our state-of-the-art cosmic suites. Supervised playtime, climate-controlled comfort, and 24/7 monitoring ensure a safe and fun stay.
              </p>
              <ul className="list-disc list-inside text-gray-400 font-body">
                <li>Starship Suites</li>
                <li>Zero-Gravity Playzone</li>
                <li>Personalized Care</li>
              </ul>
            </div>
            <div className="bg-opacity-60 rounded-lg p-8 max-w-2xl shadow-[0_25px_80px_-10px_rgba(0,0,0,0.8)] hover:shadow-2x transition duration-300 ease-in-out transform hover:-translate-y-2">
              <h3 className="text-3xl font-bold mb-12 text-yellow-400 font-heading">Galactic Grooming Salon</h3>
              <motion.div style={{ y: y30 }}>
                <Image
                  src={imageUrls.groomingShihTzu}
                  alt="Shih Tzu getting groomed"
                  width={600}
                  height={400}
                  className="rounded-lg mb-6 object-cover w-full h-64 object-right-top" 
                />
              </motion.div>
              <p className="text-gray-300 mb-4 font-body">
                Pamper your pet with our out-of-this-world grooming services. From moon dust baths to cosmic cuts, we'll have them looking and feeling their best.
              </p>
              <ul className="list-disc list-inside text-gray-400 font-body">
                <li>Moon Dust Baths</li>
                <li>Cosmic Cuts & Styling</li>
                <li>Pawicures & Nail Trims</li>
              </ul>
            </div>
            <div className="bg-opacity-60 rounded-lg p-8 max-w-2xl shadow-[0_25px_80px_-10px_rgba(0,0,0,0.8)] hover:shadow-2x transition duration-300 ease-in-out transform hover:-translate-y-2">
              <h3 className="text-3xl font-bold mb-12 text-yellow-400 font-heading">Interstellar Pet Treats</h3>
              <motion.div style={{ y: y10 }}> 
                <Image
                  src={imageUrls.petTreats} 
                  alt="Assortment of pet treats"
                  width={600}
                  height={400}
                  className="rounded-lg mb-6 object-cover w-full h-64"
                />
              </motion.div>
              <p className="text-gray-300 mb-4 font-body">
                Reward your loyal companion with our galaxy's finest, wholesome treats. Crafted with natural ingredients, perfect for training or just a delicious snack.
              </p>
              <ul className="list-disc list-inside text-gray-400 font-body">
                <li>Nutrient-Rich Bites</li>
                <li>Hypoallergenic Options</li>
                <li>Dental Chews</li>
              </ul>
            </div>
          </div>
        </ContentSection>

        {/* Gallery Section */}
        <ContentSection className="bg-opacity-0" title="Meet Our Star Guests!" titleColor="text-purple-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div className="relative group rounded-lg overflow-hidden shadow-xl" style={{ y: y20 }}>
              <Image
                src={imageUrls.happyPuppies}
                alt="Happy puppies playing"
                width={400}
                height={300}
                className="object-cover w-full h-64 transition duration-300 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xl font-bold">Playtime!</span>
              </div>
            </motion.div>
            <motion.div className="relative group rounded-lg overflow-hidden shadow-xl" style={{ y: y40 }}>
              <Image
                src={imageUrls.kittens}
                alt="Two adorable kittens"
                width={400}
                height={300}
                className="object-top w-full h-64 transition duration-300 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xl font-bold">New Friends</span>
              </div>
            </motion.div>
            <motion.div className="relative group rounded-lg overflow-hidden shadow-xl" style={{ y: y10 }}>
              <Image
                src={imageUrls.boardingKennels}
                alt="Freshly groomed dog"
                width={400}
                height={300}
                className="object-center w-full h-64 transition duration-300 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xl font-bold">Looking Sharp!</span>
              </div>
            </motion.div>
          </div>
        </ContentSection>

        {/* Advantage Section */}
        <ContentSection className="bg-opacity-0" title="The Pawspace Advantage" titleColor="text-yellow-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col items-center text-center">
              <div className="text-5xl mb-4 text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm-3 2.25a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0v-2.25z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white font-heading">Expert Crew</h3>
              <p className="text-gray-300 font-body">Our 'Astro-Care' team is trained for every pet emergency and adventure.</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col items-center text-center">
              <div className="text-5xl mb-4 text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12 mx-auto">
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white font-heading">24/7 Monitoring</h3>
              <p className="text-gray-300 font-body">Your pet is watched around the clock with love and advanced tech.</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col items-center text-center">
              <div className="text-5xl mb-4 text-pink-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12 mx-auto">
                  <path d="M17.657 6.343a8 8 0 11-11.314 0 8 8 0 0111.314 0zm-1.414 1.414a6 6 0 10-8.486 0 6 6 0 008.486 0z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white font-heading">Space-Age Facilities</h3>
              <p className="text-gray-300 font-body">Our pet hotel and salon are equipped with the latest amenities for comfort and fun.</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col items-center text-center">
              <div className="text-5xl mb-4 text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12 mx-auto">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white font-heading">Happy Tails Guarantee</h3>
              <p className="text-gray-300 font-body">We promise your pet will return home with a wag and a smile!</p>
            </div>
          </div>
        </ContentSection>

        {/* Contact Us Section */}
        <ContentSection className="bg-opacity-0" title="Contact Us" titleColor="text-pink-300">
          {/* Social Media Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <a
              href="https://www.facebook.com/pawspaceph"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.676 0h-21.352c-.729 0-1.324.595-1.324 1.324v21.352c0 .729.595 1.324 1.324 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12v9.294h6.116c.729 0 1.324-.595 1.324-1.324v-21.352c0-.729-.595-1.324-1.324-1.324z"/>
              </svg>
              Facebook
            </a>
            <a
              href="https://www.instagram.com/pawspaceph"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white rounded-full font-semibold transition"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.342 3.608 1.317.975.975 1.255 2.242 1.317 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.342 2.633-1.317 3.608-.975.975-2.242 1.255-3.608 1.317-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.342-3.608-1.317-.975-.975-1.255-2.242-1.317-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.342-2.633 1.317-3.608.975-.975 2.242-1.255 3.608-1.317 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.012-4.947.072-1.276.059-2.675.334-3.637 1.297-.962.962-1.238 2.361-1.297 3.637-.06 1.28-.072 1.688-.072 4.947s.012 3.667.072 4.947c.059 1.276.334 2.675 1.297 3.637.962.962 2.361 1.238 3.637 1.297 1.28.06 1.688.072 4.947.072s3.667-.012 4.947-.072c1.276-.059 2.675-.334 3.637-1.297.962-.962 1.238-2.361 1.297-3.637.06-1.28.072-1.688.072-4.947s-.012-3.667-.072-4.947c-.059-1.276-.334-2.675-1.297-3.637-.962-.962-2.361-1.238-3.637-1.297-1.28-.06-1.688-.072-4.947-.072z"/>
                <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z"/>
              </svg>
              Instagram
            </a>
          </div>
          <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Email */}
            <div className="flex items-start bg-gray-900 bg-opacity-70 rounded-lg p-6 shadow-md">
              <span className="mt-1"><MailIcon /></span>
              <div className="ml-4">
                <div className="font-semibold text-lg text-white">Email</div>
                <a href="mailto:pawspaceph@gmail.com" className="text-gray-300 text-sm hover:text-pink-400 transition">
                  pawspaceph@gmail.com
                </a>
              </div>
            </div>
            {/* Phone */}
            <div className="flex items-start bg-gray-900 bg-opacity-70 rounded-lg p-6 shadow-md">
              <span className="mt-1"><PhoneIcon /></span>
              <div className="ml-4">
                <div className="font-semibold text-lg text-white">Phone</div>
                <a href="tel:+639171234567" className="text-gray-300 text-sm hover:text-pink-400 transition">
                  +63 917 123 4567
                </a>
              </div>
            </div>
            
          </div>
        </ContentSection>

        <Footer />
      </div>
    </div>
  );
}