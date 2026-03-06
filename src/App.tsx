import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
import { OnboardingPage } from '@/pages/auth/OnboardingPage';

import { DashboardHome } from '@/pages/dashboard/DashboardHome';
import { ContractPage } from '@/pages/dashboard/ContractPage';
import { DashboardOffersPage } from '@/pages/dashboard/DashboardOffersPage';
import { PaymentsPage } from '@/pages/dashboard/PaymentsPage';
import { DocumentsPage } from '@/pages/dashboard/DocumentsPage';
import { TrustedPersonPage } from '@/pages/dashboard/TrustedPersonPage';
import { SponsorshipDashboard } from '@/pages/dashboard/SponsorshipDashboard';
import { DeathDeclarationPage } from '@/pages/dashboard/DeathDeclarationPage';
import { SupportPage } from '@/pages/dashboard/SupportPage';
import { NotificationsPage } from '@/pages/dashboard/NotificationsPage';
import { SettingsPage } from '@/pages/dashboard/SettingsPage';

import { AssistanceLayout } from '@/components/layout/AssistanceLayout';
import { AssistanceDashboard } from '@/pages/assistance/AssistanceDashboard';
import { AssistanceCasesPage } from '@/pages/assistance/AssistanceCasesPage';
import { AssistanceRapatriementsPage } from '@/pages/assistance/AssistanceRapatriementsPage';
import { AssistanceManagersPage } from '@/pages/assistance/AssistanceManagersPage';
import { AssistanceMessagesPage } from '@/pages/assistance/AssistanceMessagesPage';

import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminContractsPage } from '@/pages/admin/AdminContractsPage';
import { AdminPaymentsPage } from '@/pages/admin/AdminPaymentsPage';
import { AdminDeathCasesPage } from '@/pages/admin/AdminDeathCasesPage';
import { AdminCommissionsPage } from '@/pages/admin/AdminCommissionsPage';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';

function App() {
  return (
    <BrowserRouter>
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

        {/* User dashboard */}
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="contrat" element={<ContractPage />} />
          <Route path="offres" element={<DashboardOffersPage />} />
          <Route path="paiements" element={<PaymentsPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="personne-confiance" element={<TrustedPersonPage />} />
          <Route path="parrainage" element={<SponsorshipDashboard />} />
          <Route path="declaration-deces" element={<DeathDeclarationPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="parametres" element={<SettingsPage />} />
        </Route>

        {/* Assistance center */}
        <Route path="/assistance" element={<AssistanceLayout />}>
          <Route index element={<AssistanceDashboard />} />
          <Route path="dossiers" element={<AssistanceCasesPage />} />
          <Route path="rapatriements" element={<AssistanceRapatriementsPage />} />
          <Route path="managers" element={<AssistanceManagersPage />} />
          <Route path="messages" element={<AssistanceMessagesPage />} />
        </Route>

        {/* Admin dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="utilisateurs" element={<AdminUsersPage />} />
          <Route path="contrats" element={<AdminContractsPage />} />
          <Route path="paiements" element={<AdminPaymentsPage />} />
          <Route path="dossiers-deces" element={<AdminDeathCasesPage />} />
          <Route path="commissions" element={<AdminCommissionsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="parametres" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
