import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export const Preloader = () => {
    const [progress, setProgress] = useState(0);
    const { isLoading } = useAppStore();

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 99) {
                    clearInterval(progressInterval);
                    return 99;
                }
                return prev + 2;
            });
        }, 50);

        return () => {
            clearInterval(progressInterval);
        };
    }, []);

    // When loading completes, finish the progress
    useEffect(() => {
        if (!isLoading && progress < 100) {
            setProgress(100);
        }
    }, [isLoading, progress]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                transition: { duration: 1 }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
        >
            <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)'
                }}
            />

            <div className="relative z-10 flex flex-col items-center gap-12">

                <div className="grid grid-cols-3 gap-4">
                    {[...Array(9)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                opacity: [0.3, 1, 0.3],
                                scale: [0.8, 1, 0.8]
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: "easeInOut"
                            }}
                            className="w-12 h-12 border-4 border-comic-yellow"
                        />
                    ))}
                </div>

                <div className="w-96">
                    <div className="flex gap-2 mb-4">
                        {[...Array(20)].map((_, i) => {
                            const blockProgress = (i + 1) * 5;
                            const isActive = progress >= blockProgress;

                            return (
                                <motion.div
                                    key={i}
                                    animate={{
                                        opacity: isActive ? 1 : 0.2,
                                        backgroundColor: isActive ? '#FFD93D' : '#333'
                                    }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 h-8 border-2 border-comic-yellow"
                                />
                            );
                        })}
                    </div>

                    <div className="text-center">
                        <motion.div
                            key={progress}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="text-4xl font-mono font-bold text-comic-yellow tracking-widest"
                            style={{
                                textShadow: '0 0 10px rgba(255, 217, 61, 0.5)'
                            }}
                        >
                            {progress}%
                        </motion.div>
                    </div>
                </div>

                <div className="flex gap-4">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -15, 0],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                            }}
                            className="w-4 h-4 bg-comic-yellow"
                        />
                    ))}
                </div>

            </div>

            <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-comic-yellow" />
            <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-comic-yellow" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-comic-yellow" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-comic-yellow" />
        </motion.div>
    );
};
