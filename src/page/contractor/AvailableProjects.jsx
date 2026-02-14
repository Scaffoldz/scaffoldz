import { Link } from "react-router-dom";

function AvailableProjects() {
    const projects = [
        { title: "Metro Station Renovation", location: "Sector 18", type: "Civil", budget: "₹ 45L", deadline: "2024-04-01" },
        { title: "Highway Barrier Install", location: "Expressway", type: "Road", budget: "₹ 12L", deadline: "2024-03-20" },
        { title: "School Building Painting", location: "Old City", type: "Finishing", budget: "₹ 5L", deadline: "2024-03-15" },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-primary">Available Projects</h1>
                <p className="text-gray-500 mt-1">Browse and bid on open construction tenders.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">{p.title}</h3>
                                <p className="text-xs text-gray-500 mt-1">📍 {p.location}</p>
                            </div>
                            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">{p.type}</span>
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Budget:</span>
                                <span className="font-bold text-gray-700">{p.budget}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Deadline:</span>
                                <span className="font-bold text-gray-700">{p.deadline}</span>
                            </div>
                        </div>

                        <button className="w-full py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-sm">
                            Place Bid Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AvailableProjects;
