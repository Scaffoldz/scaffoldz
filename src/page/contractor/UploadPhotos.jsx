import { useState } from "react";

function UploadPhotos() {
    const [photos] = useState([
        { id: 1, url: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=400&q=80", date: "2024-02-14", tag: "Foundation" },
        { id: 2, url: "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&w=400&q=80", date: "2024-02-13", tag: "Column Work" },
        { id: 3, url: "https://images.unsplash.com/photo-1531834357213-9a3b6f272782?auto=format&fit=crop&w=400&q=80", date: "2024-02-12", tag: "Site Clearing" },
    ]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Site Progress Photos</h1>
                    <p className="text-gray-500 mt-1">Upload and organize site images for management review.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition-all border border-gray-200">
                        Create Album
                    </button>
                    <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-md">
                        Upload Image
                    </button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 transition-all cursor-pointer group flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center text-primary text-2xl group-hover:bg-primary/10 transition-colors">
                    +
                </div>
                <div className="text-center">
                    <p className="font-bold text-gray-700">Drag and drop images here</p>
                    <p className="text-sm text-gray-500">Or click to browse from your device. Max file size: 10MB.</p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-gray-800 uppercase text-xs tracking-widest px-1">Recent Uploads</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {photos.map((photo) => (
                        <div key={photo.id} className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                            <img
                                src={photo.url}
                                alt={photo.tag}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="p-3">
                                <p className="font-bold text-gray-800 text-sm">{photo.tag}</p>
                                <p className="text-xs text-gray-500">{photo.date}</p>
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="bg-white/90 p-1.5 rounded-full shadow-sm text-red-500 hover:text-red-700 transition-colors">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                    {/* Placeholder for expansion */}
                    <div className="h-full min-h-[12rem] bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400 font-bold text-sm">
                        + 42 more
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UploadPhotos;
