import React from 'react';
import ServiceSection from "../ServiceSection";
import { serviceDetailsMap } from "../data/serviceData";
import { OvernightServicesSectionProps } from "../types/serviceTypes";
import { FaDog, FaCat, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const OvernightServicesSection: React.FC<OvernightServicesSectionProps> = ({ setSelectedService }) => {
    const overnightServicesData = Object.entries(serviceDetailsMap)
        .filter(([, details]) => details.type === "overnight")
        .map(([key, details]) => {
            const serviceLabel = details.title;
            const serviceTextSizeClass = "text-3xl md:text-4xl lg:text-5xl font-extrabold";

            const iconColorClass = details.title === "Dog" ? "text-orange-300" : "text-pink-300";
            const orbitingStarColorClass = details.title === "Dog" ? "text-orange-200" : "text-pink-200";

            return {
                label: serviceLabel,
                icon: (
                    <div className="relative flex items-center justify-center h-full w-full overflow-hidden">
                        <motion.div
                            className="relative text-orange-200 text-8xl md:text-9xl lg:text-[10rem] z-0"
                            animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, ease: "easeOut", repeat: Infinity }}
                        >
                            <FaStar />
                        </motion.div>

                        {details.title === "Dog" ? (
                            <FaDog className="absolute text-orange-800 z-10 text-7xl md:text-8xl lg:text-9xl" />
                        ) : (
                            <FaCat className="absolute text-pink-800 z-10 text-5xl md:text-8xl lg:text-9xl" />
                        )}

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
                bgColor: details.title === "Dog" ? "bg-orange-500" : "bg-pink-500",
                onClick: () => setSelectedService(key),
                textSizeClass: serviceTextSizeClass
            };
        });

    return (
        <div className="mx-4">
            <ServiceSection
                title="Boarding Services"
                services={overnightServicesData}
                columns={2}
            />
        </div>
    );
};

export default OvernightServicesSection;