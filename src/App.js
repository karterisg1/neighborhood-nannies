import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import SearchNanniesPage from './pages/SearchNanniesPage';
import NannyProfilePage from './pages/NannyProfilePage';
import BookingPage from './pages/BookingPage';
import ContractPage from './pages/ContractPage';
import PaymentPage from './pages/PaymentPage';
import ReviewPage from './pages/ReviewPage';
import NannyDashboardPage from './pages/NannyDashboardPage';
import EditNannyProfilePage from './pages/EditNannyProfilePage';
import CreateAdPage from './pages/CreateAdPage';
import AppointmentManagementPage from './pages/AppointmentManagementPage';
import CompletedVouchersPage from './pages/CompletedVouchersPage';
 import HistoryPage from './pages/HistoryPage';
  import EditProfilePage from './pages/EditProfilePage';
  import ParentDashboardPage from './pages/ParentDashboardPage';
import './App.css';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/search-nannies" element={<PrivateRoute><SearchNanniesPage /></PrivateRoute>} />
          <Route path="/nanny/:id" element={<PrivateRoute><NannyProfilePage /></PrivateRoute>} />
            <Route path="/booking/:nannyId" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
          <Route path="/contract/:nannyId" element={<PrivateRoute><ContractPage /></PrivateRoute>} />
          <Route path="/payment/:nannyId" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
          <Route path="/review/:nannyId" element={<PrivateRoute><ReviewPage /></PrivateRoute>} />
          <Route path="/nanny-dashboard" element={<PrivateRoute><NannyDashboardPage /></PrivateRoute>} />
          <Route path="/edit-nanny-profile" element={<PrivateRoute><EditNannyProfilePage /></PrivateRoute>} />
          <Route path="/create-ad" element={<PrivateRoute><CreateAdPage /></PrivateRoute>} />
            <Route path="/manage-appointments" element={<PrivateRoute><AppointmentManagementPage /></PrivateRoute>} />
            <Route path="/completed-vouchers" element={<PrivateRoute><CompletedVouchersPage /></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
            <Route path="/edit-profile" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
          <Route path="/parent-dashboard" element={<PrivateRoute><ParentDashboardPage /></PrivateRoute>} />
             <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function PrivateRoute({ children }) {
  const { currentUser } = React.useContext(AuthContext);
  return currentUser ? children : <Navigate to="/login" />;
}
export default App;