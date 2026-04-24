import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Global Styles
import './styles/global-theme.css';
import './styles/animate.css';
import './styles/HallsGallery.css'; 
import './styles/home.css';
import './styles/auth.css';
import './styles/global-loader.css';

// Components
import Layout from './components/Layout';
import GlobalLoader from './components/GlobalLoader';

// Pages
import HallsGalleryPage from './pages/HallsGalleryPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AIGuidePage from './pages/AIGuidePage';
import AIChatbotPage from './pages/AIChatbotPage';
import ArtifactIdentifierPage from './pages/ArtifactIdentifierPage';
import AIVoicePage from './pages/AIVoicePage';
import TutoraLabPage from './pages/TutoraLabPage';
import AIImaginationPage from './pages/AIImaginationPage';
import PharaohTransformerPage from './pages/PharaohTransformerPage';
import NameTranslatorPage from './pages/NameTranslatorPage';
import {
  PlanYourVisitPage, KidsMuseumPage, EventsPage, ShopPage, 
  AboutPage, BookingPage, ProfilePage, FavoritesPage, CollectionPage, 
  MembershipPage, 
  DiningPage, HistoryPage, NewsPage, BrandingPage, HelpPage, ContactPage, FeedbackPage, 
  AccessibilityPage, PrivacyPage, TermsPage, CookiesPage
} from './pages/PlaceholderPages';


const App = () => {
  return (
    <Router>
      <GlobalLoader />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Main Journeys */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/plan-your-visit" element={<PlanYourVisitPage />} />
          <Route path="/kids-museum" element={<KidsMuseumPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          
          {/* Collections */}
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/exhibition-halls" element={<HallsGalleryPage />} />

          {/* AI Exp */}
          <Route path="/ai-guide" element={<AIGuidePage />} />
          <Route path="/ai-chatbot" element={<AIChatbotPage />} />
          <Route path="/artifact-identifier" element={<ArtifactIdentifierPage />} />
          <Route path="/ai-voice" element={<AIVoicePage />} />
          <Route path="/tutora-lab" element={<TutoraLabPage />} />
          <Route path="/ai-imagination" element={<AIImaginationPage />} />
          <Route path="/pharaoh-transformer" element={<PharaohTransformerPage />} />
          <Route path="/name-translator" element={<NameTranslatorPage />} />

          {/* Footers */}
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/dining" element={<DiningPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/branding" element={<BrandingPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiesPage />} />

          <Route path="*" element={<div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-primary)' }}><h2>404 - Page not found</h2></div>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
