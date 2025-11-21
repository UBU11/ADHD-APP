import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Zap, Brain, Calendar, BookOpen } from 'lucide-react';

export const Preloader = () => {
    const [progress, setProgress] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);

    const loadingMessages = [
        { text: "POWERING UP...", icon: Zap },
        { text: "SYNCING BRAIN...", icon: Brain },
        { text: "LOADING CALENDAR...", icon: Calendar },
        { text: "FETCHING CLASSROOM...", icon: BookOpen },
        { text: "READY TO LAUNCH!", icon: Zap }
    ];

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, 54);

        const messageInterval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % loadingMessages.length);
        }, 1200);

        return () => {
            clearInterval(progressInterval);
            clearInterval(messageInterval);
        };
    }, []);

    const CurrentIcon = loadingMessages[messageIndex].icon;

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ y: "-100%", transition: { duration: 0.6, ease: "easeInOut" } }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-comic-yellow via-yellow-300 to-comic-yellow overflow-hidden"
        >
            <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)',
                backgroundSize: '40px 40px'
            }} />

            <div className="relative z-10 text-center">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 3.3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="mb-8"
                >
                    <h1 className="text-9xl font-comic text-comic-dark tracking-wider uppercase transform -rotate-3 drop-shadow-[6px_6px_0_rgba(0,0,0,1)]">
                        ADHD
                    </h1>
                    <p className="text-3xl font-comic text-comic-red mt-2 transform rotate-2">
                        DASHBOARD
                    </p>
                </motion.div>

                <div className="flex items-center justify-center gap-4 mb-8">
                    <motion.div
                        key={messageIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-3 bg-white px-8 py-4 border-4 border-black rounded-2xl shadow-comic"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <CurrentIcon size={32} className="stroke-[3] text-comic-blue" />
                        </motion.div>
                        <span className="text-2xl font-comic text-comic-dark">
                            {loadingMessages[messageIndex].text}
                        </span>
                    </motion.div>
                </div>

                <div className="w-96 mx-auto">
                    <div className="bg-white border-4 border-black rounded-full h-8 overflow-hidden shadow-comic">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-gradient-to-r from-comic-blue via-blue-500 to-comic-blue relative"
                        >
                            <motion.div
                                animate={{
                                    x: ['-100%', '200%']
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                            />
                        </motion.div>
                    </div>
                    <p className="text-xl font-body font-bold text-comic-dark mt-3">
                        {progress}%
                    </p>
                </div>

                <motion.div
                    animate={{
                        y: [0, -10, 0]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="mt-12 flex justify-center gap-3"
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                            className="w-4 h-4 bg-comic-red border-2 border-black rounded-full"
                        />
                    ))}
                </motion.div>
            </div>

            <motion.div
                animate={{
                    rotate: 360
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-10 right-10 text-9xl opacity-10"
            >
                ⚡
            </motion.div>

            <motion.div
                animate={{
                    rotate: -360
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-10 left-10 text-9xl opacity-10"
            >
                🧠
            </motion.div>
        </motion.div>
    );
};
