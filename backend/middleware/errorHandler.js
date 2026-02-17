// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);

    // Default error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // PostgreSQL specific errors
    if (err.code) {
        switch (err.code) {
            case '23505': // Unique violation
                statusCode = 409;
                message = 'Resource already exists';
                break;
            case '23503': // Foreign key violation
                statusCode = 400;
                message = 'Invalid reference to related resource';
                break;
            case '23502': // Not null violation
                statusCode = 400;
                message = 'Required field is missing';
                break;
            case '22P02': // Invalid input syntax
                statusCode = 400;
                message = 'Invalid data format';
                break;
        }
    }

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
