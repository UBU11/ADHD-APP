import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { prioritizeItems, type PrioritizedItem } from '../utils/priorityEngine';
import { Clock, ShieldAlert, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { differenceInHours, differenceInMinutes, isPast } from 'date-fns';

const Countdown = ({ date }: { date?: Date }) => {
    const [timeStr, setTimeStr] = useState('');

    useEffect(() => {
        if (!date) {
            setTimeStr('No Deadline');
            return;
        }

        const update = () => {
            if (isPast(date)) {
                setTimeStr('OVERDUE!');
                return;
            }

            const now = new Date();
            const hours = differenceInHours(date, now);
            const minutes = differenceInMinutes(date, now) % 60;

            if (hours < 24) {
                setTimeStr(`${hours}h ${minutes}m`);
            } else {
                const days = Math.floor(hours / 24);
                setTimeStr(`${days}d ${hours % 24}h`);
            }
        };

        update();
        const interval = setInterval(update, 60000);
        return () => clearInterval(interval);
    }, [date]);

    return <span className="font-mono text-lg">{timeStr}</span>;
};

const TaskCard = ({ item, index }: { item: PrioritizedItem; index: number }) => {
    const navigate = useNavigate();

    const urgencyStyles = {
        critical: 'bg-comic-red text-white',
        high: 'bg-orange-500 text-white',
        medium: 'bg-comic-yellow text-black',
        low: 'bg-comic-blue text-black',
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            whileHover={{ scale: 1.02, rotate: 1 }}
            onClick={() => navigate('/focus', { state: { taskId: item.id } })}
            className="comic-card p-0 overflow-hidden cursor-pointer group relative bg-white"
        >
            <div className={`absolute top-0 left-0 w-4 h-full border-r-4 border-black ${urgencyStyles[item.urgency]}`} />

            <div className="p-6 pl-10 flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 border-2 border-black text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0_#000] ${item.type === 'event' ? 'bg-purple-400 text-white' : 'bg-cyan-400 text-black'}`}>
                            {item.type}
                        </span>
                        {item.urgency === 'critical' && (
                            <span className="animate-pulse text-comic-red font-comic tracking-widest text-lg">CRITICAL!</span>
                        )}
                    </div>
                    <h3 className="font-comic text-2xl text-comic-dark tracking-wide group-hover:text-comic-blue transition-colors">
                        {item.title}
                    </h3>
                </div>

                <div className="flex flex-col items-end">
                    <div className={`px-4 py-2 border-4 border-black rounded-lg font-bold flex items-center gap-2 shadow-comic-sm group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all bg-white text-black`}>
                        <Clock size={20} className="stroke-[3]" />
                        <Countdown date={item.dueDate} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const Dashboard = () => {
    const { tasks, events, assignments } = useAppStore();
    const prioritizedItems = prioritizeItems(tasks, events, assignments);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-6xl font-comic text-comic-dark mb-2 tracking-wider uppercase drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                        Mission Control
                    </h1>
                    <p className="text-xl font-bold bg-comic-yellow inline-block px-4 py-1 border-4 border-black transform -rotate-1 shadow-comic-sm flex items-center gap-2">
                        <ShieldAlert size={24} className="stroke-[3]" />
                        {prioritizedItems.filter(i => i.urgency === 'critical' || i.urgency === 'high').length} THREATS DETECTED!
                    </p>
                </div>
                <div className="hidden md:block">
                    <div className="w-24 h-24 bg-comic-blue rounded-full border-4 border-black flex items-center justify-center shadow-comic animate-bounce">
                        <Zap size={48} className="stroke-[3] text-white" />
                    </div>
                </div>
            </header>

            <div className="grid gap-6">
                <AnimatePresence>
                    {prioritizedItems.map((item, index) => (
                        <TaskCard key={item.id} item={item} index={index} />
                    ))}
                </AnimatePresence>

                {prioritizedItems.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-block p-6 rounded-full bg-comic-blue border-4 border-black shadow-comic mb-6 animate-pulse">
                            <ShieldCheck size={64} className="stroke-[2.5] text-white" />
                        </div>
                        <h2 className="text-4xl font-comic text-comic-dark mb-2">SECTOR CLEAR!</h2>
                        <p className="text-xl font-bold">No active threats. Patrol complete.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
