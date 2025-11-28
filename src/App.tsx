import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { FocusMode } from './pages/FocusMode';
import { CalendarView } from './pages/CalendarView';
import { ClassroomView } from './pages/ClassroomView';
import { Settings } from './pages/Settings';
import { useAppStore } from './store/useAppStore';
import { Preloader } from './components/Preloader';
import { fetchCalendarEvents, fetchTasks, fetchCourses, fetchCourseWork, fetchCourseMaterials, setAccessToken } from './services/googleApi';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppStore();
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  const { isDarkMode, isLoading, isInitialized, isAuthenticated, accessToken, setEvents, setTasks, setCourses, setAssignments, setCourseMaterials, logout } = useAppStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Live Sync Effect
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      // Restore the token to the API client
      setAccessToken(accessToken);

      const syncData = async () => {
        try {

          const [events, tasks, courses] = await Promise.all([
            fetchCalendarEvents(),
            fetchTasks(),
            fetchCourses()
          ]);

          setEvents(events);
          setTasks(tasks);
          setCourses(courses);

          if (courses.length > 0) {
            const [assignments, materials] = await Promise.all([
              fetchCourseWork(),
              fetchCourseMaterials()
            ]);
            setAssignments(assignments);
            setCourseMaterials(materials);
          }

        } catch (error) {
          console.error('Sync failed:', error);
          // If token is invalid/expired, logout to force re-auth
          if (error instanceof Error && (error.message.includes('401') || error.message.includes('No access token'))) {
            logout();
          }
        }
      };

      // Initial sync on mount
      syncData();

      // Poll every 2 minutes
      const interval = setInterval(syncData, 2 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, accessToken, setEvents, setTasks, setCourses, setAssignments, setCourseMaterials, logout]);

  const showPreloader = !isInitialized || isLoading;

  return (
    <>
      <AnimatePresence>
        {showPreloader && <Preloader />}
      </AnimatePresence>
      {!showPreloader && (
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/focus" element={
              <PrivateRoute>
                <FocusMode />
              </PrivateRoute>
            } />
            <Route path="/calendar" element={
              <PrivateRoute>
                <CalendarView />
              </PrivateRoute>
            } />
            <Route path="/classroom" element={
              <PrivateRoute>
                <ClassroomView />
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
