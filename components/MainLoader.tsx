"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    GiAncientRuins, 
    GiTimeBomb, 
    GiPocketWatch 
} from 'react-icons/gi';

const colors = ['purple', 'blue', 'green', 'yellow'];

const getColorClass = (color: string) => {
    switch (color) {
        case 'purple': return 'text-purple-300';
        case 'blue': return 'text-blue-300';
        case 'green': return 'text-green-300';
        case 'yellow': return 'text-yellow-300';
        default: return 'text-gray-400';
    }
};

const getColorValue = (color: string) => {
    switch (color) {
        case 'purple': return '#D8B4FE';
        case 'blue': return '#BFDBFE';
        case 'green': return '#6EE7B7';
        case 'yellow': return '#FDE68A';
        default: return '#E5E7EB';
    }
};

const HourglassIcon = ({ color }: { color: string }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className={`w-full h-full iconify iconify--emojione-monotone`} preserveAspectRatio="xMidYMid meet">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <path d="M52.303 8.563C53.24 8.563 54 7.74 54 6.729V3.833C54 2.82 53.24 2 52.303 2H11.697C10.759 2 10 2.82 10 3.833v2.896c0 1.011.759 1.833 1.697 1.833h1.053v46.875h-1.053c-.938 0-1.697.82-1.697 1.833v2.895c0 1.013.759 1.835 1.697 1.835h40.605C53.24 62 54 61.178 54 60.165V57.27c0-1.013-.76-1.833-1.697-1.833H51.25V8.563h1.053m-37.72 46.875V8.563h1.724c-.445 0-.807.335-.807.749v2.25c0 .414.358.747.802.75v.001c0 8.289 1.328 16.344 10.932 19.12l.474.15c.415.132.912.288 1.166.417c-.254.127-.745.283-1.158.413l-.453.145c-9.632 2.786-10.96 10.841-10.96 19.13v.001c-.443.003-.802.336-.802.748v2.25c0 .414.361.751.807.751h-1.725m21.163-21.233l.494.156c6.806 1.968 9.463 6.445 9.617 16.389H32.816c-.131-4.624-.459-16.433-.459-18.75c0-.785 1.452-1.886 2.12-2.279c2.819-1.665 6.445-4.959 6.445-8.387H23.076c0 3.428 3.626 6.722 6.445 8.387c.666.394 2.12 1.494 2.12 2.279c0 2.378-.327 14.138-.458 18.75h-13.04c.153-9.941 2.813-14.42 9.645-16.397l.469-.147c1.313-.414 2.553-.806 2.553-2.205c0-1.401-1.244-1.794-2.563-2.208l-.488-.155c-6.805-1.968-9.462-6.444-9.615-16.387h27.715c-.154 9.943-2.813 14.422-9.643 16.396l-.457.145c-1.32.414-2.567.807-2.567 2.209c-.002 1.398 1.24 1.79 2.554 2.204m13.67 21.233h-1.722c.444 0 .806-.337.806-.751v-2.25c0-.413-.36-.746-.803-.748v-.001c0-8.29-1.328-16.346-10.932-19.122l-.48-.152c-.412-.13-.905-.286-1.159-.413c.255-.129.753-.285 1.169-.417l.443-.141c9.631-2.784 10.959-10.84 10.959-19.13v-.001c.442-.002.803-.335.803-.75v-2.25c0-.414-.361-.749-.806-.749h1.722v46.875" fill={getColorValue(color)}></path>
        </g>
    </svg>
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
