import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { prioritizeItems, type PrioritizedItem } from '../utils/priorityEngine';
import { differenceInSeconds } from 'date-fns';
import { Play, Pause, CheckCircle, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import gsap from 'gsap';

export const FocusMode = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { tasks, events } = useAppStore();
    const [activeTask, setActiveTask] = useState<PrioritizedItem | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [sessionTime, setSessionTime] = useState(0);
    const [zenMode, setZenMode] = useState(false);

    const timerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const items = prioritizeItems(tasks, events);
        const taskId = location.state?.taskId;

        if (taskId) {
            const found = items.find(i => i.id === taskId);
            if (found) setActiveTask(found);
        } else if (items.length > 0) {
            setActiveTask(items[0]);
        }
    }, [tasks, events, location.state]);

    useEffect(() => {
        if (!activeTask?.dueDate) return;

        const interval = setInterval(() => {
            const now = new Date();
            const diff = differenceInSeconds(activeTask.dueDate!, now);

            if (diff <= 0) {
                setTimeLeft('00:00:00');
                return;
            }

            const hours = Math.floor(diff / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = diff % 60;

            setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [activeTask]);

    useEffect(() => {
        let interval: any;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setSessionTime(prev => prev + 1);
            }, 1000);


            if (timerRef.current) {
                gsap.to(timerRef.current, {
                    scale: 1.05,
                    duration: 0.5,
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut"
                });
            }
        } else {
            if (timerRef.current) {
                gsap.killTweensOf(timerRef.current);
                gsap.to(timerRef.current, { scale: 1, duration: 0.3 });
            }
        }
        return () => {
            clearInterval(interval);
            if (timerRef.current) gsap.killTweensOf(timerRef.current);
        };
    }, [isTimerRunning]);

    const formatSessionTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (!activeTask) return <div className="p-8 text-center dark:text-white">No tasks available!</div>;

    return (
        <div className={`h-full flex flex-col items-center justify-center p-8 relative transition-colors duration-500 ${zenMode ? 'bg-black' : 'bg-comic-paper'}`}>
            <AnimatePresence>
                {!zenMode && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => navigate('/')}
                        className="absolute top-8 left-8 p-3 rounded-xl bg-white border-4 border-black shadow-comic-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                        <ArrowLeft size={24} className="stroke-[3]" />
                    </motion.button>
                )}
            </AnimatePresence>

            <button
                onClick={() => setZenMode(!zenMode)}
                className={`absolute top-8 right-8 p-3 rounded-xl border-4 border-black shadow-comic-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all ${zenMode ? 'bg-white text-black' : 'bg-comic-yellow text-black'}`}
            >
                {zenMode ? <Minimize2 size={24} className="stroke-[3]" /> : <Maximize2 size={24} className="stroke-[3]" />}
            </button>

            <motion.div
                key={activeTask.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center max-w-4xl w-full"
            >
                {!zenMode && (
                    <div className="mb-4 text-xl font-comic tracking-widest text-comic-dark uppercase bg-comic-blue inline-block px-4 py-1 border-4 border-black transform -rotate-2 shadow-[4px_4px_0_#000]">
                        Current Mission
                    </div>
                )}

                <h1 className={`font-comic mb-8 leading-tight transition-all duration-500 uppercase tracking-wide ${zenMode ? 'text-6xl md:text-8xl text-white' : 'text-5xl md:text-7xl text-comic-dark drop-shadow-[4px_4px_0_rgba(0,0,0,0.2)]'}`}>
                    {activeTask.title}
                </h1>

                {activeTask.dueDate && (
                    <div className="mb-12">
                        {!zenMode && <div className="text-lg font-bold text-comic-dark mb-2 uppercase tracking-widest">Time Remaining</div>}
                        <div ref={timerRef} className={`font-mono font-bold tracking-tighter transition-colors duration-300 ${zenMode ? 'text-8xl md:text-9xl text-white/80' : 'text-7xl md:text-9xl text-comic-red drop-shadow-[4px_4px_0_#000]'}`}>
                            {timeLeft}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-center gap-8 mb-12">
                    <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className={`p-6 rounded-full border-4 border-black transition-all transform hover:scale-110 shadow-comic ${isTimerRunning
                            ? 'bg-comic-yellow text-black'
                            : 'bg-comic-blue text-black'
                            }`}
                    >
                        {isTimerRunning ? <Pause size={40} className="stroke-[3]" /> : <Play size={40} className="stroke-[3]" />}
                    </button>

                    <button className="p-6 rounded-full bg-comic-red text-white border-4 border-black shadow-comic hover:scale-110 transition-all">
                        <CheckCircle size={40} className="stroke-[3]" />
                    </button>
                </div>

                {!zenMode && (
                    <div className="bg-white border-4 border-black shadow-comic rounded-2xl p-6 inline-block transform rotate-1">
                        <div className="text-sm font-bold text-comic-dark mb-1 uppercase tracking-wider">Session Timer</div>
                        <div className="text-3xl font-mono font-bold text-comic-dark">
                            {formatSessionTime(sessionTime)}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
