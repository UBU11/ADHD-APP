import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { initGoogleAuth, requestAccessToken, fetchCalendarEvents, fetchTasks, fetchCourses, fetchCourseWork, fetchCourseMaterials } from '../services/googleApi';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';


export const Login = () => {
    const { setAuthenticated, setEvents, setTasks, setCourses, setAssignments, setCourseMaterials, setLoading } = useAppStore();
    const navigate = useNavigate();
    const bgRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
    const [cursorVariant, setCursorVariant] = React.useState("default");

    useEffect(() => {
        const mouseMove = (e: MouseEvent) => {
            setMousePos({
                x: e.clientX,
                y: e.clientY
            });
        };

        window.addEventListener("mousemove", mouseMove);

        return () => {
            window.removeEventListener("mousemove", mouseMove);
        };
    }, []);

    const variants = {
        default: {
            x: mousePos.x - 16,
            y: mousePos.y - 16,
            height: 32,
            width: 32,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            border: "2px solid rgba(255, 255, 255, 0.8)",
            transition: {
                type: "spring",
                mass: 0.6
            } as any
        },
        hover: {
            x: mousePos.x - 32,
            y: mousePos.y - 32,
            height: 64,
            width: 64,
            backgroundColor: "rgba(255, 77, 77, 0.8)",
            border: "4px solid #000",
            mixBlendMode: "normal" as any,
            transition: {
                type: "spring",
                mass: 0.6
            } as any
        }
    };

    useEffect(() => {
        initGoogleAuth((token) => {
            setAuthenticated(token);
            setLoading(true);

            Promise.all([
                fetchCalendarEvents(),
                fetchTasks(),
                fetchCourses(),
                fetchCourseWork(),
                fetchCourseMaterials()
            ])
                .then(([events, tasks, courses, assignments, materials]) => {
                    setEvents(events);
                    setTasks(tasks);
                    setCourses(courses);
                    setAssignments(assignments);
                    setCourseMaterials(materials);
                    navigate('/');
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        });


    }, []);

    return (
        <div ref={bgRef} className="h-screen w-screen flex items-center justify-center overflow-hidden relative cursor-none bg-comic-yellow">
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-50 hidden md:block"
                variants={variants}
                animate={cursorVariant}
            />


            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
                backgroundSize: '30px 30px'
            }} />

            <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="comic-card bg-white p-12 max-w-md w-full mx-4 z-10 relative"
            >
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-comic-blue border-4 border-black rounded-full z-20" />

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-24 h-24 bg-comic-red border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-comic-sm text-white cursor-pointer"
                >
                    <motion.div
                        animate={{
                            rotate: [0, -5, 5, -5, 0],
                            scale: [1, 1.05, 1, 1.05, 1]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Brain size={48} className="stroke-[2.5]" />
                    </motion.div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-6xl font-comic text-comic-dark mb-2 tracking-wider uppercase transform -rotate-2"
                >
                    Zanshin
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-comic-dark font-body font-bold text-xl mb-10 uppercase tracking-tight"
                >
                    Master your time with <span className="text-comic-red underline decoration-4 decoration-black">Flow!</span>
                </motion.p>

                <motion.button
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => setCursorVariant("hover")}
                    onMouseLeave={() => setCursorVariant("default")}
                    onClick={requestAccessToken}
                    className="w-full py-4 px-6 bg-comic-blue text-black comic-button text-2xl flex items-center justify-center gap-3 group cursor-none"
                >
                    <div className="w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center">
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                    </div>
                    Connect!
                </motion.button>
            </motion.div>
        </div>
    );
};
