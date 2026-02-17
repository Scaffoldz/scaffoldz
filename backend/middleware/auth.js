const { verifyToken } = require('../config/jwt');
const { query } = require('../config/database');

// Middleware to verify JWT token and attach user to request
const authenticate = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyToken(token);

        // Get user from database
        const result = await query(
            'SELECT id, email, full_name, role, phone, company_name FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid token. User not found.' });
        }

        // Attach user to request
        req.user = result.rows[0];
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

// Middleware to check if user has required role
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: `Access denied. Required role(s): ${allowedRoles.join(', ')}`
            });
        }

        next();
    };
};

module.exports = {
    authenticate,
    authorize
};
