import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
    const { onLogout } = useAuth();

    return (
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
            <h1 className="text-2xl font-bold text-gray-800">Task Manager Dashboard</h1>
            <button onClick={onLogout} className="px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600">
                Logout
            </button>
        </header>
    );
};

export default Header;
