import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <p className="text-xl text-gray-600 mt-4 mb-8">Oops! Page not found.</p>
            <Link to="/" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition">
                Return to Chat
            </Link>
        </div>
    );
};

export default NotFound;
