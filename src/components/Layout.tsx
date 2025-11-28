import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, LogOut, GraduationCap, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { NotificationManager } from './NotificationManager';

const NavItem = ({ to, icon: Icon, label, active, onClick }: { to: string; icon: any; label: string; active: boolean; onClick?: () => void }) => (
    <Link to={to} className="relative group block mb-4 w-full" onClick={onClick}>
        <div className={`p-4 rounded-xl border-4 border-black transition-all duration-200 ${active
            ? 'bg-comic-yellow shadow-none translate-x-1 translate-y-1'
            : 'bg-white shadow-comic-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1'
            }`}>
            <div className="flex items-center gap-3">
                <Icon size={28} className={`stroke-[2.5] ${active ? 'text-black' : 'text-comic-dark'}`} />
                <span className="font-comic text-lg lg:hidden">{label}</span>
            </div>
        </div>
        <span className={`hidden lg:block absolute left-20 top-1/2 -translate-y-1/2 bg-white text-black text-sm font-comic tracking-wider px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border-2 border-black shadow-lg z-50`}>
            {label}
        </span>
    </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const { logout } = useAppStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <div className="flex h-screen bg-comic-paper overflow-hidden font-body">
            <NotificationManager />

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black p-4 flex items-center justify-between shadow-comic">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-4 border-black flex items-center justify-center shadow-comic-sm overflow-hidden" style={{ backgroundColor: '#8B7355' }}>
                        <img src="/sloth.svg" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-2xl font-comic text-comic-dark uppercase">Zanshin</h1>
                </Link>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-3 rounded-xl bg-comic-yellow border-4 border-black shadow-comic-sm active:shadow-none active:translate-x-1 active:translate-y-1"
                >
                    {mobileMenuOpen ? <X size={24} className="stroke-[3]" /> : <Menu size={24} className="stroke-[3]" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMobileMenu}
                            className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        />
                        <motion.nav
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="lg:hidden fixed top-0 left-0 bottom-0 w-80 bg-white border-r-4 border-black shadow-comic z-50 flex flex-col p-6"
                        >
                            <Link to="/" className="mb-8 flex items-center gap-3" onClick={closeMobileMenu}>
                                <div className="w-16 h-16 rounded-full border-4 border-black flex items-center justify-center shadow-comic-sm overflow-hidden" style={{ backgroundColor: '#8B7355' }}>
                                    <img src="/sloth.svg" alt="Logo" className="w-full h-full object-cover" />
                                </div>
                                <h1 className="text-3xl font-comic text-comic-dark uppercase">Zanshin</h1>
                            </Link>

                            <div className="flex flex-col flex-1">
                                <NavItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} onClick={closeMobileMenu} />
                                <NavItem to="/classroom" icon={GraduationCap} label="Classroom" active={location.pathname === '/classroom'} onClick={closeMobileMenu} />
                                <NavItem to="/calendar" icon={Calendar} label="Calendar" active={location.pathname === '/calendar'} onClick={closeMobileMenu} />
                            </div>

                            <button
                                onClick={() => {
                                    logout();
                                    closeMobileMenu();
                                }}
                                className="p-4 rounded-xl bg-comic-red border-4 border-black text-black shadow-comic-sm active:shadow-none active:translate-x-1 active:translate-y-1 transition-all w-full flex items-center justify-center gap-3"
                            >
                                <LogOut size={24} className="stroke-[3]" />
                                <span className="font-comic text-lg">Logout</span>
                            </button>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <motion.nav
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                className="hidden lg:flex w-24 m-4 mr-0 flex-col items-center py-8 bg-white border-4 border-black rounded-3xl shadow-comic z-50"
            >
                <Link to="/" className="mb-10 block">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 rounded-full border-4 border-black flex items-center justify-center shadow-comic-sm overflow-hidden cursor-pointer"
                        style={{ backgroundColor: '#8B7355' }}
                    >
                        <img src="/sloth.svg" alt="Zanshin Logo" className="w-full h-full object-cover" />
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
                        className="p-4 rounded-xl bg-comic-red border-4 border-black text-black shadow-comic-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all w-full flex justify-center"
                    >
                        <LogOut size={24} className="stroke-[3]" />
                    </button>
                </div>
            </motion.nav>

            <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-hidden pt-20 lg:pt-6">
                <div className="h-full rounded-2xl sm:rounded-3xl bg-white border-4 border-black shadow-comic overflow-auto relative p-2">
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
