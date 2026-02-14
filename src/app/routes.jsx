import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProjectLayout from "../layouts/ProjectLayout";

// Auth page
import Landing from "../page/auth/Landing";
import Login from "../page/auth/Login";
import Register from "../page/auth/Register";

// Dashboard page
import CustomerDashboard from "../page/customer/CustomerDashboard";
import SubmitProject from "../page/customer/SubmitProject";
import ContractorDashboard from "../page/contractor/ContractorDashboard";
import ManagementDashboard from "../page/management/ManagementDashboard";
import Analytics from "../page/management/Analytics";
import Quotations from "../page/management/Quotations";

// Project page
import Overview from "../page/projects/Overview";
import Budget from "../page/projects/Budget";
import Timeline from "../page/projects/Timeline";
import Reports from "../page/projects/Reports";
import Payments from "../page/projects/Payments";
import Updates from "../page/projects/Updates";
import Attendance from "../page/projects/Attendance";
import Materials from "../page/projects/Materials";
import InternalNotes from "../page/projects/InternalNotes";

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

        {/* DASHBOARD */}
        <Route element={<DashboardLayout />}>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/SubmitProject" element={<SubmitProject />} />
          <Route path="/contractor/dashboard" element={<ContractorDashboard />} />
          <Route path="/management/dashboard" element={<ManagementDashboard />} />
          <Route path="/management/analytics" element={<Analytics />} />
          <Route path="/management/quotations" element={<Quotations />} />

          {/* PROJECT */}
          <Route path="/project/:id" element={<ProjectLayout />}>
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
