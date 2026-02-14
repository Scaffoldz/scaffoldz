import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1) // 1: login form, 2: OTP verification
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [userData, setUserData] = useState(null)

    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    })

    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const otpRefs = useRef([])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setCredentials(prev => ({ ...prev, [name]: value }))
        setError('')
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (!credentials.email || !credentials.password) {
                setError('Email and password are required')
                setLoading(false)
                return
            }

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Login failed')
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

            const response = await fetch('/api/verify-login-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: credentials.email,
                    otp: otpCode
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Verification failed')
            }

            // Save user data to localStorage
            localStorage.setItem('user', JSON.stringify(data.user))

            // Redirect to dashboard
            window.location.href = '/dashboard'
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
                    email: credentials.email,
                    type: 'login'
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
                            <h1>Welcome Back</h1>
                            <p>Sign in to your account</p>
                        </div>

                        {error && <div className="alert alert-error">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="you@example.com"
                                    value={credentials.email}
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
                                    placeholder="Enter your password"
                                    value={credentials.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <span className="spinner"></span> : 'Continue'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>
                                Don't have an account?{' '}
                                <button className="btn-link" onClick={() => navigate('/signup')}>
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="auth-header">
                            <h2>Verify Your Identity</h2>
                            <p className="text-secondary">
                                We've sent a 6-digit code to<br />
                                <strong>{credentials.email}</strong>
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
                                {loading ? <span className="spinner"></span> : 'Verify & Login'}
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

                {step === 3 && userData && (
                    <div className="success-container">
                        <div className="success-icon">✓</div>
                        <h2 className="mb-md">Login Successful!</h2>
                        <p className="text-secondary mb-lg">
                            Welcome back, {userData.email}
                        </p>
                        <div className={`role-badge ${userData.role} mb-xl`} style={{ display: 'inline-flex' }}>
                            {userData.role}
                        </div>
                        <div className="alert alert-info">
                            You are now logged in as {userData.role}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Login
