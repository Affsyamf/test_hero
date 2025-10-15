import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from "react-router-dom";


//komponen latar
const GridPattern = () => (
    <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
        <svg className="absolute inset-0 h-full w-full opacity-10">
            <defs>
                <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
    </div>
);

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { onLogin, error, isLoading } = useAuth();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await onLogin(username, password);
    navigate("/dashboard"); 
  } catch (error) {
    console.error("Login failed:", error);
  }
};

    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden text-gray-200">
            <GridPattern />
            
            <div 
                className={`relative w-full max-w-md p-8 m-4 space-y-8 bg-gray-900/60 border border-purple-500/20 rounded-2xl shadow-2xl backdrop-blur-lg transition-all duration-700 ease-in-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                {/* efek border */}
                <div className="absolute -top-px left-20 right-11 h-px bg-gradient-to-r from-purple-500/0 via-purple-500/40 to-purple-500/0"></div>
                <div className="absolute -bottom-px left-11 right-20 h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0"></div>
                
                <div className="relative z-10 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gray-800 border border-purple-500/30 rounded-full shadow-inner">
                            <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">Login untuk mengelola tugas Anda</p>
                </div>
                
                <form className="relative z-10 space-y-6" onSubmit={handleSubmit}>
                    <div className="relative flex items-center">
                         <svg className="absolute w-5 h-5 ml-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full py-3 pl-12 pr-4 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                            required
                        />
                    </div>
                    <div className="relative flex items-center">
                        <svg className="absolute w-5 h-5 ml-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full py-3 pl-12 pr-4 text-gray-200 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                            required
                        />
                    </div>
                    
                    {error && <p className="text-sm font-semibold text-center text-red-400 animate-pulse">{error}</p>}
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 font-bold text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg shadow-lg hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Memproses...
                            </div>
                        ) : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

