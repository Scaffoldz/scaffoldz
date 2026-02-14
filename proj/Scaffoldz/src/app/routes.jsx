import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProjectLayout from '../layouts/ProjectLayout';
import RoleGuard from '../components/RoleGuard';
import { ROLES } from '../services/api';

// Auth Pages
import Landing from '../pages/auth/Landing';
import Login from '../pages/auth/Login';

// Dashboard Pages
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import ManagementDashboard from '../pages/management/ManagementDashboard';
import ContractorDashboard from '../pages/contractor/ContractorDashboard';
import Analytics from '../pages/management/Analytics';
import Quotations from '../pages/management/Quotations';

// Project Pages
import Overview from '../pages/project/Overview';
import Budget from '../pages/project/Budget';
import Timeline from '../pages/project/Timeline';
import Reports from '../pages/project/Reports';
import InternalNotes from '../pages/project/InternalNotes';
import Updates from '../pages/project/Updates';
import Attendance from '../pages/project/Attendance';
import Materials from '../pages/project/Materials';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<AuthLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route element={<RoleGuard><DashboardLayout /></RoleGuard>}>

                {/* Management Routes */}
                <Route path="/management" element={
                    <RoleGuard allowedRoles={[ROLES.MANAGEMENT]}>
                        <ManagementDashboard />
                    </RoleGuard>
                } />
                <Route path="/management/analytics" element={
                    <RoleGuard allowedRoles={[ROLES.MANAGEMENT]}>
                        <Analytics />
                    </RoleGuard>
                } />
                <Route path="/management/quotations" element={
                    <RoleGuard allowedRoles={[ROLES.MANAGEMENT]}>
                        <Quotations />
                    </RoleGuard>
                } />

                {/* Contractor Routes */}
                <Route path="/contractor" element={
                    <RoleGuard allowedRoles={[ROLES.CONTRACTOR]}>
                        <ContractorDashboard />
                    </RoleGuard>
                } />

                {/* Customer Routes */}
                <Route path="/customer" element={
                    <RoleGuard allowedRoles={[ROLES.CUSTOMER]}>
                        <CustomerDashboard />
                    </RoleGuard>
                } />

                {/* Shared Project Routes */}
                <Route path="/project/:id" element={<ProjectLayout />}>
                    <Route index element={<Overview />} />
                    <Route path="budget" element={<Budget />} />
                    <Route path="timeline" element={<Timeline />} />
                    <Route path="reports" element={<Reports />} />

                    {/* Role Specific Project Sub-routes */}
                    <Route path="notes" element={
                        <RoleGuard allowedRoles={[ROLES.MANAGEMENT]}>
                            <InternalNotes />
                        </RoleGuard>
                    } />
                    <Route path="updates" element={
                        <RoleGuard allowedRoles={[ROLES.CONTRACTOR]}>
                            <Updates />
                        </RoleGuard>
                    } />
                    <Route path="attendance" element={
                        <RoleGuard allowedRoles={[ROLES.CONTRACTOR]}>
                            <Attendance />
                        </RoleGuard>
                    } />
                    <Route path="materials" element={
                        <RoleGuard allowedRoles={[ROLES.CONTRACTOR]}>
                            <Materials />
                        </RoleGuard>
                    } />
                </Route>

            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
