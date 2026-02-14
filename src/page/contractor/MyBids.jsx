function MyBids() {
    const availableProjects = [
        { id: 101, title: "Metro Station Renovation", location: "Sector 18", budget: "₹ 45L - 50L" },
        { id: 102, title: "Highway Barrier Install", location: "Expressway", budget: "₹ 12L - 15L" },
    ];

    return (
        <div className="space-y-8 animate-fade-in p-8">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-primary">Tender Opportunities</h1>
                <p className="text-gray-500 mt-1">Browse and submit bids for new projects.</p>
            </div>

            <div className="space-y-4">
                {availableProjects.map((project) => (
                    <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center group hover:border-accent/50 transition-all">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors">{project.title}</h3>
                            <p className="text-sm text-gray-500">📍 {project.location} • 💰 {project.budget}</p>
                        </div>
                        <button className="px-6 py-2 bg-gray-800 text-white rounded-md font-bold hover:bg-primary transition-colors">
                            Submit Bid
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyBids;
