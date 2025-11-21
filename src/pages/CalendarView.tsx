import { useAppStore } from '../store/useAppStore';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

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

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Calendar</h1>

            <div className="space-y-8">
                {sortedDates.map((date, index) => (
                    <motion.div
                        key={date}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <h2 className="text-xl font-bold text-gray-600 mb-4 sticky top-0 bg-white/80 backdrop-blur-sm py-2">
                            {format(parseISO(date), 'EEEE, MMMM do')}
                        </h2>
                        <div className="space-y-3">
                            {groupedEvents[date].map(event => (
                                <div key={event.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
                                    <div className="w-1 bg-primary rounded-full" />
                                    <div>
                                        <div className="font-semibold text-gray-800">{event.summary}</div>
                                        <div className="text-sm text-gray-500">
                                            {event.start.dateTime ? format(parseISO(event.start.dateTime), 'h:mm a') : 'All Day'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}

                {sortedDates.length === 0 && (
                    <div className="text-center text-gray-400 py-12">No upcoming events found.</div>
                )}
            </div>
        </div>
    );
};
