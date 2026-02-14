import { TrendingUp, FolderKanban, CheckCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardStats, projects } from '../data/dummyData';
import ProjectCard from '../components/ui/ProjectCard';

export default function Dashboard() {
    const stats = [
        { label: 'Total Projects', value: dashboardStats.totalProjects, icon: FolderKanban, color: 'text-blue-600 bg-blue-50' },
        { label: 'Active Projects', value: dashboardStats.activeProjects, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
        { label: 'Completed Tasks', value: `${dashboardStats.completedTasks}/${dashboardStats.totalTasks}`, icon: CheckCircle, color: 'text-purple-600 bg-purple-50' },
        { label: 'Team Members', value: dashboardStats.teamMembers, icon: Users, color: 'text-orange-600 bg-orange-50' },
    ];

    const activeProjects = projects.filter(p => p.status === 'Active').slice(0, 3);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's your project overview.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="card">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Active Projects */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Active Projects</h2>
                    <Link to="/projects" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        View all →
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeProjects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>

            {/* Activity Feed */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900"><span className="font-medium">Sarah J.</span> completed task in Website Redesign</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900"><span className="font-medium">Mike T.</span> updated Customer Portal progress</p>
                            <p className="text-xs text-gray-500">5 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900"><span className="font-medium">Alex W.</span> started new task in Mobile App Development</p>
                            <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
