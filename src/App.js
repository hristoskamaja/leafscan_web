import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Diseases from './pages/Diseases/Diseases';
import Users from './pages/Users/Users';
import AnalysisHistory from './pages/AnalysisHistory/AnalysisHistory';
import Statistics from './pages/Statistics/Statistics';

function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

const Placeholder = ({ title }) => (
    <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 8 }}>{title}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>This page will be implemented next.</p>
    </div>
);

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <AdminLayout />
                    </PrivateRoute>
                }
            >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard"  element={<Dashboard />} />
                <Route path="diseases"   element={<Diseases />} />
                <Route path="users" element={<Users />} />
                <Route path="analyses" element={<AnalysisHistory />} />
                <Route path="statistics" element={<Statistics />} />
                <Route path="settings"   element={<Placeholder title="Settings" />} />
                <Route path="profile"    element={<Placeholder title="Profile" />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}
