import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GoogleEvent, GoogleTask, GoogleCourse, GoogleCourseWork, GoogleCourseMaterial } from '../services/googleApi';

interface AppState {
    isAuthenticated: boolean;
    accessToken: string | null;
    events: GoogleEvent[];
    tasks: GoogleTask[];
    courses: GoogleCourse[];
    assignments: GoogleCourseWork[];
    courseMaterials: GoogleCourseMaterial[];
    isLoading: boolean;
    isInitialized: boolean;
    isDarkMode: boolean;
    totalScore: number;
    completedAssignments: string[];
    setAuthenticated: (token: string) => void;
    setEvents: (events: GoogleEvent[]) => void;
    setTasks: (tasks: GoogleTask[]) => void;
    setCourses: (courses: GoogleCourse[]) => void;
    setAssignments: (assignments: GoogleCourseWork[]) => void;
    setCourseMaterials: (materials: GoogleCourseMaterial[]) => void;
    setLoading: (loading: boolean) => void;
    setInitialized: (initialized: boolean) => void;
    toggleTheme: () => void;
    addScore: (points: number, assignmentId: string) => void;
    logout: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            accessToken: null,
            events: [],
            tasks: [],
            courses: [],
            assignments: [],
            courseMaterials: [],
            isLoading: false,
            isInitialized: false,
            isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
            totalScore: 0,
            completedAssignments: [],
            setAuthenticated: (token) => set({ isAuthenticated: true, accessToken: token }),
            setEvents: (events) => set({ events }),
            setTasks: (tasks) => set({ tasks }),
            setCourses: (courses) => set({ courses }),
            setAssignments: (assignments) => set({ assignments }),
            setCourseMaterials: (materials) => set({ courseMaterials: materials }),
            setLoading: (loading) => set({ isLoading: loading }),
            setInitialized: (initialized) => set({ isInitialized: initialized }),
            toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
            addScore: (points, assignmentId) => set((state) => {
                if (state.completedAssignments.includes(assignmentId)) {
                    return state;
                }
                return {
                    totalScore: state.totalScore + points,
                    completedAssignments: [...state.completedAssignments, assignmentId]
                };
            }),
            logout: () => set({
                isAuthenticated: false,
                accessToken: null,
                events: [],
                tasks: [],
                courses: [],
                assignments: [],
                courseMaterials: []
                // totalScore and completedAssignments are preserved
            }),
        }),
        {
            name: 'adhd-storage',
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                accessToken: state.accessToken,
                events: state.events,
                tasks: state.tasks,
                courses: state.courses,
                assignments: state.assignments,
                courseMaterials: state.courseMaterials,
                isDarkMode: state.isDarkMode,
                totalScore: state.totalScore,
                completedAssignments: state.completedAssignments
            }),
            onRehydrateStorage: () => (state) => {
                state?.setInitialized(true);
            },
        }
    )
);
