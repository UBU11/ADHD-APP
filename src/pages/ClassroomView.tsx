import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, FileText, Link as LinkIcon, Award, Calendar, ExternalLink, Check, X } from 'lucide-react';
import { differenceInHours, isPast } from 'date-fns';
import { useState } from 'react';

export const ClassroomView = () => {
    const { courses, assignments, courseMaterials } = useAppStore();
    const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>(courses.map(c => c.id));
    const [showCourseSelector, setShowCourseSelector] = useState(false);

    const getCourseById = (courseId: string) => {
        return courses.find(c => c.id === courseId);
    };

    const getAssignmentUrgency = (dueDate: Date | null) => {
        if (!dueDate) return 'none';
        if (isPast(dueDate)) return 'overdue';
        const hours = differenceInHours(dueDate, new Date());
        if (hours < 24) return 'critical';
        if (hours < 72) return 'high';
        return 'normal';
    };

    const urgencyColors = {
        overdue: 'bg-comic-red text-black',
        critical: 'bg-comic-yellow text-black',
        high: 'bg-orange-400 text-black',
        normal: 'bg-comic-blue text-black',
        none: 'bg-gray-400 text-black'
    };

    const toggleCourse = (courseId: string) => {
        setSelectedCourseIds(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };

    const selectAllCourses = () => {
        setSelectedCourseIds(courses.map(c => c.id));
    };

    const deselectAllCourses = () => {
        setSelectedCourseIds([]);
    };

    const filteredAssignments = assignments.filter(a => selectedCourseIds.includes(a.courseId));
    const filteredMaterials = courseMaterials.filter(m => selectedCourseIds.includes(m.courseId));

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <h1 className="text-8xl font-comic text-comic-dark mb-4 tracking-wider uppercase transform -rotate-2 inline-block">
                    Classroom
                </h1>
                <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                    <div className="comic-card bg-comic-yellow px-6 py-3">
                        <p className="text-2xl font-comic text-comic-dark">
                            {selectedCourseIds.length} / {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
                        </p>
                    </div>
                    <div className="comic-card bg-comic-blue px-6 py-3">
                        <p className="text-2xl font-comic text-black">
                            {filteredAssignments.length} {filteredAssignments.length === 1 ? 'Assignment' : 'Assignments'}
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCourseSelector(!showCourseSelector)}
                        className="comic-button bg-comic-red text-black px-6 py-3"
                    >
                        {showCourseSelector ? 'Hide' : 'Select'} Courses
                    </motion.button>
                </div>
            </motion.header>

            <AnimatePresence>
                {showCourseSelector && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8 comic-card bg-white p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-3xl font-comic text-comic-dark uppercase">Select Courses to Track</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={selectAllCourses}
                                    className="px-4 py-2 bg-comic-blue text-black border-2 border-black rounded-lg font-body font-bold hover:bg-blue-600 transition-colors"
                                >
                                    Select All
                                </button>
                                <button
                                    onClick={deselectAllCourses}
                                    className="px-4 py-2 bg-gray-400 text-black border-2 border-black rounded-lg font-body font-bold hover:bg-gray-500 transition-colors"
                                >
                                    Deselect All
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {courses.map(course => (
                                <motion.button
                                    key={course.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toggleCourse(course.id)}
                                    className={`p-4 border-4 border-black rounded-lg font-body font-bold text-left transition-all ${selectedCourseIds.includes(course.id)
                                        ? 'bg-comic-yellow text-comic-dark'
                                        : 'bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg">{course.name}</span>
                                        {selectedCourseIds.includes(course.id) ? (
                                            <Check size={24} className="stroke-[3] text-green-600" />
                                        ) : (
                                            <X size={24} className="stroke-[3] text-gray-400" />
                                        )}
                                    </div>
                                    {course.section && (
                                        <span className="text-sm opacity-75">{course.section}</span>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-8">
                <motion.section
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className="text-5xl font-comic text-comic-dark mb-6 uppercase flex items-center gap-3">
                        <BookOpen size={42} className="stroke-[3]" />
                        Your Courses
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.filter(c => selectedCourseIds.includes(c.id)).length === 0 ? (
                            <div className="col-span-full comic-card bg-white p-8 text-center">
                                <p className="text-2xl font-body text-gray-500">No courses selected. Click "Select Courses" above!</p>
                            </div>
                        ) : (
                            courses.filter(c => selectedCourseIds.includes(c.id)).map((course, idx) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ scale: 1.02, rotate: 1 }}
                                    className="comic-card bg-gradient-to-br from-comic-yellow to-yellow-300 p-6"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <BookOpen size={32} className="stroke-[3] text-comic-dark" />
                                        {course.section && (
                                            <span className="bg-yellow-300 text-black px-3 py-1 rounded-full text-sm font-body font-bold border-2 border-black">
                                                {course.section}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-comic text-comic-dark mb-2">
                                        {course.name}
                                    </h3>
                                    {course.room && (
                                        <p className="text-lg font-body font-bold text-gray-700 flex items-center gap-2 mb-3">
                                            📍 {course.room}
                                        </p>
                                    )}
                                    <a
                                        href={`https://classroom.google.com/c/${course.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-comic-blue text-black px-4 py-2 rounded-lg border-2 border-black font-body font-bold hover:bg-blue-600 transition-colors"
                                    >
                                        <ExternalLink size={18} />
                                        Open in Classroom
                                    </a>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-5xl font-comic text-comic-dark mb-6 uppercase flex items-center gap-3">
                        <FileText size={42} className="stroke-[3]" />
                        Assignments
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredAssignments.length === 0 ? (
                            <div className="col-span-full comic-card bg-white p-8 text-center">
                                <p className="text-2xl font-body text-gray-500">
                                    {selectedCourseIds.length === 0
                                        ? 'Select courses to see assignments!'
                                        : 'No assignments found. You\'re all caught up! 🎉'}
                                </p>
                            </div>
                        ) : (
                            filteredAssignments.map((assignment, idx) => {
                                const course = getCourseById(assignment.courseId);
                                const dueDate = assignment.dueDate
                                    ? new Date(
                                        assignment.dueDate.year,
                                        assignment.dueDate.month - 1,
                                        assignment.dueDate.day,
                                        assignment.dueTime?.hours || 23,
                                        assignment.dueTime?.minutes || 59
                                    )
                                    : null;
                                const urgency = getAssignmentUrgency(dueDate);

                                return (
                                    <motion.div
                                        key={assignment.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="comic-card bg-white p-6 group relative overflow-hidden"
                                    >
                                        <div className={`absolute top-0 right-0 px-4 py-2 ${urgencyColors[urgency]} font-comic text-sm uppercase transform rotate-3 shadow-comic-sm`}>
                                            {urgency === 'overdue' ? '⚠️ OVERDUE' : urgency === 'critical' ? '🔥 DUE SOON' : urgency === 'high' ? '⏰ URGENT' : '✓'}
                                        </div>

                                        <div className="pr-24">
                                            <h3 className="text-2xl font-comic text-comic-dark mb-2 group-hover:text-comic-blue transition-colors">
                                                {assignment.title}
                                            </h3>
                                            <p className="text-lg font-body font-bold text-gray-600 mb-3 flex items-center gap-2">
                                                <BookOpen size={18} />
                                                {course?.name || 'Unknown Course'}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4 flex-wrap mt-4">
                                            {dueDate && (
                                                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg border-2 border-black">
                                                    <Calendar size={18} className="stroke-[2.5]" />
                                                    <span className="font-body font-bold text-sm">
                                                        {dueDate.toLocaleDateString()} at{' '}
                                                        {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            )}
                                            {assignment.maxPoints && (
                                                <div className="flex items-center gap-2 bg-comic-yellow px-3 py-2 rounded-lg border-2 border-black">
                                                    <Award size={18} className="stroke-[2.5]" />
                                                    <span className="font-body font-bold text-sm">
                                                        {assignment.maxPoints} pts
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <a
                                            href={`https://classroom.google.com/c/${assignment.courseId}/a/${assignment.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-comic-red text-black px-4 py-2 rounded-lg border-2 border-black font-body font-bold hover:bg-red-600 transition-colors mt-4"
                                        >
                                            <ExternalLink size={18} />
                                            Submit in Classroom
                                        </a>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-5xl font-comic text-comic-dark mb-6 uppercase flex items-center gap-3">
                        <LinkIcon size={42} className="stroke-[3]" />
                        Course Materials
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMaterials.length === 0 ? (
                            <div className="col-span-full comic-card bg-white p-8 text-center">
                                <p className="text-2xl font-body text-gray-500">
                                    {selectedCourseIds.length === 0
                                        ? 'Select courses to see materials!'
                                        : 'No course materials available.'}
                                </p>
                            </div>
                        ) : (
                            filteredMaterials.map((material, idx) => {
                                const course = getCourseById(material.courseId);
                                return (
                                    <motion.div
                                        key={material.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        whileHover={{ scale: 1.05, rotate: -1 }}
                                        className="comic-card bg-gradient-to-br from-comic-blue to-blue-400 p-6 text-black"
                                    >
                                        <h3 className="text-xl font-comic mb-2">
                                            {material.title}
                                        </h3>
                                        <p className="text-sm font-body font-bold opacity-90 mb-4">
                                            {course?.name || 'Unknown Course'}
                                        </p>
                                        {material.materials && material.materials.length > 0 && (
                                            <div className="space-y-2">
                                                {material.materials.map((item, idx) => {
                                                    if (item.link) {
                                                        return (
                                                            <a
                                                                key={idx}
                                                                href={item.link.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block bg-white text-comic-blue px-3 py-2 rounded-lg border-2 border-black font-body font-bold text-sm hover:bg-comic-yellow hover:text-comic-dark transition-all transform hover:scale-105"
                                                            >
                                                                🔗 {item.link.title || 'Link'}
                                                            </a>
                                                        );
                                                    }
                                                    if (item.driveFile) {
                                                        return (
                                                            <a
                                                                key={idx}
                                                                href={item.driveFile.driveFile.alternateLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block bg-white text-comic-blue px-3 py-2 rounded-lg border-2 border-black font-body font-bold text-sm hover:bg-comic-yellow hover:text-comic-dark transition-all transform hover:scale-105"
                                                            >
                                                                📄 {item.driveFile.driveFile.title}
                                                            </a>
                                                        );
                                                    }
                                                    if (item.youtubeVideo) {
                                                        return (
                                                            <a
                                                                key={idx}
                                                                href={item.youtubeVideo.alternateLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block bg-white text-comic-blue px-3 py-2 rounded-lg border-2 border-black font-body font-bold text-sm hover:bg-comic-yellow hover:text-comic-dark transition-all transform hover:scale-105"
                                                            >
                                                                🎥 {item.youtubeVideo.title}
                                                            </a>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </motion.section>
            </div>
        </div>
    );
};
