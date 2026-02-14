import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleGuard = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>; // Simple loading state
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect based on role if unauthorized
        if (user.role === 'management') return <Navigate to="/management" replace />;
        if (user.role === 'contractor') return <Navigate to="/contractor" replace />;
        if (user.role === 'customer') return <Navigate to="/customer" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RoleGuard;
