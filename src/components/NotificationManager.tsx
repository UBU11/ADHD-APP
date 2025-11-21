import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { prioritizeItems } from '../utils/priorityEngine';
import { differenceInHours } from 'date-fns';

export const NotificationManager = () => {
    const { tasks, events } = useAppStore();

    useEffect(() => {
        if (!('Notification' in window)) return;

        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if (Notification.permission !== 'granted') return;

        const items = prioritizeItems(tasks, events);

        items.forEach(item => {
            if (!item.dueDate) return;

            const now = new Date();
            const hoursLeft = differenceInHours(item.dueDate, now);

            if (hoursLeft === 1) {
                new Notification(`Heads up! ${item.title}`, {
                    body: `Only 1 hour remaining!`,
                    icon: '/vite.svg'
                });
            }
        });

    }, [tasks, events]);

    return null;
};
