// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Set auth token in localStorage
const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};

// Remove auth token
const removeAuthToken = () => {
    localStorage.removeItem('authToken');
};

// Generic API request helper
const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Authentication API
export const auth = {
    generateOTP: async (email, password) => {
        return apiRequest('/auth/generate-otp', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    verifyOTP: async (email, otp) => {
        const response = await apiRequest('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp }),
        });

        if (response.token) {
            setAuthToken(response.token);
        }

        return response;
    },

    getCurrentUser: async () => {
        return apiRequest('/auth/me');
    },

    logout: () => {
        removeAuthToken();
    },
};

// User API
export const users = {
    register: async (userData) => {
        return apiRequest('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    getAll: async () => {
        return apiRequest('/users');
    },

    getByRole: async (role) => {
        return apiRequest(`/users/role/${role}`);
    },
};

// Project API
export const projects = {
    getAll: async (status = null) => {
        const query = status ? `?status=${status}` : '';
        return apiRequest(`/projects${query}`);
    },

    getTenders: async () => {
        return apiRequest('/projects/tenders');
    },

    getById: async (id) => {
        return apiRequest(`/projects/${id}`);
    },

    create: async (projectData) => {
        return apiRequest('/projects', {
            method: 'POST',
            body: JSON.stringify(projectData),
        });
    },

    update: async (id, projectData) => {
        return apiRequest(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(projectData),
        });
    },

    delete: async (id) => {
        return apiRequest(`/projects/${id}`, {
            method: 'DELETE',
        });
    },
};

// Bid API
export const bids = {
    getByProject: async (projectId) => {
        return apiRequest(`/bids/project/${projectId}`);
    },

    getMyBids: async () => {
        return apiRequest('/bids/my-bids');
    },

    submit: async (bidData) => {
        return apiRequest('/bids', {
            method: 'POST',
            body: JSON.stringify(bidData),
        });
    },

    updateStatus: async (id, status) => {
        return apiRequest(`/bids/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },
};

// Milestone API
export const milestones = {
    getByProject: async (projectId) => {
        return apiRequest(`/milestones/project/${projectId}`);
    },

    create: async (milestoneData) => {
        return apiRequest('/milestones', {
            method: 'POST',
            body: JSON.stringify(milestoneData),
        });
    },

    update: async (id, milestoneData) => {
        return apiRequest(`/milestones/${id}`, {
            method: 'PUT',
            body: JSON.stringify(milestoneData),
        });
    },
};

// Payment API
export const payments = {
    getByProject: async (projectId) => {
        return apiRequest(`/payments/project/${projectId}`);
    },

    getById: async (id) => {
        return apiRequest(`/payments/${id}`);
    },

    create: async (paymentData) => {
        return apiRequest('/payments', {
            method: 'POST',
            body: JSON.stringify(paymentData),
        });
    },
};

// Report API
export const reports = {
    getByProject: async (projectId) => {
        return apiRequest(`/reports/project/${projectId}`);
    },

    getById: async (id) => {
        return apiRequest(`/reports/${id}`);
    },

    create: async (reportData) => {
        return apiRequest('/reports', {
            method: 'POST',
            body: JSON.stringify(reportData),
        });
    },

    addPhoto: async (reportId, photoData) => {
        return apiRequest(`/reports/${reportId}/photos`, {
            method: 'POST',
            body: JSON.stringify(photoData),
        });
    },

    getActualCost: async (projectId) => {
        return apiRequest(`/reports/project/${projectId}/actual-cost`);
    },
};

// Material API
export const materials = {
    getByProject: async (projectId) => {
        return apiRequest(`/materials/project/${projectId}`);
    },

    create: async (materialData) => {
        return apiRequest('/materials', {
            method: 'POST',
            body: JSON.stringify(materialData),
        });
    },

    update: async (id, materialData) => {
        return apiRequest(`/materials/${id}`, {
            method: 'PUT',
            body: JSON.stringify(materialData),
        });
    },

    delete: async (id) => {
        return apiRequest(`/materials/${id}`, {
            method: 'DELETE',
        });
    },
};

// Attendance API
export const attendance = {
    getByProject: async (projectId, startDate = null, endDate = null) => {
        let query = '';
        if (startDate) query += `?startDate=${startDate}`;
        if (endDate) query += `${query ? '&' : '?'}endDate=${endDate}`;
        return apiRequest(`/attendance/project/${projectId}${query}`);
    },

    mark: async (attendanceData) => {
        return apiRequest('/attendance', {
            method: 'POST',
            body: JSON.stringify(attendanceData),
        });
    },

    update: async (id, attendanceData) => {
        return apiRequest(`/attendance/${id}`, {
            method: 'PUT',
            body: JSON.stringify(attendanceData),
        });
    },
};

// Message API
export const messages = {
    getByProject: async (projectId) => {
        return apiRequest(`/messages/project/${projectId}`);
    },

    send: async (messageData) => {
        return apiRequest('/messages', {
            method: 'POST',
            body: JSON.stringify(messageData),
        });
    },

    markAsRead: async (id) => {
        return apiRequest(`/messages/${id}/read`, {
            method: 'PUT',
        });
    },
};

// Procurement API
export const procurement = {
    // Contractor: Create material request
    createRequest: async (requestData) => {
        return apiRequest('/procurement/requests', {
            method: 'POST',
            body: JSON.stringify(requestData),
        });
    },

    // Contractor/Customer: Get all requests & nested quotes for a specific project
    getProjectRequests: async (projectId) => {
        return apiRequest(`/procurement/requests/project/${projectId}`);
    },

    // Contractor: Get all requests across all projects
    getContractorRequests: async () => {
        return apiRequest('/procurement/requests/contractor');
    },

    // Vendor: Get open material requests
    getOpenRequests: async () => {
        return apiRequest('/procurement/requests/open');
    },

    // Vendor: Submit quote
    submitQuotation: async (quotationData) => {
        return apiRequest('/procurement/quotations', {
            method: 'POST',
            body: JSON.stringify(quotationData),
        });
    },

    // Vendor: Get submitted quotes
    getVendorQuotations: async () => {
        return apiRequest('/procurement/quotations/vendor');
    },

    // Contractor: Approve quote
    approveQuotation: async (quotationId) => {
        return apiRequest(`/procurement/quotations/${quotationId}/approve`, {
            method: 'PUT',
        });
    },

    // Vendor: Get assigned supply orders
    getVendorOrders: async () => {
        return apiRequest('/procurement/orders/vendor');
    },

    // Customer/Contractor: Get suggestions for a project
    getProjectSuggestions: async (projectId) => {
        return apiRequest(`/procurement/suggestions/${projectId}`);
    },

    // Customer: Post a suggestion
    postSuggestion: async (projectId, suggestionText) => {
        return apiRequest('/procurement/suggestions', {
            method: 'POST',
            body: JSON.stringify({ projectId, suggestionText }),
        });
    },
};

export default {
    auth,
    users,
    projects,
    bids,
    milestones,
    payments,
    reports,
    materials,
    attendance,
    messages,
    procurement,
};
