// components/ToastMessage.tsx
import React from 'react';

interface ToastMessageProps {
    show: boolean;
    message: string;
    type: 'success' | 'error';
}

const ToastMessage: React.FC<ToastMessageProps> = ({ show, message, type }) => {
    if (!show) return null;

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`fixed bottom-5 right-5 ${bgColor} text-white py-3 px-4 rounded-md shadow-lg transition-opacity duration-300 ease-in-out`}>
            {message}
        </div>
    );
};

export default ToastMessage;