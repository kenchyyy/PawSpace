import React from 'react';
import ServiceSection from "../ServiceSection";
import { serviceDetailsMap } from "../data/serviceData";
import { GroomingServicesSectionProps } from "../types/serviceTypes";
import { FaDog, FaCat, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const GroomingServicesSection: React.FC<GroomingServicesSectionProps> = ({ setSelectedService }) => {
    const groomingServicesData = Object.entries(serviceDetailsMap)
        .filter(([, details]) => details.type === "grooming")
        .map(([key, details]) => {
            const serviceLabel = details.title;
            const serviceTextSizeClass = "text-3xl md:text-4xl lg:text-5xl font-extrabold";

            let bgColorClass = "";
            let iconColorClass = "";
            let orbitingStarColorClass = "";

            if (details.title === "Basic") {
                bgColorClass = "bg-orange-500";
                iconColorClass = "text-orange-300";
                orbitingStarColorClass = "text-orange-200";
            } else if (details.title === "Deluxe") {
                bgColorClass = "bg-lime-500";
                iconColorClass = "text-lime-300";
                orbitingStarColorClass = "text-lime-200";
            } else { // Platinum
                bgColorClass = "bg-pink-500";
                iconColorClass = "text-pink-300";
                orbitingStarColorClass = "text-pink-200";
            }

            return {
                label: serviceLabel,
                icon: (
                    <div className="relative flex items-center justify-center h-full w-full overflow-hidden">
                        {details.title === "Basic" || details.title === "Deluxe" ? (
                            <span className={`absolute z-0 text-[18rem] md:text-[20rem] lg:text-[22rem] ${iconColorClass}`}>
                                🐶
                            </span>
                        ) : (
                            <span className={`absolute z-0 text-[18rem] md:text-[20rem] lg:text-[22rem] ${iconColorClass}`}>
                                🐱
                            </span>
                        )}

                        <span className={`absolute z-20 text-white text-shadow-lg text-center ${serviceTextSizeClass}`}>
                            {serviceLabel}
                        </span>

                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className={`absolute text-lg md:text-xl lg:text-2xl ${orbitingStarColorClass}`}
                                initial={{ x: 0, y: 0, rotate: 0, opacity: 0.4 }}
                                animate={{
                                    x: [0, 50, 0, -50, 0],
                                    y: [0, -30, 0, 30, 0],
                                    rotate: [0, 90, 180, 270, 360],
                                    opacity: [0.4, 0.7, 0.4, 0.7, 0.4]
                                }}
                                transition={{
                                    duration: 10 + i * 2,
                                    ease: "linear",
                                    repeat: Infinity,
                                    delay: i * 2
                                }}
                                style={{
                                    top: `${10 + i * 20}%`,
                                    left: `${10 + i * 20}%`,
                                }}
                            >
                                <FaStar />
                            </motion.div>
                        ))}
                    </div>
                ),
                bgColor: bgColorClass,
                glow: details.title === "Deluxe",
                onClick: () => setSelectedService(key),
                textSizeClass: serviceTextSizeClass
            };
        });

    return (
        <div className="mx-4">
            <ServiceSection
                title='Grooming Services'
                services={groomingServicesData}
                columns={3}
            />
        </div>
    );
};

export default GroomingServicesSection;