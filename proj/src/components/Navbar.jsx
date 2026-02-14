import { Bell, User, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
    const navigate = useNavigate()
    const [showDropdown, setShowDropdown] = useState(false)
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null

    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate('/')
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <h2 className="navbar-logo">🏗️ Scaffoldz</h2>
                </div>

                <div className="navbar-actions">
                    <button className="navbar-icon-btn" title="Notifications">
                        <Bell size={20} />
                        <span className="notification-badge">3</span>
                    </button>

                    <div className="navbar-profile">
                        <button
                            className="navbar-profile-btn"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <User size={20} />
                            <span className="navbar-user-name">{user?.email}</span>
                        </button>

                        {showDropdown && (
                            <div className="navbar-dropdown">
                                <div className="navbar-dropdown-header">
                                    <p className="navbar-dropdown-email">{user?.email}</p>
                                    <span className={`role-badge ${user?.role}`}>{user?.role}</span>
                                </div>
                                <button
                                    className="navbar-dropdown-item"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
