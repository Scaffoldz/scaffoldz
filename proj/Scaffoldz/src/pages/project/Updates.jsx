import { useState } from 'react';
import { Camera, Upload } from 'lucide-react';

const Updates = () => {
    const [updateText, setUpdateText] = useState('');
    const [updates, setUpdates] = useState([
        { id: 1, text: 'Completed foundation pouring for Block A.', date: '2024-02-18', image: true },
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!updateText.trim()) return;
        setUpdates([{ id: Date.now(), text: updateText, date: new Date().toISOString().split('T')[0], image: false }, ...updates]);
        setUpdateText('');
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Site Updates</h2>

            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status Update</label>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        rows="3"
                        placeholder="What happened on site today?"
                        value={updateText}
                        onChange={(e) => setUpdateText(e.target.value)}
                    ></textarea>
                </div>

                <div className="flex justify-between items-center">
                    <button type="button" className="text-gray-500 hover:text-blue-600 flex items-center gap-2 text-sm transition-colors">
                        <Camera size={18} />
                        Attach Photo
                    </button>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <Upload size={18} />
                        Post Update
                    </button>
                </div>
            </form>

            <div className="space-y-6">
                {updates.map((update) => (
                    <div key={update.id} className="flex gap-4">
                        <div className="flex-col items-center hidden md:flex">
                            <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                            <div className="w-0.5 bg-gray-200 h-full my-1"></div>
                        </div>
                        <div className="flex-1 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                            <p className="text-sm text-gray-400 mb-1">{update.date}</p>
                            <p className="text-gray-800">{update.text}</p>
                            {update.image && (
                                <div className="mt-3 w-40 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                                    [Image Placeholder]
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Updates;
