import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { CountryManagerLayout } from '@/components/layout/CountryManagerLayout';
import { BrandSpinner } from '@/components/ui/BrandSpinner';

// Lazy-loaded pages (code splitting)
const HomePage = lazy(() => import('@/pages/public/HomePage').then(m => ({ default: m.HomePage })));
const HowItWorksPage = lazy(() => import('@/pages/public/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })));
const OffersPage = lazy(() => import('@/pages/public/OffersPage').then(m => ({ default: m.OffersPage })));
const FAQPage = lazy(() => import('@/pages/public/FAQPage').then(m => ({ default: m.FAQPage })));
const ContactPage = lazy(() => import('@/pages/public/ContactPage').then(m => ({ default: m.ContactPage })));
const SponsorshipPage = lazy(() => import('@/pages/public/SponsorshipPage').then(m => ({ default: m.SponsorshipPage })));
const SubscriptionSuccessPage = lazy(() => import('@/pages/subscription/SubscriptionSuccessPage').then(m => ({ default: m.SubscriptionSuccessPage })));
const SubscriptionCancelPage = lazy(() => import('@/pages/subscription/SubscriptionCancelPage').then(m => ({ default: m.SubscriptionCancelPage })));

const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const OnboardingPage = lazy(() => import('@/pages/public/OnboardingPage').then(m => ({ default: m.OnboardingPage })));

const SearchDeceasedPage = lazy(() => import('@/pages/declaration').then(m => ({ default: m.SearchDeceasedPage })));
const VerifyDeclarantPage = lazy(() => import('@/pages/declaration').then(m => ({ default: m.VerifyDeclarantPage })));
const VerifyOtpPage = lazy(() => import('@/pages/declaration').then(m => ({ default: m.VerifyOtpPage })));
const CreateDeclarationPage = lazy(() => import('@/pages/declaration').then(m => ({ default: m.CreateDeclarationPage })));

const DashboardHome = lazy(() => import('@/pages/dashboard/DashboardHome').then(m => ({ default: m.DashboardHome })));
const ContractPage = lazy(() => import('@/pages/dashboard/ContractPage').then(m => ({ default: m.ContractPage })));
const DashboardOffersPage = lazy(() => import('@/pages/dashboard/DashboardOffersPage').then(m => ({ default: m.DashboardOffersPage })));
const PaymentsPage = lazy(() => import('@/pages/dashboard/PaymentsPage').then(m => ({ default: m.PaymentsPage })));
const DocumentsPage = lazy(() => import('@/pages/dashboard/DocumentsPage').then(m => ({ default: m.DocumentsPage })));
const TrustedPersonPage = lazy(() => import('@/pages/dashboard/TrustedPersonPage').then(m => ({ default: m.TrustedPersonPage })));
const FamilyMembersPage = lazy(() => import('@/pages/dashboard/FamilyMembersPage').then(m => ({ default: m.FamilyMembersPage })));
const SponsorshipDashboard = lazy(() => import('@/pages/dashboard/SponsorshipDashboard').then(m => ({ default: m.SponsorshipDashboard })));
const SupportPage = lazy(() => import('@/pages/dashboard/SupportPage').then(m => ({ default: m.SupportPage })));
const NotificationsPage = lazy(() => import('@/pages/dashboard/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage').then(m => ({ default: m.SettingsPage })));

const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
const AdminRegistrationsPage = lazy(() => import('@/pages/admin/AdminRegistrationsPage').then(m => ({ default: m.AdminRegistrationsPage })));
const AdminDeclarationsPage = lazy(() => import('@/pages/admin/AdminDeclarationsPage').then(m => ({ default: m.AdminDeclarationsPage })));
const AdminContractsPage = lazy(() => import('@/pages/admin/AdminContractsPage').then(m => ({ default: m.AdminContractsPage })));
const AdminPaymentsPage = lazy(() => import('@/pages/admin/AdminPaymentsPage').then(m => ({ default: m.AdminPaymentsPage })));
const AdminDeathCasesPage = lazy(() => import('@/pages/admin/AdminDeathCasesPage').then(m => ({ default: m.AdminDeathCasesPage })));
const AdminCommissionsPage = lazy(() => import('@/pages/admin/AdminCommissionsPage').then(m => ({ default: m.AdminCommissionsPage })));
const AdminAnalyticsPage = lazy(() => import('@/pages/admin/AdminAnalyticsPage').then(m => ({ default: m.AdminAnalyticsPage })));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));
const AdminHealthDeclarationsPage = lazy(() => import('@/pages/admin/AdminHealthDeclarationsPage').then(m => ({ default: m.AdminHealthDeclarationsPage })));

const CountryManagerDashboard = lazy(() => import('@/pages/country-manager/CountryManagerDashboard').then(m => ({ default: m.CountryManagerDashboard })));
const CountryManagerUsersPage = lazy(() => import('@/pages/country-manager/CountryManagerUsersPage').then(m => ({ default: m.CountryManagerUsersPage })));
const CountryManagerDeclarationsPage = lazy(() => import('@/pages/country-manager/CountryManagerDeclarationsPage').then(m => ({ default: m.CountryManagerDeclarationsPage })));
const CountryManagerProfilePage = lazy(() => import('@/pages/country-manager/CountryManagerProfilePage').then(m => ({ default: m.CountryManagerProfilePage })));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><BrandSpinner size={40} /></div>}>
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

          {/* PayTech callback pages — standalone (no navbar/footer) */}
          <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />
          <Route path="/subscription/cancel" element={<SubscriptionCancelPage />} />

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
            <Route path="declarations-sante" element={<AdminHealthDeclarationsPage />} />
          </Route>
          {/* Country Manager dashboard — protected (country_manager only) */}
          <Route path="/country-manager" element={<ProtectedRoute requiredRole="country_manager"><CountryManagerLayout /></ProtectedRoute>}>
            <Route index element={<CountryManagerDashboard />} />
            <Route path="assures" element={<CountryManagerUsersPage />} />
            <Route path="declarations" element={<CountryManagerDeclarationsPage />} />
            <Route path="profil" element={<CountryManagerProfilePage />} />
          </Route>

          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
