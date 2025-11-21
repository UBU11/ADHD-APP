import { useAppStore } from '../store/useAppStore';
import { Bell, Moon, Palette } from 'lucide-react';

export const Settings = () => {
    const { logout } = useAppStore();

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Bell size={20} /></div>
                        <div>
                            <div className="font-semibold">Notifications</div>
                            <div className="text-sm text-gray-500">Manage alerts and reminders</div>
                        </div>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-green-400 cursor-pointer">
                        <span className="absolute left-6 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out shadow-sm"></span>
                    </div>
                </div>

                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Palette size={20} /></div>
                        <div>
                            <div className="font-semibold">Theme</div>
                            <div className="text-sm text-gray-500">Customize colors and appearance</div>
                        </div>
                    </div>
                    <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm">
                        <option>Light</option>
                        <option>Dark</option>
                        <option>System</option>
                    </select>
                </div>

                <div className="p-6 flex items-center justify-between opacity-50 pointer-events-none">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-50 text-gray-600 rounded-lg"><Moon size={20} /></div>
                        <div>
                            <div className="font-semibold">Focus Mode</div>
                            <div className="text-sm text-gray-500">Configure timer settings</div>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={logout}
                className="mt-8 w-full py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
            >
                Sign Out
            </button>
        </div>
    );
};
