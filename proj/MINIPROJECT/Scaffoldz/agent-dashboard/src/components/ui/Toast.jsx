import { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const variants = {
        success: {
            bg: 'bg-green-50 border-green-200',
            text: 'text-green-800',
            icon: <CheckCircle size={20} className="text-green-600" />
        },
        error: {
            bg: 'bg-red-50 border-red-200',
            text: 'text-red-800',
            icon: <XCircle size={20} className="text-red-600" />
        },
        info: {
            bg: 'bg-blue-50 border-blue-200',
            text: 'text-blue-800',
            icon: <Info size={20} className="text-blue-600" />
        }
    };

    const variant = variants[type];

    return (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-soft-lg animate-slide-in ${variant.bg}`}>
            {variant.icon}
            <p className={`text-sm font-medium ${variant.text}`}>{message}</p>
            <button
                onClick={onClose}
                className={`ml-2 ${variant.text} hover:opacity-70 transition-opacity`}
            >
                ×
            </button>
        </div>
    );
}
