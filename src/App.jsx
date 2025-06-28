import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Announcements from './pages/Announcements';
import SermonBlog from './pages/SermonBlog';
import ShinePodcast from './pages/ShinePodcast';
import TableGroupSignup from './pages/TableGroupSignup';
import EventRegistration from './pages/EventRegistration';
import Give from './pages/Give';
import JoinRealm from './pages/JoinRealm';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-accent">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
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
        </main>
      </div>
    </Router>
  );
}

export default App;