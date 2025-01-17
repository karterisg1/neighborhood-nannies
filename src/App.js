import React, { useState, useEffect } from 'react';
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
import EligibilityPage from './pages/EligibilityPage';
import HowItWorksPage from './pages/HowItWorksPage';
import FullNannyProfilePage from './pages/FullNannyProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ParentDashboardPage from './pages/ParentDashboardPage';
import NannyManageAdsPage from './pages/NannyManageAdsPage';
import AdvancedSearchPage from './pages/AdvancedSearchPage';
import ContractDetailsPage from './pages/ContractDetailsPage';
import SchedulePage from './pages/SchedulePage';
import InboxPage from './pages/InboxPage';
import OutboxPage from './pages/OutboxPage';
import ChatPage from './pages/ChatPage';
import UploadLegalDocPage from './pages/UploadLegalDocPage';
import OnboardingParentPage from './pages/OnboardingParentPage';
import OnboardingNannyPage from './pages/OnboardingNannyPage';
import VouchersPage from './pages/VouchersPage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import ReviewDetailsPage from './pages/ReviewDetailsPage';
import PasswordResetPage from './pages/PasswordResetPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import AboutUsPage from './pages/AboutUsPage';
import FAQPage from './pages/FAQPage';
import NannyVoucherConfirmationPage from './pages/NannyVoucherConfirmationPage';
import NannyHistoryPage from './pages/NannyHistoryPage';
import SearchParentsPage from './pages/SearchParentsPage';
import ParentProfilePage from './pages/ParentProfilePage';
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
            <Route path="/nanny/:id/full-profile" element={<PrivateRoute><FullNannyProfilePage /></PrivateRoute>} />
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
            <Route path='/eligibility' element={<EligibilityPage />} />
            <Route path='/how-it-works' element={<HowItWorksPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
             <Route path='/notifications' element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
           <Route path='/admin-dashboard' element={<PrivateRoute><AdminDashboardPage /></PrivateRoute>} />
             <Route path='/parent-dashboard' element={<PrivateRoute><ParentDashboardPage /></PrivateRoute>} />
           <Route path='/nanny/manage-ads' element={<PrivateRoute><NannyManageAdsPage /></PrivateRoute>} />
            <Route path='/search/advanced' element={<PrivateRoute><AdvancedSearchPage /></PrivateRoute>} />
            <Route path='/contracts/:id/details' element={<PrivateRoute><ContractDetailsPage /></PrivateRoute>} />
             <Route path='/schedule' element={<PrivateRoute><SchedulePage /></PrivateRoute>} />
            <Route path='/messages/inbox' element={<PrivateRoute><InboxPage /></PrivateRoute>} />
          <Route path='/messages/outbox' element={<PrivateRoute><OutboxPage /></PrivateRoute>} />
            <Route path='/chat/:id' element={<PrivateRoute><ChatPage /></PrivateRoute>} />
           <Route path='/upload-legal-doc' element={<PrivateRoute><UploadLegalDocPage /></PrivateRoute>} />
          <Route path='/onboarding-parent' element={<OnboardingParentPage />} />
           <Route path='/onboarding-nanny' element={<OnboardingNannyPage />} />
         <Route path='/vouchers' element={<PrivateRoute><VouchersPage /></PrivateRoute>} />
            <Route path='/payment-history' element={<PrivateRoute><PaymentHistoryPage /></PrivateRoute>} />
          <Route path='/review/:id/details' element={<PrivateRoute><ReviewDetailsPage /></PrivateRoute>} />
            <Route path='/reset-password' element={<PasswordResetPage />} />
            <Route path='/settings' element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
          <Route path='/help' element={<HelpPage />} />
        <Route path='/nanny-vouchers' element={<PrivateRoute><NannyVoucherConfirmationPage /></PrivateRoute>}/>
          <Route path='/nanny-history' element={<PrivateRoute><NannyHistoryPage /></PrivateRoute>}/>
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/search-parents" element={<PrivateRoute><SearchParentsPage /></PrivateRoute>} />
          <Route path='/parent/:id' element={<PrivateRoute><ParentProfilePage /></PrivateRoute>} />
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