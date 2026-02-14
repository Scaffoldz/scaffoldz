import { useState } from 'react';
import { Save } from 'lucide-react';

const InternalNotes = () => {
    const [note, setNote] = useState('');
    const [savedNotes, setSavedNotes] = useState([
        { id: 1, text: 'Discuss budget overrun with client next week.', date: '2024-02-10' },
        { id: 2, text: 'Contractor requested more cement supplies.', date: '2024-02-15' },
    ]);

    const handleSave = () => {
        if (!note.trim()) return;
        const newNote = {
            id: Date.now(),
            text: note,
            date: new Date().toISOString().split('T')[0]
        };
        setSavedNotes([newNote, ...savedNotes]);
        setNote('');
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Internal Management Notes</h2>

            <div className="mb-8">
                <textarea
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    rows="4"
                    placeholder="Add a private note..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                ></textarea>
                <div className="flex justify-end mt-2">
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                        disabled={!note.trim()}
                    >
                        <Save size={18} />
                        Save Note
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {savedNotes.map((note) => (
                    <div key={note.id} className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                        <p className="text-gray-800">{note.text}</p>
                        <p className="text-xs text-gray-400 mt-2">{note.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InternalNotes;
