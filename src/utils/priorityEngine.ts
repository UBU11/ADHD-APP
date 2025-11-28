import type { GoogleTask, GoogleEvent, GoogleCourseWork } from '../services/googleApi';
import { differenceInDays, parseISO, isPast, isToday, isTomorrow } from 'date-fns';

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';

export interface PrioritizedItem {
    id: string;
    title: string;
    type: 'task' | 'event' | 'assignment';
    dueDate: Date;
    urgency: UrgencyLevel;
    remainingTimeStr: string;
    isOverdue: boolean;
    originalData: GoogleTask | GoogleEvent | GoogleCourseWork;
}

const calculateUrgency = (dueDate: Date): UrgencyLevel => {
    if (isPast(dueDate) && !isToday(dueDate)) return 'critical';
    if (isToday(dueDate)) return 'critical';
    if (isTomorrow(dueDate)) return 'high';

    const days = differenceInDays(dueDate, new Date());
    if (days < 3) return 'high';
    if (days < 7) return 'medium';
    return 'low';
};

const formatRemainingTime = (dueDate: Date): string => {
    if (isToday(dueDate)) return 'Today';
    if (isPast(dueDate)) return 'Overdue';
    if (isTomorrow(dueDate)) return 'Tomorrow';

    const days = differenceInDays(dueDate, new Date());
    if (days === 0) return 'Today';
    return `${days} Days`;
};

const formatEventTime = (date: Date): string => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();

    if (diffMs <= 0) return 'Started';

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours < 24) {
        return `${hours}h ${minutes}m`;
    }
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
};

export const prioritizeItems = (tasks: GoogleTask[], events: GoogleEvent[], assignments: GoogleCourseWork[] = [], excludeEvents: boolean = false): PrioritizedItem[] => {
    const items: PrioritizedItem[] = [];

    // Process Events
    if (!excludeEvents) {
        events.forEach(event => {
            if (event.start?.dateTime || event.start?.date) {
                const dueDate = parseISO(event.start.dateTime || event.start.date || '');
                items.push({
                    id: event.id,
                    title: event.summary,
                    type: 'event',
                    dueDate,
                    urgency: calculateUrgency(dueDate),
                    remainingTimeStr: formatEventTime(dueDate),
                    isOverdue: isPast(dueDate) && !isToday(dueDate),
                    originalData: event
                });
            }
        });
    }

    // Process Tasks
    tasks.forEach(task => {
        if (!task.due) return;

        // Parse the task due date string
        let dueDate = new Date(task.due);
        const isAllDay = task.due.includes('T00:00:00');

        // If it's an all-day task (midnight UTC), we treat it as due at the END of that day in local time
        if (isAllDay) {
            dueDate.setHours(23, 59, 59, 999);
        }

        const now = new Date();
        const isOverdue = dueDate < now;

        // Calculate urgency based on time remaining
        const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        let urgency: 'critical' | 'high' | 'medium' | 'low' = 'low';
        if (isOverdue) urgency = 'critical';
        else if (diffHours < 24) urgency = 'high';
        else if (diffHours < 48) urgency = 'medium';

        // Format remaining time string
        let remainingTimeStr = '';
        if (isOverdue) {
            remainingTimeStr = 'Overdue';
        } else if (isToday(dueDate)) {
            remainingTimeStr = 'Today';
        } else if (isTomorrow(dueDate)) {
            remainingTimeStr = 'Tomorrow';
        } else {
            const days = Math.ceil(diffHours / 24);
            remainingTimeStr = `${days} Days`;
        }

        items.push({
            id: task.id,
            title: task.title,
            type: 'task',
            urgency,
            dueDate,
            originalData: task,
            isOverdue,
            remainingTimeStr
        });
    });

    // Process Assignments
    assignments.forEach(assignment => {
        let dueDate: Date | undefined;
        if (assignment.dueDate) {
            // Combine date and time if available, otherwise default to end of day
            const year = assignment.dueDate.year;
            const month = assignment.dueDate.month - 1; // Month is 0-indexed
            const day = assignment.dueDate.day;

            if (assignment.dueTime) {
                const hours = assignment.dueTime.hours || 0;
                const minutes = assignment.dueTime.minutes || 0;
                dueDate = new Date(year, month, day, hours, minutes);
            } else {
                dueDate = new Date(year, month, day, 23, 59, 59);
            }
        }

        if (dueDate) {
            items.push({
                id: assignment.id,
                title: assignment.title,
                type: 'assignment',
                dueDate,
                urgency: calculateUrgency(dueDate),
                remainingTimeStr: formatRemainingTime(dueDate),
                isOverdue: isPast(dueDate) && !isToday(dueDate),
                originalData: assignment
            });
        }
    });

    return items.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
};
