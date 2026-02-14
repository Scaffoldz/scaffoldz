function UploadPhotos() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-primary">Site Photos</h1>
                <p className="text-gray-500 mt-1">Upload progress pictures for management review.</p>
            </div>

            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-6xl opacity-20">📷</span>
                <h3 className="text-xl font-bold text-gray-700">Photo Upload Placeholder</h3>
                <p className="text-gray-500 max-w-md">
                    Drag and drop site images here. Tag them by location and date.
                </p>
                <div className="w-full max-w-lg h-64 bg-gray-50 rounded-lg border-2 border-dashed border-accent flex flex-col items-center justify-center text-accent/50 mt-6 hover:bg-accent/5 transition-colors cursor-pointer">
                    <span className="text-4xl mb-2">☁️</span>
                    <span>Click to Upload</span>
                </div>
            </div>
        </div>
    );
}

export default UploadPhotos;
