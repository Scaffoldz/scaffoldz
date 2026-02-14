import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Upload, ArrowLeft } from 'lucide-react'

function CreateProject() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [formData, setFormData] = useState({
        title: '',
        address: '',
        projectType: '',
        timeline: '',
        budget: '',
        blueprint: null
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setError('')
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
            if (!validTypes.includes(file.type)) {
                setError('Please upload a valid file (JPG, PNG, or PDF)')
                e.target.value = ''
                return
            }
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB')
                e.target.value = ''
                return
            }
            setFormData(prev => ({ ...prev, blueprint: file }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Validation
            if (!formData.title || !formData.address || !formData.projectType ||
                !formData.timeline || !formData.budget) {
                setError('All fields are required')
                setLoading(false)
                return
            }

            const userStr = localStorage.getItem('user')
            const user = JSON.parse(userStr)

            // Create FormData for file upload
            const submitData = new FormData()
            submitData.append('title', formData.title)
            submitData.append('address', formData.address)
            submitData.append('projectType', formData.projectType)
            submitData.append('timeline', formData.timeline)
            submitData.append('budget', formData.budget)
            submitData.append('customerEmail', user.email)
            if (formData.blueprint) {
                submitData.append('blueprint', formData.blueprint)
            }

            const response = await fetch('/api/projects', {
                method: 'POST',
                body: submitData
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create project')
            }

            setSuccess('Project created successfully!')
            setTimeout(() => {
                navigate('/dashboard')
            }, 1500)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
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

                <div className="form-page">
                    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <div className="auth-header">
                            <h1>Create New Project</h1>
                            <p>Submit your construction project details</p>
                        </div>

                        {error && <div className="alert alert-error">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Project Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-input"
                                    placeholder="e.g., Modern Residential Villa"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Project Address</label>
                                <textarea
                                    name="address"
                                    className="form-input"
                                    placeholder="Full address with city and pincode"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Project Type</label>
                                <select
                                    name="projectType"
                                    className="form-select"
                                    value={formData.projectType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select type</option>
                                    <option value="Residential">Residential</option>
                                    <option value="Commercial">Commercial</option>
                                    <option value="Industrial">Industrial</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Expected Timeline</label>
                                <input
                                    type="text"
                                    name="timeline"
                                    className="form-input"
                                    placeholder="e.g., 6 months or 180 days"
                                    value={formData.timeline}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Expected Budget (₹)</label>
                                <input
                                    type="number"
                                    name="budget"
                                    className="form-input"
                                    placeholder="e.g., 5000000"
                                    value={formData.budget}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Blueprint (Optional)</label>
                                <div className="file-upload-container">
                                    <input
                                        type="file"
                                        id="blueprint"
                                        name="blueprint"
                                        className="file-input"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="blueprint" className="file-upload-label">
                                        <Upload size={20} />
                                        <span>
                                            {formData.blueprint
                                                ? formData.blueprint.name
                                                : 'Upload blueprint (JPG, PNG, or PDF)'}
                                        </span>
                                    </label>
                                </div>
                                <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                    Maximum file size: 10MB
                                </p>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <span className="spinner"></span> : 'Submit Project'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateProject
