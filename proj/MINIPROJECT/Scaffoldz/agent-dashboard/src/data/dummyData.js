// Dummy data for the AI Personal Agent Dashboard

export const projects = [
    {
        id: 1,
        name: "Website Redesign",
        description: "Complete overhaul of company website UI/UX",
        status: "Active",
        progress: 65,
        tasks: 12,
        completedTasks: 8,
        dueDate: "2026-03-15",
        timeline: [
            { id: 1, date: "2026-01-15", title: "Project Kickoff", description: "Initial planning and requirements gathering" },
            { id: 2, date: "2026-02-01", title: "Design Phase Complete", description: "Finalized mockups and design system" },
            { id: 3, date: "2026-02-20", title: "Development Started", description: "Frontend development in progress" },
            { id: 4, date: "2026-03-15", title: "Launch Target", description: "Expected completion date" },
        ]
    },
    {
        id: 2,
        name: "Mobile App Development",
        description: "iOS and Android app for customer engagement",
        status: "Active",
        progress: 40,
        tasks: 18,
        completedTasks: 7,
        dueDate: "2026-04-30",
        timeline: [
            { id: 1, date: "2026-01-20", title: "Requirements Finalized", description: "Feature list and technical specs approved" },
            { id: 2, date: "2026-02-10", title: "UI/UX Design", description: "App design and user flows completed" },
            { id: 3, date: "2026-03-01", title: "Alpha Build", description: "First working prototype" },
        ]
    },
    {
        id: 3,
        name: "Data Analytics Dashboard",
        description: "Real-time analytics and reporting system",
        status: "Paused",
        progress: 25,
        tasks: 15,
        completedTasks: 4,
        dueDate: "2026-05-20",
        timeline: [
            { id: 1, date: "2026-01-10", title: "Discovery Phase", description: "Stakeholder interviews and data analysis" },
            { id: 2, date: "2026-01-25", title: "Architecture Design", description: "System architecture and data flow" },
        ]
    },
    {
        id: 4,
        name: "Marketing Campaign",
        description: "Q1 2026 digital marketing initiative",
        status: "Completed",
        progress: 100,
        tasks: 10,
        completedTasks: 10,
        dueDate: "2026-02-01",
        timeline: [
            { id: 1, date: "2025-12-01", title: "Planning", description: "Campaign strategy and content calendar" },
            { id: 2, date: "2025-12-15", title: "Content Creation", description: "Graphics, copy, and assets produced" },
            { id: 3, date: "2026-01-05", title: "Campaign Launch", description: "Ads went live across all platforms" },
            { id: 4, date: "2026-02-01", title: "Campaign Complete", description: "Analysis and reporting finished" },
        ]
    },
    {
        id: 5,
        name: "Customer Portal",
        description: "Self-service portal for customer support",
        status: "Active",
        progress: 80,
        tasks: 20,
        completedTasks: 16,
        dueDate: "2026-03-01",
        timeline: [
            { id: 1, date: "2026-01-05", title: "Planning Complete", description: "User stories and requirements documented" },
            { id: 2, date: "2026-01-20", title: "Backend Development", description: "API and database setup finished" },
            { id: 3, date: "2026-02-10", title: "Frontend in Progress", description: "UI components being built" },
        ]
    },
    {
        id: 6,
        name: "Security Audit",
        description: "Comprehensive security review and updates",
        status: "Active",
        progress: 50,
        tasks: 8,
        completedTasks: 4,
        dueDate: "2026-03-30",
        timeline: [
            { id: 1, date: "2026-02-01", title: "Audit Initiated", description: "Third-party security firm engaged" },
            { id: 2, date: "2026-02-15", title: "Initial Findings", description: "Preliminary report received" },
        ]
    },
];

export const tasks = [
    { id: 1, title: "Design landing page mockup", description: "Create high-fidelity mockup for homepage", status: "todo", priority: "high", assignee: "Sarah J.", dueDate: "2026-02-20" },
    { id: 2, title: "Set up CI/CD pipeline", description: "Configure automated deployment workflow", status: "todo", priority: "medium", assignee: "Mike T.", dueDate: "2026-02-22" },
    { id: 3, title: "Write API documentation", description: "Document all REST endpoints", status: "todo", priority: "low", assignee: "Emily R.", dueDate: "2026-02-25" },
    { id: 4, title: "Implement user authentication", description: "Add login/signup functionality", status: "in-progress", priority: "high", assignee: "Alex W.", dueDate: "2026-02-18" },
    { id: 5, title: "Database migration", description: "Update schema for new features", status: "in-progress", priority: "high", assignee: "Chris L.", dueDate: "2026-02-19" },
    { id: 6, title: "Create style guide", description: "Comprehensive design system documentation", status: "in-progress", priority: "medium", assignee: "Sarah J.", dueDate: "2026-02-21" },
    { id: 7, title: "Bug fixes from QA", description: "Address issues from testing phase", status: "done", priority: "high", assignee: "Mike T.", dueDate: "2026-02-10" },
    { id: 8, title: "Update dependencies", description: "Upgrade npm packages to latest", status: "done", priority: "low", assignee: "Alex W.", dueDate: "2026-02-12" },
    { id: 9, title: "Performance optimization", description: "Improve page load times", status: "done", priority: "medium", assignee: "Chris L.", dueDate: "2026-02-14" },
];

export const chatMessages = [
    { id: 1, sender: "agent", text: "Hello! I'm your AI Personal Agent. How can I assist you today?", timestamp: "10:30 AM" },
    { id: 2, sender: "user", text: "Can you give me a summary of my active projects?", timestamp: "10:31 AM" },
    { id: 3, sender: "agent", text: "Of course! You currently have 4 active projects:\n\n1. **Website Redesign** (65% complete)\n2. **Mobile App Development** (40% complete)\n3. **Customer Portal** (80% complete)\n4. **Security Audit** (50% complete)\n\nWould you like details on any specific project?", timestamp: "10:31 AM" },
    { id: 4, sender: "user", text: "What's the status of the Customer Portal?", timestamp: "10:32 AM" },
    { id: 5, sender: "agent", text: "The Customer Portal is progressing well at 80% completion. Here's the breakdown:\n\n✓ Backend Development (Complete)\n✓ API and database setup (Complete)\n⏳ Frontend UI (In Progress - 16/20 tasks done)\n\nExpected completion: March 1st, 2026\n\nThe team is currently building the remaining UI components.", timestamp: "10:32 AM" },
];

export const suggestedPrompts = [
    "Show me overdue tasks",
    "What's my schedule for today?",
    "Summary of completed projects",
    "Team productivity metrics",
];

export const userProfile = {
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Project Manager",
    avatar: "https://ui-avatars.com/api/?name=John+Smith&background=3b82f6&color=fff",
    notifications: 5,
};

export const dashboardStats = {
    totalProjects: 6,
    activeProjects: 4,
    completedProjects: 1,
    totalTasks: 42,
    completedTasks: 28,
    teamMembers: 8,
};
