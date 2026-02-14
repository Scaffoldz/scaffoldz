import { useState } from 'react';
import { Moon, Sun, Bell, User } from 'lucide-react';
import { userProfile } from '../data/dummyData';

export default function Settings() {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-600">Manage your account and application preferences.</p>
            </div>

            <div className="max-w-2xl space-y-6">
                {/* Profile */}
                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <User size={20} className="text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                defaultValue={userProfile.name}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                defaultValue={userProfile.email}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                            <input
                                type="text"
                                defaultValue={userProfile.role}
                                className="input-field"
                            />
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        {darkMode ? <Moon size={20} className="text-gray-600" /> : <Sun size={20} className="text-gray-600" />}
                        <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-gray-900">Dark Mode</div>
                            <div className="text-sm text-gray-600">Toggle between light and dark theme</div>
                        </div>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary-600' : 'bg-gray-300'
                                }`}
                        >
                            <div
                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'transform translate-x-6' : ''
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <Bell size={20} className="text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-gray-900">Email Notifications</div>
                                <div className="text-sm text-gray-600">Receive updates via email</div>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-primary-600' : 'bg-gray-300'
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications ? 'transform translate-x-6' : ''
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div>
                                <div className="font-medium text-gray-900">Push Notifications</div>
                                <div className="text-sm text-gray-600">Get notified on your device</div>
                            </div>
                            <button className="relative w-12 h-6 rounded-full bg-primary-600">
                                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transform translate-x-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Save button */}
                <div className="flex justify-end">
                    <button className="btn-primary">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
