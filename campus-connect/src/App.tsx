import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Events from './components/Events';
import Community from './components/Community';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';

// Dedicated pages
import EventsPage from './pages/EventsPage';
import StudyGroupsPage from './pages/StudyGroupsPage';
import ChatPage from './pages/ChatPage';
import ResourcesPage from './pages/ResourcesPage';
import NavigationPage from './pages/NavigationPage';
import AchievementsPage from './pages/AchievementsPage';
import SuccessPage from './pages/SuccessPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Features />
                <Events />
                <PricingSection />
                <Community />
              </>
            }
          />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/study-groups" element={<StudyGroupsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/navigation" element={<NavigationPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;