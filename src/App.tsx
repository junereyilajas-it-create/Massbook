import { Navigate, Route, Routes } from 'react-router-dom';

import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PendingApprovalsPage from './pages/PendingApprovalsPage';
import RequestDetailsPage from './pages/RequestDetailsPage';
import EventBookingStep1Page from './pages/EventBookingStep1Page';
import EventBookingStep2Page from './pages/EventBookingStep2Page';
import EventBookingStep3Page from './pages/EventBookingStep3Page';
import EventBookingStep4Page from './pages/EventBookingStep4Page';
import MassSchedulePage from './pages/MassSchedulePage';
import AdminMassSchedulePage from './pages/AdminMassSchedulePage';


import SettingsPage from './pages/SettingsPage';

import SupportPage from './pages/SupportPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        <Route path="/pending-approvals" element={<PendingApprovalsPage />} />
        <Route path="/pending-approvals/:requestId" element={<RequestDetailsPage />} />

        <Route path="/event-booking" element={<Navigate to="/event-booking/step1" replace />} />

        <Route path="/event-booking/step1" element={<EventBookingStep1Page />} />

        <Route path="/event-booking/step2" element={<EventBookingStep2Page />} />
        <Route path="/event-booking/step3" element={<EventBookingStep3Page />} />
        <Route path="/event-booking/step4" element={<EventBookingStep4Page />} />
        <Route path="/mass-schedule" element={<MassSchedulePage />} />
        <Route path="/admin/mass-schedule" element={<AdminMassSchedulePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Routes>
    </div>
  );
}

export default App;

