import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Events from './pages/Events';
import Ministries from './pages/Ministries';
import Give from './pages/Give';
import Contact from './pages/Contact';
import Announcements from './pages/Announcements';
import SermonBlog from './pages/SermonBlog';
import ShinePodcast from './pages/ShinePodcast';
import TableGroupSignup from './pages/TableGroupSignup';
import EventRegistration from './pages/EventRegistration';
import JoinRealm from './pages/JoinRealm';
import Admin from './pages/Admin';
import './App.css';

function App() {
  const isPortalPage = (pathname) => {
    const portalPages = [
      '/announcements',
      '/sermon-blog', 
      '/shine-podcast',
      '/table-group-signup',
      '/event-registration',
      '/give',
      '/join-realm',
      '/contact',
      '/admin'
    ];
    return portalPages.includes(pathname) || pathname === '/';
  };

  return (
    <Router>
      <div className="min-h-screen bg-accent">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
          <Route path="/services" element={<><Navbar /><Services /><Footer /></>} />
          <Route path="/events" element={<><Navbar /><Events /><Footer /></>} />
          <Route path="/ministries" element={<><Navbar /><Ministries /><Footer /></>} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/sermon-blog" element={<SermonBlog />} />
          <Route path="/shine-podcast" element={<ShinePodcast />} />
          <Route path="/table-group-signup" element={<TableGroupSignup />} />
          <Route path="/event-registration" element={<EventRegistration />} />
          <Route path="/give" element={<Give />} />
          <Route path="/join-realm" element={<JoinRealm />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;