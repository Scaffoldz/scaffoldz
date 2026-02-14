import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SummaryCard from '../components/SummaryCard'
import ProjectCard from '../components/ProjectCard'
import { FolderKanban, FolderClock, FolderCheck, AlertCircle, Plus } from 'lucide-react'

function CustomerDashboard() {
    const navigate = useNavigate()
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects', {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch projects')
            }

            const data = await response.json()
            setProjects(data.projects || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const stats = {
        total: projects.length,
        active: projects.filter(p => p.status === 'Under Construction').length,
        completed: projects.filter(p => p.status === 'Completed').length,
        pending: projects.filter(p => p.status === 'Submitted' || p.status === 'Under Review').length
    }

    return (
        <div className="dashboard">
            <Navbar />

            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>My Projects</h1>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/create-project')}
                    >
                        <Plus size={20} />
                        Create New Project
                    </button>
                </div>

                <div className="summary-cards-grid">
                    <SummaryCard
                        icon={FolderKanban}
                        title="Total Projects"
                        value={stats.total}
                        color="primary"
                    />
                    <SummaryCard
                        icon={FolderClock}
                        title="Active Projects"
                        value={stats.active}
                        color="warning"
                    />
                    <SummaryCard
                        icon={FolderCheck}
                        title="Completed"
                        value={stats.completed}
                        color="success"
                    />
                    <SummaryCard
                        icon={AlertCircle}
                        title="Pending Approvals"
                        value={stats.pending}
                        color="info"
                    />
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {loading ? (
                    <div className="loading-container">
                        <span className="spinner"></span>
                        <p>Loading projects...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="empty-state">
                        <FolderKanban size={64} />
                        <h3>No Projects Yet</h3>
                        <p>Create your first construction project to get started</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/create-project')}
                        >
                            <Plus size={20} />
                            Create New Project
                        </button>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {projects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CustomerDashboard
