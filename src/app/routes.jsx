import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProjectLayout from "../layouts/ProjectLayout";

// Auth page
import Landing from "../page/auth/Landing";
import Login from "../page/auth/Login";
import Register from "../page/auth/Register";

// Customer Pages
import CustomerDashboard from "../page/customer/CustomerDashboard";
import SubmitProject from "../page/customer/SubmitProject";
// Placeholders for Customer
import MyProjects from "../page/customer/MyProjects";
import TrackProgress from "../page/customer/TrackProgress";
import CustomerPayments from "../page/customer/Payments";
import Messages from "../page/customer/Messages";

// Contractor Pages
import ContractorDashboard from "../page/contractor/ContractorDashboard";
// Placeholders for Contractor
import AvailableProjects from "../page/contractor/AvailableProjects";
import MyBids from "../page/contractor/MyBids";
import ActiveProjects from "../page/contractor/ActiveProjects";
import LabourManagement from "../page/contractor/LabourManagement";
import UploadPhotos from "../page/contractor/UploadPhotos";
import ContactClient from "../page/contractor/ContactClient";

// Management Pages
import ManagementDashboard from "../page/management/ManagementDashboard";
import Analytics from "../page/management/Analytics";
import Quotations from "../page/management/Quotations";
// Placeholders for Management
import ManagementProjects from "../page/management/Projects";
import ManagementReports from "../page/management/Reports";
import ManagementUsers from "../page/management/Users";


// Project Sub-pages (Contractor View)
import Overview from "../page/projects/Overview";
import Budget from "../page/projects/Budget";
import Timeline from "../page/projects/Timeline";
import Reports from "../page/projects/Reports";
import Payments from "../page/projects/Payments";
import Updates from "../page/projects/Updates";
import Attendance from "../page/projects/Attendance";
import Materials from "../page/projects/Materials";
import InternalNotes from "../page/projects/InternalNotes";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("userRole");

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />; // Or a generic 403 page
  }

  return children;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* DASHBOARD LAYOUT WRAPPER */}
        <Route element={<DashboardLayout />}>

          {/* CUSTOMER ROUTES */}
          <Route path="/customer/dashboard" element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/customer/submit-project" element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <SubmitProject />
            </ProtectedRoute>
          } />
          <Route path="/customer/projects" element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <MyProjects />
            </ProtectedRoute>
          } />
          <Route path="/customer/track-progress" element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <TrackProgress />
            </ProtectedRoute>
          } />
          <Route path="/customer/payments" element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerPayments />
            </ProtectedRoute>
          } />
          <Route path="/customer/messages" element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Messages />
            </ProtectedRoute>
          } />


          {/* CONTRACTOR ROUTES */}
          <Route path="/contractor/dashboard" element={
            <ProtectedRoute allowedRoles={["contractor"]}>
              <ContractorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/contractor/available-projects" element={
            <ProtectedRoute allowedRoles={["contractor"]}>
              <AvailableProjects />
            </ProtectedRoute>
          } />
          <Route path="/contractor/my-bids" element={
            <ProtectedRoute allowedRoles={["contractor"]}>
              <MyBids />
            </ProtectedRoute>
          } />
          <Route path="/contractor/active-projects" element={
            <ProtectedRoute allowedRoles={["contractor"]}>
              <ActiveProjects />
            </ProtectedRoute>
          } />
          <Route path="/contractor/labour-management" element={
            <ProtectedRoute allowedRoles={["contractor"]}>
              <LabourManagement />
            </ProtectedRoute>
          } />
          <Route path="/contractor/upload-photos" element={
            <ProtectedRoute allowedRoles={["contractor"]}>
              <UploadPhotos />
            </ProtectedRoute>
          } />
          <Route path="/contractor/contact-client" element={
            <ProtectedRoute allowedRoles={["contractor"]}>
              <ContactClient />
            </ProtectedRoute>
          } />


          {/* MANAGEMENT ROUTES */}
          <Route path="/management/dashboard" element={
            <ProtectedRoute allowedRoles={["management"]}>
              <ManagementDashboard />
            </ProtectedRoute>
          } />
          <Route path="/management/analytics" element={
            <ProtectedRoute allowedRoles={["management"]}>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/management/quotations" element={
            <ProtectedRoute allowedRoles={["management"]}>
              <Quotations />
            </ProtectedRoute>
          } />
          <Route path="/management/projects" element={
            <ProtectedRoute allowedRoles={["management"]}>
              <ManagementProjects />
            </ProtectedRoute>
          } />
          <Route path="/management/reports" element={
            <ProtectedRoute allowedRoles={["management"]}>
              <ManagementReports />
            </ProtectedRoute>
          } />
          <Route path="/management/users" element={
            <ProtectedRoute allowedRoles={["management"]}>
              <ManagementUsers />
            </ProtectedRoute>
          } />

          {/* PROJECT DETAILS (CONTRACTOR ONLY) */}
          <Route path="/project/:id" element={
            <ProtectedRoute allowedRoles={["contractor"]}>
              <ProjectLayout />
            </ProtectedRoute>
          }>
            <Route path="overview" element={<Overview />} />
            <Route path="budget" element={<Budget />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="reports" element={<Reports />} />
            <Route path="payments" element={<Payments />} />
            <Route path="updates" element={<Updates />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="materials" element={<Materials />} />
            <Route path="notes" element={<InternalNotes />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
