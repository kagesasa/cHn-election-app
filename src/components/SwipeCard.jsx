import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function SwipeCard({ data, onSwipe, custom }) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Background color based on swipe direction
    const bg = useTransform(x, [-200, 0, 200], ["#ef4444", "#ffffff", "#22c55e"]);

    const handleDragEnd = (event, info) => {
        if (info.offset.x > 100) {
            onSwipe(true);
        } else if (info.offset.x < -100) {
            onSwipe(false);
        }
    };

    const variants = {
        enter: { scale: 0.5, opacity: 0 },
        center: { x: 0, rotate: 0, opacity: 1, scale: 1 },
        exit: (custom) => ({
            x: custom * 500,
            opacity: 0,
            scale: 0.5,
            rotate: custom * 20,
            transition: { duration: 0.2 }
        })
    };

    return (
        <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={custom}
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
        >
            <motion.div
                className={`relative w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden border-4 ${data.color.replace('bg-', 'border-')}`}
            >
                <div className={`h-32 ${data.color} flex items-center justify-center`}>
                    <span className="text-white text-xl font-bold tracking-wider">
                        {data.category}
                    </span>
                </div>

                <div className="p-8 flex flex-col items-center text-center h-80 justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 leading-snug">
                        {data.question}
                    </h2>

                    <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl">
                        {data.detail}
                    </p>

                    <div className="flex w-full justify-between px-4 pt-4 text-gray-400 text-sm font-medium">
                        <div
                            className="flex items-center gap-1 cursor-pointer hover:text-red-500 transition-colors"
                            onClick={(e) => { e.stopPropagation(); onSwipe(false); }}
                        >
                            <div className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded text-xs text-gray-500 mr-1">←</div>
                            <X size={20} /> 望まない
                        </div>
                        <div
                            className="flex items-center gap-1 cursor-pointer hover:text-green-500 transition-colors"
                            onClick={(e) => { e.stopPropagation(); onSwipe(true); }}
                        >
                            望む <Check size={20} />
                            <div className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded text-xs text-gray-500 ml-1">→</div>
                        </div>
                    </div>
                </div>

                {/* Overlay indicators */}
                <motion.div
                    style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
                    variants={{
                        exit: (custom) => ({
                            opacity: custom === 1 ? 1 : 0
                        })
                    }}
                    className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold transform rotate-12 border-2 border-white shadow-lg"
                >
                    望む
                </motion.div>
                <motion.div
                    style={{ opacity: useTransform(x, [0, -100], [0, 1]) }}
                    variants={{
                        exit: (custom) => ({
                            opacity: custom === -1 ? 1 : 0
                        })
                    }}
                    className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold transform -rotate-12 border-2 border-white shadow-lg"
                >
                    望まない
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
