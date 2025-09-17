import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import CompanyRegisterPage from './components/CompanyRegisterPage';
import TechnicianDashboard from './components/dashboards/TechnicianDashboard';
import CustomerDashboard from './components/dashboards/CustomerDashboard'; // Renamed to HospitalDashboard later
import AdminDashboard from './components/dashboards/AdminDashboard';
import CalibrationWizard from './components/calibration/CalibrationWizard';
import HVACReportGenerator from './components/reports/HVACReportGenerator';

// Admin pages
import UserManagement from './components/admin/UserManagement';
import HospitalManagement from './components/admin/HospitalManagement';
import TaskPlanning from './components/admin/TaskPlanning';
import ReportAnalysis from './components/admin/ReportAnalysis';

// Technician pages
import DeviceList from './components/technician/DeviceList';
import Reports from './components/technician/Reports';

// Hospital pages
import ServiceRequest from './components/hospital/ServiceRequest';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/:role" element={<LoginPage />} />
            <Route path="/register-company" element={<CompanyRegisterPage />} />
            
            <Route
              path="/dashboard/technician"
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <TechnicianDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard/hospital"
              element={
                <ProtectedRoute allowedRoles={['hospital']}>
                  <CustomerDashboard /> {/* Will be renamed to HospitalDashboard */}
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/calibration/new"
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <CalibrationWizard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/calibration/start/:taskId"
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <CalibrationWizard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/calibration/continue/:taskId"
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <CalibrationWizard />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin/hospitals"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <HospitalManagement />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin/planning"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <TaskPlanning />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ReportAnalysis />
                </ProtectedRoute>
              }
            />

            {/* Technician Routes */}
            <Route
              path="/technician/devices"
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <DeviceList />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/technician/reports"
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* Hospital Routes */}
            <Route
              path="/hospital/service-request"
              element={
                <ProtectedRoute allowedRoles={['hospital']}>
                  <ServiceRequest />
                </ProtectedRoute>
              }
            />

            {/* Report Routes */}
            <Route
              path="/reports/hvac"
              element={
                <ProtectedRoute allowedRoles={['technician', 'admin']}>
                  <HVACReportGenerator />
                </ProtectedRoute>
              }
            />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
