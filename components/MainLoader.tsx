"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    GiHourglass, 
    GiAncientRuins, 
    GiTimeBomb, 
    GiPocketWatch 
} from 'react-icons/gi';

const colors = ['amber', 'bronze', 'gold', 'silver'];

const getColorClass = (color: string) => {
    switch (color) {
        case 'amber': return 'text-amber-500';
        case 'bronze': return 'text-orange-600';
        case 'gold': return 'text-yellow-500';
        case 'silver': return 'text-gray-400';
        default: return 'text-gray-500';
    }
};

const HourglassIcon = ({ color }: { color: string }) => (
    <GiHourglass className={`w-full h-full ${getColorClass(color)}`} />
);

const RuinsIcon = ({ color }: { color: string }) => (
    <GiAncientRuins className={`w-full h-full ${getColorClass(color)}`} />
);

const TimeBombIcon = ({ color }: { color: string }) => (
    <GiTimeBomb className={`w-full h-full ${getColorClass(color)}`} />
);

const PocketWatchIcon = ({ color }: { color: string }) => (
    <GiPocketWatch className={`w-full h-full ${getColorClass(color)}`} />
);

const MainLoader = ({ isLoading }: { isLoading: boolean }) => {
    const [shape, setShape] = useState<'hourglass' | 'ruins' | 'bomb' | 'watch'>('hourglass');

    useEffect(() => {
        const interval = setInterval(() => {
            setShape((prevShape) => {
                if (prevShape === 'hourglass') return 'ruins';
                if (prevShape === 'ruins') return 'bomb';
                if (prevShape === 'bomb') return 'watch';
                return 'hourglass';
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const containerVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    const itemVariants = {
        animate: () => ({
            rotate: -360,
            scale: [1, 1.5, 1],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                scale: {
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                    times: [0, 0.5, 1]
                }
            }
        })
    };

    const loaderItems = colors.map((color, index) => (
        <motion.div
            key={color}
            className="absolute w-10 h-10"
            style={{
                left: `${Math.cos(index * Math.PI / 2) * 40 + 40}px`,
                top: `${Math.sin(index * Math.PI / 2) * 40 + 40}px`,
            }}
            variants={itemVariants}
            custom={index}
        >
            {shape === 'hourglass' && <HourglassIcon color={color} />}
            {shape === 'ruins' && <RuinsIcon color={color} />}
            {shape === 'bomb' && <TimeBombIcon color={color} />}
            {shape === 'watch' && <PocketWatchIcon color={color} />}
        </motion.div>
    ));

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm"
                >
                    <motion.div
                        className="relative w-32 h-32"
                        variants={containerVariants}
                        animate="animate"
                    >
                        {loaderItems}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MainLoader;
