
// Simulated delay helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const ROLES = {
  MANAGEMENT: 'management',
  CONTRACTOR: 'contractor',
  CUSTOMER: 'customer',
};

// Mock Users
const users = [
  { id: 1, name: 'Alice Manager', role: ROLES.MANAGEMENT, email: 'admin@scaffoldz.com' },
  { id: 2, name: 'Bob Builder', role: ROLES.CONTRACTOR, email: 'bob@build.com' },
  { id: 3, name: 'Charlie Customer', role: ROLES.CUSTOMER, email: 'charlie@client.com' },
];

// Mock Projects
const projects = [
  {
    id: 101,
    name: 'Skyline Tower',
    customerName: 'Charlie Customer',
    customerId: 3,
    contractorName: 'Bob Builder',
    contractorId: 2,
    status: 'In Progress',
    totalBudget: 5000000,
    spentAmount: 1200000,
    progressPercentage: 24,
    timelineStart: '2024-01-01',
    timelineEnd: '2025-12-31',
    location: 'Downtown Metro',
  },
  {
    id: 102,
    name: 'Riverfront Villa',
    customerName: 'Dave Client',
    customerId: 4,
    contractorName: 'Pending',
    contractorId: null,
    status: 'Request',
    totalBudget: 800000,
    spentAmount: 0,
    progressPercentage: 0,
    timelineStart: '2024-06-01',
    timelineEnd: '2025-01-01',
    location: 'Riverside Drive',
  },
    {
    id: 103,
    name: 'Tech Park Annex',
    customerName: 'Eve Enterprise',
    customerId: 5,
    contractorName: 'Bob Builder',
    contractorId: 2,
    status: 'Completed',
    totalBudget: 2000000,
    spentAmount: 1950000,
    progressPercentage: 100,
    timelineStart: '2023-01-01',
    timelineEnd: '2023-12-31',
    location: 'Tech Valley',
  },
];

// Mock Quotations
const quotations = [
    { id: 1, projectId: 102, contractorId: 2, amount: 750000, status: 'Pending' }
];

export const api = {
  login: async (email, password) => {
    await delay(500);
    // Simple mock login logic
    const user = users.find(u => u.email === email);
    if (user) return user;
    throw new Error('Invalid credentials');
  },

  getProjects: async (role, userId) => {
    await delay(500);
    if (role === ROLES.MANAGEMENT) return projects;
    if (role === ROLES.CUSTOMER) return projects.filter(p => p.customerId === userId);
    if (role === ROLES.CONTRACTOR) return projects.filter(p => p.contractorId === userId);
    return [];
  },

  getProjectById: async (id) => {
    await delay(300);
    return projects.find(p => p.id === parseInt(id));
  },

  getStats: async () => { // Management only
      await delay(300);
      const activeProjects = projects.filter(p => p.status === 'In Progress').length;
      const totalRevenue = projects.reduce((sum, p) => sum + p.totalBudget, 0); // Simplified
      const totalCost = projects.reduce((sum, p) => sum + p.spentAmount, 0);
      return { totalProjects: projects.length, totalRevenue, totalCost, activeContractors: 1 };
  },

  getQuotations: async () => {
      await delay(300);
      return quotations;
  }
};
