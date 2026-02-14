import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import CustomerDashboard from './pages/CustomerDashboard'
import CreateProject from './pages/CreateProject'
import ProjectDetails from './pages/ProjectDetails'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRole="customer">
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/create-project"
                    element={
                        <ProtectedRoute allowedRole="customer">
                            <CreateProject />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/project/:id"
                    element={
                        <ProtectedRoute allowedRole="customer">
                            <ProjectDetails />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App

