import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, allowedRole }) {
    const userStr = localStorage.getItem('user')

    if (!userStr) {
        return <Navigate to="/" replace />
    }

    try {
        const user = JSON.parse(userStr)

        if (allowedRole && user.role !== allowedRole) {
            return <Navigate to="/" replace />
        }

        return children
    } catch (error) {
        localStorage.removeItem('user')
        return <Navigate to="/" replace />
    }
}

export default ProtectedRoute
