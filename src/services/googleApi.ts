const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SCOPES = 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly';
export interface GoogleEvent {
    id: string;
    summary: string;
    start: { dateTime?: string; date?: string };
    end: { dateTime?: string; date?: string };
    location?: string;
}

export interface GoogleTask {
    id: string;
    title: string;
    due?: string;
    status: string;
}

export interface GoogleCourse {
    id: string;
    name: string;
    section?: string;
    descriptionHeading?: string;
    room?: string;
    courseState: string;
}

export interface GoogleCourseWork {
    id: string;
    courseId: string;
    title: string;
    description?: string;
    state: string;
    dueDate?: {
        year: number;
        month: number;
        day: number;
    };
    dueTime?: {
        hours: number;
        minutes: number;
    };
    maxPoints?: number;
}

export interface GoogleCourseMaterial {
    id: string;
    courseId: string;
    title: string;
    description?: string;
    materials?: Array<{
        driveFile?: { driveFile: { title: string; alternateLink: string } };
        youtubeVideo?: { title: string; alternateLink: string };
        link?: { title: string; url: string };
    }>;
}

let tokenClient: any;
let accessToken: string | null = null;

export const initGoogleAuth = (callback: (token: string) => void) => {
    if (typeof window === 'undefined') return;

    const initialize = () => {
        if (!(window as any).google) {
            setTimeout(initialize, 100);
            return;
        }

        tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (tokenResponse: any) => {
                if (tokenResponse.access_token) {
                    accessToken = tokenResponse.access_token;
                    callback(accessToken || '');
                }
            },
        });
    };

    initialize();
};

export const requestAccessToken = () => {
    if (tokenClient) {
        tokenClient.requestAccessToken();
    } else {
        console.error('Google Auth not initialized');
    }
};

export const setAccessToken = (token: string) => {
    accessToken = token;
};

export const fetchCalendarEvents = async (): Promise<GoogleEvent[]> => {
    if (!accessToken) throw new Error('No access token');

    const now = new Date().toISOString();
    const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&singleEvents=true&orderBy=startTime`,
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    );

    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
    return data.items || [];
};

export const fetchTasks = async (): Promise<GoogleTask[]> => {
    if (!accessToken) throw new Error('No access token');

    const listResponse = await fetch(
        'https://tasks.googleapis.com/tasks/v1/users/@me/lists',
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    );

    if (!listResponse.ok) throw new Error('Failed to fetch task lists');
    const listData = await listResponse.json();
    const defaultList = listData.items?.[0];

    if (!defaultList) return [];

    const tasksResponse = await fetch(
        `https://tasks.googleapis.com/tasks/v1/lists/${defaultList.id}/tasks?showCompleted=false`,
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    );

    if (!tasksResponse.ok) throw new Error('Failed to fetch tasks');
    const tasksData = await tasksResponse.json();
    return tasksData.items || [];
};

export const fetchCourses = async (): Promise<GoogleCourse[]> => {
    if (!accessToken) return [];

    const response = await fetch(
        'https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE',
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    );

    const data = await response.json();
    return data.courses || [];
};

export const fetchCourseWork = async (): Promise<GoogleCourseWork[]> => {
    if (!accessToken) return [];

    const courses = await fetchCourses();
    const allCourseWork: GoogleCourseWork[] = [];

    for (const course of courses) {
        try {
            const response = await fetch(
                `https://classroom.googleapis.com/v1/courses/${course.id}/courseWork`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            const data = await response.json();
            if (data.courseWork) {
                allCourseWork.push(...data.courseWork);
            }
        } catch (error) {
            console.error(`Error fetching coursework for ${course.name}:`, error);
        }
    }

    return allCourseWork;
};

export const fetchCourseMaterials = async (): Promise<GoogleCourseMaterial[]> => {
    if (!accessToken) return [];

    const courses = await fetchCourses();
    const allMaterials: GoogleCourseMaterial[] = [];

    for (const course of courses) {
        try {
            const response = await fetch(
                `https://classroom.googleapis.com/v1/courses/${course.id}/courseWorkMaterials`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            )

                ;

            const data = await response.json();
            if (data.courseWorkMaterial) {
                allMaterials.push(...data.courseWorkMaterial);
            }
        } catch (error) {
            console.error(`Error fetching materials for ${course.name}:`, error);
        }
    }

    return allMaterials;
};

export const completeTask = async (taskId: string, taskListId?: string): Promise<boolean> => {
    if (!accessToken) throw new Error('No access token');

    try {
        // If no taskListId provided, get the default list
        let listId = taskListId;
        if (!listId) {
            const listResponse = await fetch(
                'https://tasks.googleapis.com/tasks/v1/users/@me/lists',
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
            const listData = await listResponse.json();
            listId = listData.items?.[0]?.id;
        }

        if (!listId) throw new Error('No task list found');

        // Mark task as completed
        const response = await fetch(
            `https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks/${taskId}`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'completed'
                }),
            }
        );

        return response.ok;
    } catch (error) {
        console.error('Error completing task:', error);
        return false;
    }
};

export const deleteEvent = async (eventId: string): Promise<boolean> => {
    if (!accessToken) {
        console.error('No access token available');
        throw new Error('No access token');
    }

    try {

        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );



        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to delete event:', response.status, errorText);
            return false;
        }


        return true;
    } catch (error) {
        console.error('Error deleting event:', error);
        return false;
    }
};
