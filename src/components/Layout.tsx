import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, LogOut, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { NotificationManager } from './NotificationManager';

const NavItem = ({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) => (
    <Link to={to} className="relative group block mb-4">
        <div className={`p-4 rounded-xl border-4 border-black transition-all duration-200 ${active
            ? 'bg-comic-yellow shadow-none translate-x-1 translate-y-1'
            : 'bg-white shadow-comic-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1'
            }`}>
            <Icon size={28} className={`stroke-[2.5] ${active ? 'text-black' : 'text-comic-dark'}`} />
        </div>
        <span className={`absolute left-20 top-1/2 -translate-y-1/2 bg-white text-black text-sm font-comic tracking-wider px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border-2 border-black shadow-lg z-50`}>
            {label}
        </span>
    </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const { logout } = useAppStore();

    return (
        <div className="flex h-screen bg-comic-paper overflow-hidden font-body">
            <NotificationManager />
            <motion.nav
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                className="w-24 m-4 mr-0 flex flex-col items-center py-8 bg-white border-4 border-black rounded-3xl shadow-comic z-50"
            >
                <Link to="/" className="mb-10 block">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 rounded-full border-4 border-black flex items-center justify-center shadow-comic-sm overflow-hidden cursor-pointer"
                        style={{ backgroundColor: '#8B7355' }}
                    >
                        <img src="/sloth.svg" alt="ADHD Dashboard Logo" className="w-full h-full object-cover" />
                    </motion.div>
                </Link>

                <div className="flex flex-col flex-1 w-full px-4 items-center">
                    <NavItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} />
                    <NavItem to="/classroom" icon={GraduationCap} label="Classroom" active={location.pathname === '/classroom'} />
                    <NavItem to="/calendar" icon={Calendar} label="Calendar" active={location.pathname === '/calendar'} />
                </div>

                <div className="flex flex-col w-full px-4 items-center gap-4">

                    <button
                        onClick={logout}
                        className="p-4 rounded-xl bg-comic-red border-4 border-black text-white shadow-comic-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all w-full flex justify-center"
                    >
                        <LogOut size={24} className="stroke-[3]" />
                    </button>
                </div>
            </motion.nav>

            <main className="flex-1 p-6 overflow-hidden">
                <div className="h-full rounded-3xl bg-white border-4 border-black shadow-comic overflow-auto relative p-2">
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                        backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
                        backgroundSize: '20px 20px'
                    }} />
                    {children}
                </div>
            </main>
        </div>
    );
};
