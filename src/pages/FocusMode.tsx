import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { prioritizeItems, type PrioritizedItem } from '../utils/priorityEngine';
import { differenceInSeconds } from 'date-fns';
import { Play, Pause, CheckCircle, ArrowLeft, Maximize2, Minimize2, SkipForward, Trophy, Clock } from 'lucide-react';
import gsap from 'gsap';
import { completeTask, deleteEvent } from '../services/googleApi';

export const FocusMode = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { tasks, events, assignments, setTasks, setEvents } = useAppStore();
    const [allTasks, setAllTasks] = useState<PrioritizedItem[]>([]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [activeTask, setActiveTask] = useState<PrioritizedItem | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [sessionTime, setSessionTime] = useState(0);
    const [zenMode, setZenMode] = useState(false);
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);
    const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    const timerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const items = prioritizeItems(tasks, events, assignments, false); // Include events now
        setAllTasks(items);

        const taskId = location.state?.taskId;

        if (taskId) {
            const foundIndex = items.findIndex(i => i.id === taskId);
            if (foundIndex !== -1) {
                setCurrentTaskIndex(foundIndex);
                setActiveTask(items[foundIndex]);
            }
        } else if (items.length > 0) {
            setActiveTask(items[0]);
        }
    }, [tasks, events, assignments, location.state]);

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

    const handleCompleteTask = async () => {
        if (!activeTask || isCompleting) return;

        setIsCompleting(true);
        setShowCompletionAnimation(true);
        setIsTimerRunning(false);

        // Handle different item types
        if (activeTask.type === 'task') {
            try {
                await completeTask(activeTask.id);
                // Remove from local tasks list
                const updatedTasks = tasks.filter(t => t.id !== activeTask.id);
                setTasks(updatedTasks);
            } catch (error) {
                console.error('Failed to complete task:', error);
            }
        } else if (activeTask.type === 'event') {
            try {
                await deleteEvent(activeTask.id);
                // Remove from local events list
                const updatedEvents = events.filter(e => e.id !== activeTask.id);
                setEvents(updatedEvents);
            } catch (error) {
                console.error('Failed to delete event:', error);
            }
        }

        setCompletedTasks(prev => [...prev, activeTask.id]);

        setTimeout(() => {
            setShowCompletionAnimation(false);
            setIsCompleting(false);
            handleNextTask();
        }, 2000);
    };

    const handleNextTask = () => {
        const nextIndex = currentTaskIndex + 1;
        if (nextIndex < allTasks.length) {
            setCurrentTaskIndex(nextIndex);
            setActiveTask(allTasks[nextIndex]);
            setSessionTime(0);
        } else {
            // All tasks completed
            navigate('/');
        }
    };

    const handleSkipTask = () => {
        setIsTimerRunning(false);
        setSessionTime(0);
        handleNextTask();
    };

    if (!activeTask) return (
        <div className="h-full flex items-center justify-center p-4 sm:p-8">
            <div className="text-center">
                <div className="inline-block p-6 sm:p-8 rounded-full bg-comic-yellow border-4 border-black shadow-comic mb-4 sm:mb-6">
                    <Trophy size={48} className="stroke-[2.5] text-comic-dark sm:hidden" />
                    <Trophy size={64} className="stroke-[2.5] text-comic-dark hidden sm:block" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-comic text-comic-dark mb-2 uppercase">No Tasks!</h2>
                <p className="text-lg sm:text-xl font-body font-bold text-gray-600 mb-6">All clear. Great job!</p>
                <button
                    onClick={() => navigate('/')}
                    className="comic-button bg-comic-blue text-black px-6 py-3"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative transition-colors duration-500 ${zenMode ? 'bg-black' : 'bg-comic-paper'}`}>
            {/* Completion Animation */}
            <AnimatePresence>
                {showCompletionAnimation && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    >
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="bg-green-400 p-8 sm:p-12 rounded-full border-8 border-black shadow-comic"
                        >
                            <CheckCircle size={80} className="stroke-[3] text-black sm:hidden" />
                            <CheckCircle size={120} className="stroke-[3] text-black hidden sm:block" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Back Button */}
            <AnimatePresence>
                {!zenMode && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => navigate('/')}
                        className="absolute top-4 left-4 sm:top-8 sm:left-8 p-2 sm:p-3 rounded-xl bg-white border-4 border-black shadow-comic-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                        <ArrowLeft size={20} className="stroke-[3] sm:hidden" />
                        <ArrowLeft size={24} className="stroke-[3] hidden sm:block" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Zen Mode Toggle */}
            <button
                onClick={() => setZenMode(!zenMode)}
                className={`absolute top-4 right-4 sm:top-8 sm:right-8 p-2 sm:p-3 rounded-xl border-4 border-black shadow-comic-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all ${zenMode ? 'bg-white text-black' : 'bg-comic-yellow text-black'}`}
            >
                {zenMode ? <Minimize2 size={20} className="stroke-[3] sm:hidden" /> : <Maximize2 size={20} className="stroke-[3] sm:hidden" />}
                {zenMode ? <Minimize2 size={24} className="stroke-[3] hidden sm:block" /> : <Maximize2 size={24} className="stroke-[3] hidden sm:block" />}
            </button>

            {/* Progress Indicator */}
            {!zenMode && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 sm:top-8">
                    <div className="bg-white border-4 border-black rounded-full px-4 sm:px-6 py-2 shadow-comic-sm">
                        <p className="text-sm sm:text-base font-comic text-black">
                            Task {currentTaskIndex + 1} of {allTasks.length}
                        </p>
                    </div>
                </div>
            )}

            <motion.div
                key={activeTask.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center max-w-4xl w-full mt-12 sm:mt-0"
            >
                {!zenMode && (
                    <div className="mb-3 sm:mb-4 text-base sm:text-xl font-comic tracking-widest text-comic-dark uppercase bg-comic-blue inline-block px-3 sm:px-4 py-1 border-4 border-black transform -rotate-2 shadow-[4px_4px_0_#000]">
                        Current Mission
                    </div>
                )}

                <h1 className={`font-comic mb-6 sm:mb-8 leading-tight transition-all duration-500 uppercase tracking-wide px-4 ${zenMode ? 'text-4xl sm:text-6xl md:text-8xl text-white' : 'text-3xl sm:text-5xl md:text-7xl text-comic-dark drop-shadow-[4px_4px_0_rgba(0,0,0,0.2)]'}`}>
                    {activeTask.title}
                </h1>

                {activeTask.dueDate && (
                    <div className="mb-8 sm:mb-12">
                        {!zenMode && (
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Clock size={18} className="stroke-[3] text-comic-dark sm:hidden" />
                                <Clock size={20} className="stroke-[3] text-comic-dark hidden sm:block" />
                                <div className="text-base sm:text-lg font-bold text-comic-dark uppercase tracking-widest">Time Remaining</div>
                            </div>
                        )}
                        <div ref={timerRef} className={`font-mono font-bold tracking-tighter transition-colors duration-300 ${zenMode ? 'text-6xl sm:text-8xl md:text-9xl text-white/80' : 'text-5xl sm:text-7xl md:text-9xl text-comic-red drop-shadow-[4px_4px_0_#000]'}`}>
                            {timeLeft}
                        </div>
                    </div>
                )}

                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-4 sm:gap-8 mb-8 sm:mb-12 flex-wrap">
                    <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className={`p-4 sm:p-6 rounded-full border-4 border-black transition-all transform hover:scale-110 shadow-comic ${isTimerRunning
                            ? 'bg-comic-yellow text-black'
                            : 'bg-comic-blue text-black'
                            }`}
                    >
                        {isTimerRunning ? <Pause size={32} className="stroke-[3] sm:hidden" /> : <Play size={32} className="stroke-[3] sm:hidden" />}
                        {isTimerRunning ? <Pause size={40} className="stroke-[3] hidden sm:block" /> : <Play size={40} className="stroke-[3] hidden sm:block" />}
                    </button>

                    <button
                        onClick={handleCompleteTask}
                        className="p-4 sm:p-6 rounded-full bg-green-400 text-black border-4 border-black shadow-comic hover:scale-110 transition-all"
                    >
                        <CheckCircle size={32} className="stroke-[3] sm:hidden" />
                        <CheckCircle size={40} className="stroke-[3] hidden sm:block" />
                    </button>

                    <button
                        onClick={handleSkipTask}
                        className="p-4 sm:p-6 rounded-full bg-gray-400 text-black border-4 border-black shadow-comic hover:scale-110 transition-all"
                    >
                        <SkipForward size={32} className="stroke-[3] sm:hidden" />
                        <SkipForward size={40} className="stroke-[3] hidden sm:block" />
                    </button>
                </div>

                {/* Session Timer & Completed Count */}
                {!zenMode && (
                    <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                        <div className="bg-white border-4 border-black shadow-comic rounded-2xl p-3 sm:p-6 inline-block transform rotate-1">
                            <div className="text-xs sm:text-sm font-bold text-comic-dark mb-1 uppercase tracking-wider">Session Time</div>
                            <div className="text-2xl sm:text-3xl font-mono font-bold text-comic-dark">
                                {formatSessionTime(sessionTime)}
                            </div>
                        </div>
                        <div className="bg-green-400 border-4 border-black shadow-comic rounded-2xl p-3 sm:p-6 inline-block transform -rotate-1">
                            <div className="text-xs sm:text-sm font-bold text-black mb-1 uppercase tracking-wider">Completed</div>
                            <div className="text-2xl sm:text-3xl font-mono font-bold text-black">
                                {completedTasks.length}
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
