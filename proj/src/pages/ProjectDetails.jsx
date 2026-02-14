import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
    ArrowLeft,
    Calendar,
    DollarSign,
    Users,
    Package,
    Building2,
    FileText,
    AlertTriangle,
    Star
} from 'lucide-react'

function ProjectDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('timeline')
    const [showIssueModal, setShowIssueModal] = useState(false)
    const [showFeedbackModal, setShowFeedbackModal] = useState(false)

    useEffect(() => {
        fetchProjectDetails()
    }, [id])

    const fetchProjectDetails = async () => {
        try {
            const response = await fetch(`/api/projects/${id}`)

            if (!response.ok) {
                throw new Error('Failed to fetch project details')
            }

            const data = await response.json()
            setProject(data.project)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="dashboard">
                <Navbar />
                <div className="dashboard-container loading-container">
                    <span className="spinner"></span>
                    <p>Loading project details...</p>
                </div>
            </div>
        )
    }

    if (error || !project) {
        return (
            <div className="dashboard">
                <Navbar />
                <div className="dashboard-container">
                    <div className="alert alert-error">{error || 'Project not found'}</div>
                    <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard">
            <Navbar />

            <div className="dashboard-container">
                <button
                    className="btn-link"
                    onClick={() => navigate('/dashboard')}
                    style={{ marginBottom: '1rem' }}
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </button>

                <div className="project-details-header glass-card">
                    <div>
                        <h1>{project.title}</h1>
                        <p className="text-secondary">{project.address}</p>
                    </div>
                    <span className={`project-status-badge status-${project.status.toLowerCase().replace(' ', '-')}`}>
                        {project.status}
                    </span>
                </div>

                <div className="project-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowIssueModal(true)}
                    >
                        <AlertTriangle size={18} />
                        Raise Issue
                    </button>
                    {project.status === 'Completed' && (
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowFeedbackModal(true)}
                        >
                            <Star size={18} />
                            Give Feedback
                        </button>
                    )}
                </div>

                <div className="project-tabs">
                    <div className="tabs-header">
                        <button
                            className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
                            onClick={() => setActiveTab('timeline')}
                        >
                            <Calendar size={18} />
                            Timeline
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
                            onClick={() => setActiveTab('budget')}
                        >
                            <DollarSign size={18} />
                            Budget
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
                            onClick={() => setActiveTab('resources')}
                        >
                            <Users size={18} />
                            Labour & Materials
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'digital-twin' ? 'active' : ''}`}
                            onClick={() => setActiveTab('digital-twin')}
                        >
                            <Building2 size={18} />
                            Digital Twin
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reports')}
                        >
                            <FileText size={18} />
                            Daily Reports
                        </button>
                    </div>

                    <div className="tabs-content">
                        {activeTab === 'timeline' && <TimelineTab project={project} />}
                        {activeTab === 'budget' && <BudgetTab project={project} />}
                        {activeTab === 'resources' && <ResourcesTab project={project} />}
                        {activeTab === 'digital-twin' && <DigitalTwinTab project={project} />}
                        {activeTab === 'reports' && <ReportsTab project={project} />}
                    </div>
                </div>
            </div>

            {showIssueModal && (
                <IssueModal
                    projectId={id}
                    onClose={() => setShowIssueModal(false)}
                    onSuccess={fetchProjectDetails}
                />
            )}

            {showFeedbackModal && (
                <FeedbackModal
                    projectId={id}
                    onClose={() => setShowFeedbackModal(false)}
                    onSuccess={fetchProjectDetails}
                />
            )}
        </div>
    )
}

// Timeline Tab Component
function TimelineTab({ project }) {
    const stages = project.stages || [
        { name: 'Foundation', status: 'completed', progress: 100, expectedDate: '2026-01-15', actualDate: '2026-01-14' },
        { name: 'Structure', status: 'completed', progress: 100, expectedDate: '2026-02-10', actualDate: '2026-02-12' },
        { name: 'Walls', status: 'in-progress', progress: 65, expectedDate: '2026-03-01', actualDate: null },
        { name: 'Roof', status: 'pending', progress: 0, expectedDate: '2026-03-20', actualDate: null },
        { name: 'Finishing', status: 'pending', progress: 0, expectedDate: '2026-04-15', actualDate: null }
    ]

    return (
        <div className="timeline-container glass-card">
            <div className="timeline">
                {stages.map((stage, index) => (
                    <div key={index} className={`timeline-item ${stage.status}`}>
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                            <h4>{stage.name}</h4>
                            <div className="timeline-dates">
                                <span className="text-secondary">
                                    Expected: {new Date(stage.expectedDate).toLocaleDateString('en-IN')}
                                </span>
                                {stage.actualDate && (
                                    <span className="text-primary">
                                        Completed: {new Date(stage.actualDate).toLocaleDateString('en-IN')}
                                    </span>
                                )}
                            </div>
                            {stage.status === 'in-progress' && (
                                <div className="stage-progress">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${stage.progress}%` }}
                                        />
                                    </div>
                                    <span className="text-secondary">{stage.progress}% complete</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Budget Tab Component
function BudgetTab({ project }) {
    const budgetData = project.budgetBreakdown || {
        estimated: project.budget,
        spent: Math.floor(project.budget * (project.progress / 100)),
        categories: [
            { name: 'Labour', estimated: project.budget * 0.4, spent: project.budget * 0.35 },
            { name: 'Materials', estimated: project.budget * 0.45, spent: project.budget * 0.40 },
            { name: 'Equipment', estimated: project.budget * 0.15, spent: project.budget * 0.10 }
        ]
    }

    const remaining = budgetData.estimated - budgetData.spent

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="budget-container glass-card">
            <div className="budget-summary">
                <div className="budget-card">
                    <h4 className="text-secondary">Estimated Budget</h4>
                    <p className="budget-value">{formatCurrency(budgetData.estimated)}</p>
                </div>
                <div className="budget-card">
                    <h4 className="text-secondary">Spent</h4>
                    <p className="budget-value spent">{formatCurrency(budgetData.spent)}</p>
                </div>
                <div className="budget-card">
                    <h4 className="text-secondary">Remaining</h4>
                    <p className="budget-value remaining">{formatCurrency(remaining)}</p>
                </div>
            </div>

            <div className="budget-breakdown">
                <h3>Budget Breakdown by Category</h3>
                {budgetData.categories.map((category, index) => (
                    <div key={index} className="budget-category">
                        <div className="budget-category-header">
                            <span>{category.name}</span>
                            <span>{formatCurrency(category.spent)} / {formatCurrency(category.estimated)}</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${(category.spent / category.estimated) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Resources Tab Component
function ResourcesTab({ project }) {
    const resources = project.resources || {
        labour: { total: 45, active: 32 },
        materials: [
            { name: 'Cement (bags)', quantity: 500, unit: 'bags' },
            { name: 'Steel (tons)', quantity: 12, unit: 'tons' },
            { name: 'Bricks', quantity: 50000, unit: 'pieces' },
            { name: 'Sand (cubic meters)', quantity: 150, unit: 'm³' }
        ]
    }

    return (
        <div className="resources-container glass-card">
            <div className="resources-section">
                <h3><Users size={20} /> Labour Statistics</h3>
                <div className="resource-stats">
                    <div className="stat-card">
                        <h4>Total Workers</h4>
                        <p className="stat-value">{resources.labour.total}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Active Today</h4>
                        <p className="stat-value">{resources.labour.active}</p>
                    </div>
                </div>
            </div>

            <div className="resources-section">
                <h3><Package size={20} /> Materials Used</h3>
                <div className="materials-list">
                    {resources.materials.map((material, index) => (
                        <div key={index} className="material-item">
                            <span className="material-name">{material.name}</span>
                            <span className="material-quantity">
                                {material.quantity.toLocaleString()} {material.unit}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Digital Twin Tab Component
function DigitalTwinTab({ project }) {
    const [selectedStage, setSelectedStage] = useState(0)

    const stages = [
        { name: 'Foundation', image: '🏗️', description: 'Foundation and groundwork completed' },
        { name: 'Structure', image: '🏛️', description: 'Main structural framework erected' },
        { name: 'Walls', image: '🧱', description: 'Wall construction in progress' },
        { name: 'Roof', image: '🏠', description: 'Roofing work pending' },
        { name: 'Finishing', image: '✨', description: 'Interior and exterior finishing' }
    ]

    return (
        <div className="digital-twin-container glass-card">
            <div className="twin-viewer">
                <div className="twin-visual">
                    <div className="twin-stage-icon">{stages[selectedStage].image}</div>
                    <h3>{stages[selectedStage].name}</h3>
                    <p className="text-secondary">{stages[selectedStage].description}</p>
                </div>
            </div>

            <div className="twin-stages">
                {stages.map((stage, index) => (
                    <button
                        key={index}
                        className={`twin-stage-btn ${selectedStage === index ? 'active' : ''}`}
                        onClick={() => setSelectedStage(index)}
                    >
                        <span className="stage-icon">{stage.image}</span>
                        <span className="stage-name">{stage.name}</span>
                    </button>
                ))}
            </div>

            <div className="alert alert-info" style={{ marginTop: '1rem' }}>
                💡 Digital twin visualization is a simplified representation. Full 3D model coming soon!
            </div>
        </div>
    )
}

// Reports Tab Component
function ReportsTab({ project }) {
    const reports = project.dailyReports || [
        {
            id: 1,
            date: '2026-02-13',
            description: 'Wall construction progressing well. Completed north and east sides.',
            areaCovered: '250 sq ft',
            materialsUsed: 'Bricks: 5000, Cement: 50 bags',
            photos: ['📸', '📸', '📸']
        },
        {
            id: 2,
            date: '2026-02-12',
            description: 'Started wall construction on the north side. Weather conditions good.',
            areaCovered: '180 sq ft',
            materialsUsed: 'Bricks: 3500, Cement: 35 bags',
            photos: ['📸', '📸']
        }
    ]

    return (
        <div className="reports-container glass-card">
            {reports.length === 0 ? (
                <div className="empty-state">
                    <FileText size={48} />
                    <p>No daily reports available yet</p>
                </div>
            ) : (
                <div className="reports-list">
                    {reports.map(report => (
                        <div key={report.id} className="report-item">
                            <div className="report-header">
                                <h4>{new Date(report.date).toLocaleDateString('en-IN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</h4>
                            </div>
                            <p className="report-description">{report.description}</p>
                            <div className="report-details">
                                <div className="report-detail">
                                    <strong>Area Covered:</strong> {report.areaCovered}
                                </div>
                                <div className="report-detail">
                                    <strong>Materials Used:</strong> {report.materialsUsed}
                                </div>
                            </div>
                            <div className="report-photos">
                                {report.photos.map((photo, index) => (
                                    <div key={index} className="photo-placeholder">
                                        {photo}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// Issue Modal Component
function IssueModal({ projectId, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        priority: 'medium'
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetch(`/api/projects/${projectId}/issues`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to raise issue')
            }

            onSuccess()
            onClose()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                <h2>Raise Issue</h2>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Subject</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-input"
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Priority</label>
                        <select
                            className="form-select"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <span className="spinner"></span> : 'Submit Issue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Feedback Modal Component
function FeedbackModal({ projectId, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        rating: 0,
        comment: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.rating === 0) {
            setError('Please select a rating')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch(`/api/projects/${projectId}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit feedback')
            }

            onSuccess()
            onClose()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                <h2>Project Feedback</h2>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Rating</label>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`star-btn ${formData.rating >= star ? 'active' : ''}`}
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                >
                                    <Star size={32} fill={formData.rating >= star ? 'currentColor' : 'none'} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Comments (Optional)</label>
                        <textarea
                            className="form-input"
                            rows={4}
                            placeholder="Share your experience with this project..."
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <span className="spinner"></span> : 'Submit Feedback'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProjectDetails
