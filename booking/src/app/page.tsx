"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

const imageUrls = {
  spaceBackground: '/images/7c9bebe724e704732303f857882672e3.jpg',
  planetsLarge: '/images/ea9908482774e2b0e4f05d9d77cf3e5f.jpg',
  spaceDogUfo: '/images/08b6d911e7d83d13d8612c613558632d.jpg',
  spaceObjects: '/images/37de1bc3e4f7a53b7d2bc5e1cc8a067a.jpg',
  boardingKennels: '/images/469850477_122217382610026382_826719596565059543_n.jpg',
  groomingShihTzu: '/images/469578711_122216954750026382_6352057456154621157_n.jpg',
  groomingMaltese: '/images/469584129_122216960126026382_6149429658583997875_n.jpg',
  happyPuppies: '/images/470208682_122218074698026382_2282919584401485769_n.jpg',
  kittens: '/images/469893336_122217365450026382_2282739295369555943_n.jpg',
  petTreats: '/images/469561166_122217367790026382_2642385876666135218_n.jpg',
};

interface ParallaxLayerProps {
  src: string;
  speed: number;
  className?: string;
  alt: string;
  style?: React.CSSProperties;
}

const ParallaxLayer = ({ src, speed, className, alt, style }: ParallaxLayerProps) => {
  const ref = useRef<HTMLDivElement>(null);
   const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 50}vh`, `${speed * 50}vh`]);

  return (
    <motion.div
      ref={ref}
      style={{ y, ...style }}
      className={`absolute inset-0 w-full h-full object-cover z-0 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: 'cover' }}
        priority={speed > 0.5}
      />
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


export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleGoogleSignIn = () => {
    console.log("Initiating Google Sign-In...");
  };

  const speedSlow = 0.05;
  const speedStars = 0.15;
  const speedPlanets = 0.3;
  const speedSpaceship = 0.5;
  const speedFasterElements = 0.7;
  const speedFastest = 0.9;


  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-purple-900 to-black text-white font-sans">

      <ParallaxLayer src={imageUrls.spaceBackground} speed={speedSlow} alt="Deep space background with stars and nebulae" className="opacity-70" />

       <ParallaxLayer src={imageUrls.spaceBackground} speed={speedStars} alt="More stars" className="opacity-50 scale-110" />

      <ParallaxLayer src={imageUrls.planetsLarge} speed={speedPlanets} alt="Large planets" className="opacity-80 object-cover object-center" />

      <ParallaxLayer src={imageUrls.spaceObjects} speed={speedSpaceship} alt="Space objects like moons" className="opacity-70 object-cover object-bottom" />

      <ParallaxLayer
        src={imageUrls.spaceDogUfo}
        speed={speedFasterElements}
        alt="Cartoon space dog in UFO"
        className="object-contain !object-top opacity-90 scale-75"
        style={{ left: '70%', top: '15%' }}
      />

      <ParallaxLayer
        src={imageUrls.spaceObjects}
        speed={speedFastest}
        alt="Floating moon or planet"
        className="object-contain opacity-80 scale-50"
        style={{ left: '10%', top: '40%' }}
      />

       <ParallaxLayer
        src={imageUrls.spaceBackground}
        speed={speedSpaceship}
        alt="Floating star cluster"
        className="object-cover opacity-60 scale-125"
        style={{ right: '5%', top: '60%' }}
      />

       <ParallaxLayer
        src={imageUrls.planetsLarge}
        speed={speedFasterElements}
        alt="Another floating planet"
        className="object-contain opacity-70 scale-40"
        style={{ left: '20%', top: '80%' }}
      />


      <div className="relative z-10">

        <section className="relative h-screen flex items-center justify-center text-center p-8">
          <motion.div
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.5 }}
             className="bg-black bg-opacity-60 rounded-lg p-8 max-w-2xl shadow-xl"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-4 text-purple-300 font-heading">
              Pawspace
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 font-body">
              Where Every Pet&apos;s Adventure Begins in Space!
            </p>
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
              Explore Our Services
            </button>
          </motion.div>
        </section>

        <ContentSection
            className="bg-opacity-0"
            title="Explore Our Universe of Services"
            titleColor="text-teal-300"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gray-800 rounded-lg p-8 shadow-xl hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-2">
                <h3 className="text-3xl font-bold mb-4 text-yellow-400 font-heading">Cosmic Pet Hotel</h3>
                <motion.div style={{ y: useTransform(useScroll({ target: null, offset: ["start end", "end start"] }).scrollYProgress, [0, 1], [-30, 30]) }}>
                    <Image
                      src={imageUrls.boardingKennels}
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

              <div className="bg-gray-800 rounded-lg p-8 shadow-xl hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-2">
                <h3 className="text-3xl font-bold mb-4 text-yellow-400 font-heading">Galactic Grooming Salon</h3>
                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <motion.div style={{ y: useTransform(useScroll({ target: null, offset: ["start end", "end start"] }).scrollYProgress, [0, 1], [-20, 20]) }}>
                      <Image
                        src={imageUrls.groomingShihTzu}
                        alt="Shih Tzu getting groomed"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                    </motion.div>
                    <motion.div style={{ y: useTransform(useScroll({ target: null, offset: ["start end", "end start"] }).scrollYProgress, [0, 1], [-40, 40]) }}>
                      <Image
                        src={imageUrls.groomingMaltese}
                        alt="Maltese getting a bath"
                        width={300}
                        height={200}
                         className="rounded-lg object-cover w-full h-48"
                      />
                    </motion.div>
                 </div>
                <p className="text-gray-300 mb-4 font-body">
                  Pamper your pet with our out-of-this-world grooming services. From moon dust baths to cosmic cuts, we'll have them looking and feeling their best.
                </p>
                 <ul className="list-disc list-inside text-gray-400 font-body">
                  <li>Moon Dust Baths</li>
                  <li>Cosmic Cuts & Styling</li>
                  <li>Pawicures & Nail Trims</li>
                </ul>
              </div>
            </div>
        </ContentSection>

        <ContentSection
            className="bg-opacity-0"
            title="Meet Our Star Guests!"
            titleColor="text-purple-300"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                 className="relative group rounded-lg overflow-hidden shadow-xl"
                 style={{ y: useTransform(useScroll({ target: null, offset: ["start end", "end start"] }).scrollYProgress, [0, 1], [-20, 20]) }}
              >
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
               <motion.div
                 className="relative group rounded-lg overflow-hidden shadow-xl"
                 style={{ y: useTransform(useScroll({ target: null, offset: ["start end", "end start"] }).scrollYProgress, [0, 1], [-40, 40]) }}
              >
                 <Image
                    src={imageUrls.kittens}
                    alt="Two adorable kittens"
                    width={400}
                    height={300}
                    className="object-cover w-full h-64 transition duration-300 ease-in-out group-hover:scale-110"
                  />
                   <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-xl font-bold">New Friends</span>
                   </div>
              </motion.div>
               <motion.div
                 className="relative group rounded-lg overflow-hidden shadow-xl"
                 style={{ y: useTransform(useScroll({ target: null, offset: ["start end", "end start"] }).scrollYProgress, [0, 1], [-10, 10]) }}
              >
                 <Image
                    src={imageUrls.groomingShihTzu}
                    alt="Freshly groomed dog"
                    width={400}
                    height={300}
                    className="object-cover w-full h-64 transition duration-300 ease-in-out group-hover:scale-110"
                  />
                   <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-xl font-bold">Looking Sharp!</span>
                   </div>
              </motion.div>
            </div>
        </ContentSection>

         <ContentSection
            className="bg-opacity-0"
            title="The Pawspace Advantage"
            titleColor="text-yellow-300"
         >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col items-center text-center">
                 <div className="text-5xl mb-4 text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto">
                        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm-3 2.25a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0v-2.25z" clipRule="evenodd" />
                    </svg>
                 </div>
                 <h3 className="text-2xl font-bold mb-3 text-white font-heading">Expert Crew</h3>
                 <p className="text-gray-300 font-body">Our 'Astro-Care' specialists are passionate animal lovers dedicated to your pet's well-being.</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col items-center text-center">
                 <div className="text-5xl mb-4 text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto">
                        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 10.5a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zm6.75-0.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3zm-4.5 3a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zm6.75-0.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3zm-4.5 3a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zm6.75-0.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3zM3 18a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3H6a3 3 0 00-3 3v12zM12 5.25a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                 </div>
                 <h3 className="text-2xl font-bold mb-3 text-white font-heading">Galactic Safety</h3>
                 <p className="text-gray-300 font-body">State-of-the-art security and constant supervision ensure a safe environment.</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col items-center text-center">
                 <div className="text-5xl mb-4 text-pink-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto">
                       <path fillRule="evenodd" d="M12 2.25c-2.403 0-4.817.192-7.22.572C2.416 3.138 1 4.613 1 6.47v2.88c0 1.414.917 2.613 2.203 3.003 1.902.56 3.828.92 5.754 1.082l.16.01c1.177.1 2.364.1 3.54 0a26.45 26.45 0 005.754-1.082C22.083 11.962 23 10.763 23 9.35V6.47c0-1.857-1.416-3.332-3.78-3.648A47.21 47.21 0 0012 2.25zM9 15.75a3 3 0 003 3h.75a.75.75 0 00.75-.75V18a.75.75 0 00-.75-.75H12a1.5 1.5 0 01-1.5-1.5v-.75a.75.75 0 00-.75-.75H9v.75zM16.5 15.75a3 3 0 003 3h.75a.75.75 0 00.75-.75V18a.75.75 0 00-.75-.75H19.5a1.5 1.5 0 01-1.5-1.5v-.75a.75.75 0 00-.75-.75H16.5v.75zM7.5 10.5a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75zM18 10.5a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75zM13.5 10.5a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75z" clipRule="evenodd" />
                    </svg>
                 </div>
                 <h3 className="text-2xl font-bold mb-3 text-white font-heading">Personalized Adventure</h3>
                 <p className="text-gray-300 font-body">Every pet receives tailored care and attention for their unique needs.</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col items-center text-center">
                 <div className="text-5xl mb-4 text-orange-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto">
                        <path d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25a.75.75 0 01.75-.75zM12 6a.75.75 0 01.75.75V8.25a.75.75 0 01-1.5 0V6.75a.75.75 0 01.75-.75zM12 9a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM12 12a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM12 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM12 18a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM12 21a.75.75 0 01.75.75V23a.75.75 0 01-1.5 0v-.75a.75.75 0 01.75-.75z" />
                    </svg>
                 </div>
                 <h3 className="text-2xl font-bold mb-3 text-white font-heading">Cosmic Comforts</h3>
                 <p className="text-gray-300 font-body">Spacious and comfortable suites designed for maximum relaxation.</p>
              </div>
            </div>
         </ContentSection>

        <ContentSection
            className="bg-opacity-0"
            title="Ready to Launch Your Pet's Adventure?"
            titleColor="text-purple-400"
        >
            <p className="text-xl mb-10 text-gray-200 font-body">
              Contact us today to book your pet&apos;s stay or grooming session!
            </p>
            <button
              onClick={openModal}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-10 rounded-full text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Get in Touch
            </button>
        </ContentSection>

        <footer className="relative py-10 px-8 bg-gray-900 text-gray-400 text-center font-body">
          <div className="container mx-auto">
            <p>&copy; 2023 Pawspace. All rights reserved.</p>
          </div>
        </footer>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gradient-to-tr from-gray-800 to-blue-900 rounded-lg p-8 w-full max-w-md mx-4 relative shadow-xl">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-center mb-6 text-purple-400 font-heading">
              Join Pawspace!
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2 font-body">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="shadow appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2 font-body">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="shadow appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter your password"
                />
              </div>
              <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-full w-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg font-body">
                Continue
              </button>
              <div className="text-center text-gray-400 font-body">or</div>
              <button
                onClick={handleGoogleSignIn}
                className="bg-white hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-full w-full flex items-center justify-center shadow-lg font-body"
              >
                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.0003 4.75C14.0253 4.75 15.8253 5.4875 17.2003 6.7375L20.0378 3.9C18.0003 2.0625 15.2378 1 12.0003 1C7.72533 1 3.97533 3.4125 2.07533 7.0375L5.90033 9.9625C6.85033 7.0125 9.21283 4.75 12.0003 4.75Z" fill="#EA4335"/>
                    <path d="M20.5375 10.1H12V14.4H16.4875C16.2 15.9125 15.3125 17.15 14.0125 18.0375L17.85 20.9625C20.05 19.0125 21.375 16.0125 21.375 12.25C21.375 11.5625 21.3125 10.875 20.5375 10.1Z" fill="#4285F4"/>
                    <path d="M5.90025 18.0375C7.08775 18.8875 8.57525 19.375 10.0878 19.375C11.7753 19.375 13.3128 18.8125 14.5378 17.8L10.7003 14.875C9.77525 15.5 8.66275 15.875 7.48775 15.875C6.20025 15.875 5.03775 15.1875 4.10025 14.0625L0.262754 17C2.16275 20.625 5.90025 23 10.0878 23C15.2378 23 19.0003 20.9375 20.9003 17.7625L17.8503 14.8375C16.7878 15.5875 15.5003 16.0125 14.0128 16.0125C12.6003 16.0125 11.3378 15.4875 10.3878 14.5L5.90025 18.0375Z" fill="#FBBC05"/>
                    <path d="M4.10022 14.0625C3.83772 13.375 3.67522 12.6875 3.67522 11.9375C3.67522 11.1875 3.83772 10.5 4.10022 9.8125L4.16272 9.5L0.262724 6.5375C0.100224 7.2125 0.000224219 7.9375 0.000224219 8.6875C0.000224219 10.0625 0.337724 11.3875 0.987724 12.5625L4.10022 14.0625Z" fill="#00995D"/>
                 </svg>
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
