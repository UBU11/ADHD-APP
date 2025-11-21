import { useAppStore } from '../store/useAppStore';
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

export const CalendarView = () => {
    const { events } = useAppStore();

    const groupedEvents = events.reduce((acc, event) => {
        const startStr = event.start.dateTime || event.start.date;
        if (!startStr) return acc;

        const date = format(parseISO(startStr), 'yyyy-MM-dd');
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
    }, {} as Record<string, typeof events>);

    const sortedDates = Object.keys(groupedEvents).sort();

    const getDateLabel = (dateStr: string) => {
        const date = parseISO(dateStr);
        if (isToday(date)) return 'TODAY';
        if (isTomorrow(date)) return 'TOMORROW';
        return format(date, 'EEEE').toUpperCase();
    };

    const getDateColor = (dateStr: string) => {
        const date = parseISO(dateStr);
        if (isToday(date)) return 'bg-comic-red';
        if (isTomorrow(date)) return 'bg-comic-yellow';
        return 'bg-comic-blue';
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <h1 className="text-8xl font-comic text-comic-dark mb-4 tracking-wider uppercase transform -rotate-2 inline-block">
                    Calendar
                </h1>
                <div className="flex items-center justify-center gap-4 mt-6">
                    <div className="comic-card bg-comic-yellow px-6 py-3">
                        <p className="text-2xl font-comic text-comic-dark">
                            {sortedDates.length} {sortedDates.length === 1 ? 'Day' : 'Days'}
                        </p>
                    </div>
                    <div className="comic-card bg-comic-blue px-6 py-3">
                        <p className="text-2xl font-comic text-black">
                            {events.length} {events.length === 1 ? 'Event' : 'Events'}
                        </p>
                    </div>
                </div>
            </motion.header>

            <div className="space-y-8">
                {sortedDates.map((date, dateIndex) => {
                    const dateObj = parseISO(date);
                    const isPastDate = isPast(dateObj) && !isToday(dateObj);

                    return (
                        <motion.div
                            key={date}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: dateIndex * 0.1 }}
                        >
                            <div className="mb-4 flex items-center gap-4">
                                <div className={`${getDateColor(date)} px-6 py-3 border-4 border-black rounded-xl shadow-comic-sm inline-block`}>
                                    <div className="flex items-center gap-3">
                                        <CalendarIcon size={28} className="stroke-[3] text-black" />
                                        <div>
                                            <div className="text-2xl font-comic text-black uppercase tracking-wider">
                                                {getDateLabel(date)}
                                            </div>
                                            <div className="text-lg font-body font-bold text-black">
                                                {format(dateObj, 'MMMM do, yyyy')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {isPastDate && (
                                    <div className="bg-gray-400 px-4 py-2 border-2 border-black rounded-lg">
                                        <span className="font-comic text-sm text-black uppercase">Past</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {groupedEvents[date].map((event, eventIndex) => {
                                    const startTime = event.start.dateTime ? parseISO(event.start.dateTime) : null;
                                    const endTime = event.end?.dateTime ? parseISO(event.end.dateTime) : null;

                                    return (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: dateIndex * 0.1 + eventIndex * 0.05 }}
                                            whileHover={{ scale: 1.02, rotate: 1 }}
                                            className="comic-card bg-white p-6 group cursor-pointer"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-2 h-full bg-comic-blue rounded-full" />
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-comic text-comic-dark mb-3 group-hover:text-comic-blue transition-colors">
                                                        {event.summary}
                                                    </h3>

                                                    <div className="space-y-2">
                                                        {startTime && (
                                                            <div className="flex items-center gap-2 text-gray-700">
                                                                <div className="w-8 h-8 bg-comic-yellow border-2 border-black rounded-lg flex items-center justify-center">
                                                                    <Clock size={16} className="stroke-[2.5]" />
                                                                </div>
                                                                <span className="font-body font-bold">
                                                                    {format(startTime, 'h:mm a')}
                                                                    {endTime && ` - ${format(endTime, 'h:mm a')}`}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {!startTime && (
                                                            <div className="flex items-center gap-2 text-gray-700">
                                                                <div className="w-8 h-8 bg-comic-yellow border-2 border-black rounded-lg flex items-center justify-center">
                                                                    <Clock size={16} className="stroke-[2.5]" />
                                                                </div>
                                                                <span className="font-body font-bold uppercase text-sm">
                                                                    All Day Event
                                                                </span>
                                                            </div>
                                                        )}

                                                        {event.location && (
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <div className="w-8 h-8 bg-comic-red border-2 border-black rounded-lg flex items-center justify-center">
                                                                    <MapPin size={16} className="stroke-[2.5]" />
                                                                </div>
                                                                <span className="font-body text-sm">
                                                                    {event.location}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    );
                })}

                {sortedDates.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="inline-block p-8 rounded-full bg-comic-yellow border-4 border-black shadow-comic mb-6">
                            <CalendarIcon size={64} className="stroke-[2.5] text-comic-dark" />
                        </div>
                        <h2 className="text-4xl font-comic text-comic-dark mb-2 uppercase">No Events!</h2>
                        <p className="text-xl font-body font-bold text-gray-600">Your calendar is clear. Time to relax!</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
