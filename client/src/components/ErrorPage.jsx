import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export const ErrorPage = () => {
    const navigate = useNavigate();
    
    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="max-w-md text-center">
                <figure className="mb-6">
                    <img 
                        src="https://imgs.search.brave.com/NCUZZMMo6u2nSgVHiIQM_oq5AXzjAEz12w5NBdNcLRc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9naWZk/Yi5jb20vaW1hZ2Vz/L2hpZ2gvZXJyb3It/NDA0LW5vLW9uZS1p/cy1oZXJlLWVzZnp5/ODczZjJqd3Nibjcu/Z2lm.gif" 
                        alt="404 Error"
                        className="mx-auto rounded-lg shadow-lg"
                    />
                </figure>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Oops! Page not found</h1>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Chal ab nikal !!</h1>
                <p className="text-lg text-gray-600 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <NavLink 
                        to="/" 
                        className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors text-center"
                    >
                        Go to Home Page
                    </NavLink>
                    <button 
                        onClick={handleGoBack} 
                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};