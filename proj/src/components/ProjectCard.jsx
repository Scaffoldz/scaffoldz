import { useNavigate } from 'react-router-dom'
import { Calendar, DollarSign, TrendingUp } from 'lucide-react'

function ProjectCard({ project }) {
    const navigate = useNavigate()

    const getStatusColor = (status) => {
        const colors = {
            'Submitted': 'status-submitted',
            'Under Review': 'status-review',
            'Under Construction': 'status-construction',
            'Completed': 'status-completed'
        }
        return colors[status] || 'status-submitted'
    }

    const formatBudget = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="project-card glass-card">
            <div className="project-card-header">
                <h3 className="project-card-title">{project.title}</h3>
                <span className={`project-status-badge ${getStatusColor(project.status)}`}>
                    {project.status}
                </span>
            </div>

            <div className="project-card-body">
                <div className="project-card-info">
                    <Calendar size={16} />
                    <span className="text-secondary">
                        Target: {new Date(project.expectedCompletion).toLocaleDateString('en-IN')}
                    </span>
                </div>

                <div className="project-card-info">
                    <DollarSign size={16} />
                    <span className="text-secondary">
                        Budget: {formatBudget(project.budget)}
                    </span>
                </div>

                <div className="project-card-progress">
                    <div className="progress-header">
                        <span className="text-secondary">Progress</span>
                        <span className="text-primary">{project.progress}%</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${project.progress}%` }}
                        />
                    </div>
                </div>
            </div>

            <button
                className="btn btn-secondary"
                onClick={() => navigate(`/project/${project.id}`)}
            >
                View Details
            </button>
        </div>
    )
}

export default ProjectCard
