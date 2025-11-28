import type { GoogleTask, GoogleEvent, GoogleCourseWork } from '../services/googleApi';
import { differenceInHours, differenceInMinutes, parseISO, isPast } from 'date-fns';

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';

export interface PrioritizedItem {
    id: string;
    title: string;
    type: 'task' | 'event' | 'assignment';
    dueDate?: Date;
    urgency: UrgencyLevel;
    remainingTimeStr: string;
    isOverdue: boolean;
    originalData: GoogleTask | GoogleEvent | GoogleCourseWork;
}

export const calculateUrgency = (dueDate: Date): UrgencyLevel => {
    const now = new Date();
    const hoursRemaining = differenceInHours(dueDate, now);

    if (isPast(dueDate)) return 'critical';
    if (hoursRemaining < 24) return 'high';
    if (hoursRemaining < 72) return 'medium';
    return 'low';
};

export const formatRemainingTime = (dueDate: Date): string => {
    const now = new Date();
    if (isPast(dueDate)) return 'Overdue';

    const hours = differenceInHours(dueDate, now);
    const minutes = differenceInMinutes(dueDate, now) % 60;

    if (hours < 24) {
        return `${hours}h ${minutes}m`;
    } else {
        const days = Math.floor(hours / 24);
        return `${days}d ${hours % 24}h`;
    }
};

export const prioritizeItems = (tasks: GoogleTask[], events: GoogleEvent[], assignments: GoogleCourseWork[] = [], excludeEvents: boolean = false): PrioritizedItem[] => {
    const items: PrioritizedItem[] = [];


    tasks.forEach(task => {
        let dueDate: Date | undefined;
        if (task.due) {
            dueDate = parseISO(task.due);
        }

        if (dueDate) {
            items.push({
                id: task.id,
                title: task.title,
                type: 'task',
                dueDate,
                urgency: calculateUrgency(dueDate),
                remainingTimeStr: formatRemainingTime(dueDate),
                isOverdue: isPast(dueDate),
                originalData: task
            });
        } else {

            items.push({
                id: task.id,
                title: task.title,
                type: 'task',
                urgency: 'low',
                remainingTimeStr: 'No deadline',
                isOverdue: false,
                originalData: task
            });
        }
    });

    assignments.forEach(assignment => {
        if (assignment.dueDate) {
            const dueDate = new Date(
                assignment.dueDate.year,
                assignment.dueDate.month - 1,
                assignment.dueDate.day,
                assignment.dueTime?.hours || 23,
                assignment.dueTime?.minutes || 59
            );

            items.push({
                id: assignment.id,
                title: assignment.title,
                type: 'assignment',
                dueDate,
                urgency: calculateUrgency(dueDate),
                remainingTimeStr: formatRemainingTime(dueDate),
                isOverdue: isPast(dueDate),
                originalData: assignment
            });
        }
    });

    // Only include events if not excluded
    if (!excludeEvents) {
        events.forEach(event => {
            const startStr = event.start.dateTime || event.start.date;
            if (!startStr) return;

            const startDate = parseISO(startStr);

            items.push({
                id: event.id,
                title: event.summary,
                type: 'event',
                dueDate: startDate,
                urgency: calculateUrgency(startDate),
                remainingTimeStr: formatRemainingTime(startDate),
                isOverdue: isPast(startDate),
                originalData: event
            });
        });
    }

    return items.sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;


        const urgencyWeight = { critical: 0, high: 1, medium: 2, low: 3 };
        if (urgencyWeight[a.urgency] !== urgencyWeight[b.urgency]) {
            return urgencyWeight[a.urgency] - urgencyWeight[b.urgency];
        }


        if (a.dueDate && b.dueDate) {
            return a.dueDate.getTime() - b.dueDate.getTime();
        }

        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;

        return 0;
    });
};
