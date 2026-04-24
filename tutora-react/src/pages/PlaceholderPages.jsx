import React from 'react';

const PlaceholderTemplate = ({ title }) => (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', color: 'var(--text-primary)' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--hall-gold)', marginBottom: '1rem' }}>{title}</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>This page is currently being migrated to React. Please check back soon!</p>
    </div>
);

// Auth
export const LoginPage = () => <PlaceholderTemplate title="Login" />;
export const RegisterPage = () => <PlaceholderTemplate title="Register" />;

// Core Pages
export const PlanYourVisitPage = () => <PlaceholderTemplate title="Plan Your Visit" />;
export const KidsMuseumPage = () => <PlaceholderTemplate title="Kids Museum" />;
export const EventsPage = () => <PlaceholderTemplate title="Events" />;
export const ShopPage = () => <PlaceholderTemplate title="Museum Shop" />;
export const AboutPage = () => <PlaceholderTemplate title="About the GEM" />;
export const BookingPage = () => <PlaceholderTemplate title="Ticket Booking" />;
export const ProfilePage = () => <PlaceholderTemplate title="User Profile" />;
export const FavoritesPage = () => <PlaceholderTemplate title="My Favorites" />;

// Collection
export const CollectionPage = () => <PlaceholderTemplate title="Main Gallery Collection" />;

// Footer Links
export const MembershipPage = () => <PlaceholderTemplate title="Membership" />;
export const DiningPage = () => <PlaceholderTemplate title="Museum Dining" />;
export const HistoryPage = () => <PlaceholderTemplate title="Museum History" />;
export const NewsPage = () => <PlaceholderTemplate title="News & Press" />;
export const BrandingPage = () => <PlaceholderTemplate title="Branding" />;
export const HelpPage = () => <PlaceholderTemplate title="Visitor Help" />;
export const ContactPage = () => <PlaceholderTemplate title="Get In Touch" />;
export const FeedbackPage = () => <PlaceholderTemplate title="Feedback" />;
export const AccessibilityPage = () => <PlaceholderTemplate title="Accessibility" />;
export const PrivacyPage = () => <PlaceholderTemplate title="Privacy Policy" />;
export const TermsPage = () => <PlaceholderTemplate title="Terms of Service" />;
export const CookiesPage = () => <PlaceholderTemplate title="Cookie Settings" />;
