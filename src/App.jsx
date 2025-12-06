import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FitManagerProvider } from './context/FitManagerContext';

// Pages & Layouts
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import StudentsPage from './pages/students/StudentsPage';
import WorkoutPage from './pages/workouts/WorkoutPage';
import SchedulePage from './pages/schedule/SchedulePage';
import MobileLayout from './layouts/MobileLayout';
import StudentWorkoutPage from './pages/student-app/StudentWorkoutPage';
import StudentHomePage from './pages/student-app/StudentHomePage';
import StudentProfilePage from './pages/student-app/StudentProfilePage';
import StudentLoginPage from './pages/student-app/StudentLoginPage';
import TermsPage from './pages/student-app/TermsPage';
import TVPage from './pages/tv/TVPage';
import FinancePage from './pages/finance/FinancePage';
import SettingsPage from './pages/settings/SettingsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <FitManagerProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/tv" element={<TVPage />} />
          
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/students" element={<StudentsPage />} />
            <Route path="/admin/workouts" element={<WorkoutPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/admin/finance" element={<FinancePage />} />
          </Route>

          {/* Student App Routes */}
          <Route path="/app/student" element={<MobileLayout />}>
            <Route index element={<Navigate to="/app/student/login" replace />} />
            <Route path="login" element={<StudentLoginPage />} />
            <Route path="home" element={<StudentHomePage />} />
            <Route path="workout" element={<StudentWorkoutPage />} />
            <Route path="profile" element={<StudentProfilePage />} />
            <Route path="terms" element={<TermsPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </FitManagerProvider>
  );
}

export default App;
