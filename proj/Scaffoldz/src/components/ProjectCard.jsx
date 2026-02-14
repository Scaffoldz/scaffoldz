import { Link } from 'react-router-dom';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

const ProjectCard = ({ project }) => {
    return (
        <Link
            to={`/project/${project.id}`}
            className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                        <MapPin size={16} className="mr-1" />
                        {project.location}
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                    }`}>
                    {project.status}
                </span>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Budget</span>
                    <div className="flex items-center font-medium">
                        <DollarSign size={14} />
                        {project.totalBudget.toLocaleString()}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium text-blue-600">{project.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${project.progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {project.timelineStart}
                    </div>
                    <div>
                        To: {project.timelineEnd}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProjectCard;
