import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';

import { HomePage } from '@/pages/public/HomePage';
import { HowItWorksPage } from '@/pages/public/HowItWorksPage';
import { OffersPage } from '@/pages/public/OffersPage';
import { FAQPage } from '@/pages/public/FAQPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { SponsorshipPage } from '@/pages/public/SponsorshipPage';

import { LoginPage } from '@/pages/auth/LoginPage';
import { OnboardingPage } from '@/pages/public/OnboardingPage';

import { SearchDeceasedPage, VerifyDeclarantPage, VerifyOtpPage, CreateDeclarationPage } from '@/pages/declaration';

import { DashboardHome } from '@/pages/dashboard/DashboardHome';
import { ContractPage } from '@/pages/dashboard/ContractPage';
import { DashboardOffersPage } from '@/pages/dashboard/DashboardOffersPage';
import { PaymentsPage } from '@/pages/dashboard/PaymentsPage';
import { DocumentsPage } from '@/pages/dashboard/DocumentsPage';
import { TrustedPersonPage } from '@/pages/dashboard/TrustedPersonPage';
import { FamilyMembersPage } from '@/pages/dashboard/FamilyMembersPage';
import { SponsorshipDashboard } from '@/pages/dashboard/SponsorshipDashboard';
import { SupportPage } from '@/pages/dashboard/SupportPage';
import { NotificationsPage } from '@/pages/dashboard/NotificationsPage';
import { SettingsPage } from '@/pages/dashboard/SettingsPage';

import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminRegistrationsPage } from '@/pages/admin/AdminRegistrationsPage';
import { AdminDeclarationsPage } from '@/pages/admin/AdminDeclarationsPage';
import { AdminContractsPage } from '@/pages/admin/AdminContractsPage';
import { AdminPaymentsPage } from '@/pages/admin/AdminPaymentsPage';
import { AdminDeathCasesPage } from '@/pages/admin/AdminDeathCasesPage';
import { AdminCommissionsPage } from '@/pages/admin/AdminCommissionsPage';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public marketing site */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/comment-ca-marche" element={<HowItWorksPage />} />
            <Route path="/offres" element={<OffersPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/parrainage" element={<SponsorshipPage />} />
          </Route>

          {/* Auth pages (standalone layouts) */}
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<OnboardingPage />} />

          {/* Déclaration de décès — public (pas d'auth requise) */}
          <Route path="/declaration" element={<Navigate to="/declaration/search" replace />} />
          <Route path="/declaration/search" element={<SearchDeceasedPage />} />
          <Route path="/declaration/verify-declarant" element={<VerifyDeclarantPage />} />
          <Route path="/declaration/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/declaration/create" element={<CreateDeclarationPage />} />

          {/* User dashboard — protected */}
          <Route path="/app" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="contrat" element={<ContractPage />} />
            <Route path="offres" element={<DashboardOffersPage />} />
            <Route path="paiements" element={<PaymentsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="personne-confiance" element={<TrustedPersonPage />} />
            <Route path="famille" element={<FamilyMembersPage />} />
            <Route path="parrainage" element={<SponsorshipDashboard />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="parametres" element={<SettingsPage />} />
          </Route>

          {/* Admin dashboard — protected (admin only) */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="utilisateurs" element={<AdminUsersPage />} />
            <Route path="inscriptions" element={<AdminRegistrationsPage />} />
            <Route path="declarations" element={<AdminDeclarationsPage />} />
            <Route path="contrats" element={<AdminContractsPage />} />
            <Route path="paiements" element={<AdminPaymentsPage />} />
            <Route path="dossiers-deces" element={<AdminDeathCasesPage />} />
            <Route path="commissions" element={<AdminCommissionsPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="parametres" element={<AdminSettingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
