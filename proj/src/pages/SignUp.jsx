import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function SignUp() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1) // 1: signup form, 2: OTP verification
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: ''
    })

    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const otpRefs = useRef([])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setError('')
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Validation
            if (!formData.email || !formData.password || !formData.role) {
                setError('All fields are required')
                setLoading(false)
                return
            }

            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters')
                setLoading(false)
                return
            }

            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed')
            }

            setSuccess('OTP sent to your email!')
            setStep(2)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return

        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)
        setError('')

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus()
        }
    }

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus()
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const otpCode = otp.join('')

            if (otpCode.length !== 6) {
                setError('Please enter the complete OTP')
                setLoading(false)
                return
            }

            const response = await fetch('/api/verify-signup-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    otp: otpCode
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Verification failed')
            }

            setSuccess('Account created successfully!')
            setStep(3)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleResendOtp = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    type: 'signup'
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to resend OTP')
            }

            setSuccess('New OTP sent to your email!')
            setOtp(['', '', '', '', '', ''])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page">
            <div className="glass-card">
                {step === 1 && (
                    <>
                        <div className="auth-header">
                            <h1>Create Account</h1>
                            <p>Join us and get started today</p>
                        </div>

                        {error && <div className="alert alert-error">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        <form onSubmit={handleSignup}>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-input"
                                    placeholder="Minimum 6 characters"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Select Your Role</label>
                                <select
                                    name="role"
                                    className="form-select"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Choose a role...</option>
                                    <option value="customer">Customer</option>
                                    <option value="management">Management</option>
                                    <option value="contractor">Contractor</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <span className="spinner"></span> : 'Continue'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>
                                Already have an account?{' '}
                                <button className="btn-link" onClick={() => navigate('/')}>
                                    Sign In
                                </button>
                            </p>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="auth-header">
                            <h2>Verify Your Email</h2>
                            <p className="text-secondary">
                                We've sent a 6-digit code to<br />
                                <strong>{formData.email}</strong>
                            </p>
                        </div>

                        {error && <div className="alert alert-error">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        <form onSubmit={handleVerifyOtp}>
                            <div className="otp-container">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => otpRefs.current[index] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        className="otp-input"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    />
                                ))}
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <span className="spinner"></span> : 'Verify Email'}
                            </button>

                            <div className="text-center mt-lg">
                                <p className="text-muted mb-sm">Didn't receive the code?</p>
                                <button
                                    type="button"
                                    className="btn-link"
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                >
                                    Resend OTP
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {step === 3 && (
                    <div className="success-container">
                        <div className="success-icon">✓</div>
                        <h2 className="mb-md">Welcome!</h2>
                        <p className="text-secondary mb-lg">
                            Your account has been created successfully.
                        </p>
                        <div className="role-badge mb-xl" style={{ display: 'inline-flex' }}>
                            <span className={formData.role}>{formData.role}</span>
                        </div>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>
                            Go to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SignUp
