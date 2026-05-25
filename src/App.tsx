import { Navigate, Route, Routes } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PendingApprovalsPage from './pages/PendingApprovalsPage';
import RequestDetailsPage from './pages/RequestDetailsPage';
import EventBookingPage from './pages/EventBookingPage';
import EventBookingReviewPage from './pages/EventBookingReviewPage';
import MassSchedulePage from './pages/MassSchedulePage';
import AdminMassSchedulePage from './pages/AdminMassSchedulePage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import SupportPage from './pages/SupportPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        <Route path="/pending-approvals" element={<PendingApprovalsPage />} />
        <Route path="/pending-approvals/:requestId" element={<RequestDetailsPage />} />

        <Route path="/event-booking" element={<EventBookingPage />} />
        <Route path="/event-booking/review" element={<EventBookingReviewPage />} />
        <Route path="/event-booking/combined" element={<Navigate to="/event-booking" replace />} />
        <Route path="/event-booking/step4" element={<Navigate to="/event-booking/review" replace />} />
        <Route path="/mass-schedule" element={<MassSchedulePage />} />
        <Route path="/admin/mass-schedule" element={<AdminMassSchedulePage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Routes>
    </div>
  );
}

export default App;

