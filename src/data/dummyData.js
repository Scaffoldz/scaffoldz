// Projects list
export const projects = [
  {
    id: "1",
    name: "Residential Building",
    location: "Kochi",
    status: "In Progress",
  },
  {
    id: "2",
    name: "Commercial Complex",
    location: "Trivandrum",
    status: "Planning",
  },
];

// Milestones (project-based)
export const milestones = {
  1: [
    {
      id: 1,
      title: "Planning",
      status: "Completed",
      name: "Planning Payment",
      amount: 500000,
      paid: true,
    },
    {
      id: 2,
      title: "Foundation",
      status: "In Progress",
      name: "Foundation Payment",
      amount: 800000,
      paid: false,
    },
  ],
};
;
export const reportsData = {
  1: [
    {
      id: 1,
      date: "2026-02-05",
      workDone: "Foundation slab completed",
      labourCount: 12,
      remarks: "No issues",
      photos: ["site1.jpg"],
    },
    {
      id: 2,
      date: "2026-02-07",
      workDone: "Column work started",
      labourCount: 10,
      remarks: "Cement delivery pending",
      photos: [],
    },
  ],
};
export const contractorProjects = [
  {
    id: 1,
    projectName: "Residential House – Project 1",
    stage: "Foundation",
  },
];

export const managementProjects = [
  {
    id: 1,
    customerName: "Rahul",
    projectName: "Residential House",
    status: "In Progress",
    contractor: "Not Assigned",
  },
];

export const contractorBids = {
  1: [
    {
      contractorName: "ABC Constructions",
      price: 4800000,
      duration: "10 months",
      experience: "8 years",
    },
    {
      contractorName: "BuildRight Pvt Ltd",
      price: 5100000,
      duration: "9 months",
      experience: "10 years",
    },
  ],
};
