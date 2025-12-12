import React from 'react';
import { motion } from 'framer-motion';
import mascotPoint from '../assets/mascot_point.png';

export default function WelcomeScreen({ onStart }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-brand-bg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-md w-full"
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    あなたの声を届けよう
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    みんなで考える、<br />町田市の未来
                </p>

                <motion.img
                    src={mascotPoint}
                    alt="Mascot Pointing"
                    className="w-48 h-48 mx-auto mb-8 object-contain"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onStart}
                    className="w-full bg-brand-orange text-white text-xl font-bold py-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
                >
                    スタート
                </motion.button>
            </motion.div>
        </div>
    );
}
