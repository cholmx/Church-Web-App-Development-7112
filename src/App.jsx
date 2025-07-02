import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Events from './pages/Events'
import Ministries from './pages/Ministries'
import Give from './pages/Give'
import Contact from './pages/Contact'
import Announcements from './pages/Announcements'
import SermonBlog from './pages/SermonBlog'
import ShinePodcast from './pages/ShinePodcast'
import TableGroupSignup from './pages/TableGroupSignup'
import EventRegistration from './pages/EventRegistration'
import ClassRegistration from './pages/ClassRegistration'
import JoinRealm from './pages/JoinRealm'
import Resources from './pages/Resources'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page - no nav/footer if it has its own layout */}
        <Route path="/" element={<Home />} />
        
        {/* Main pages with full layout */}
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/services" element={<Layout><Services /></Layout>} />
        <Route path="/events" element={<Layout><Events /></Layout>} />
        <Route path="/ministries" element={<Layout><Ministries /></Layout>} />
        <Route path="/give" element={<Layout><Give /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/resources" element={<Layout><Resources /></Layout>} />
        
        {/* Pages that might need different layouts */}
        <Route path="/announcements" element={<Layout><Announcements /></Layout>} />
        <Route path="/sermon-blog" element={<Layout><SermonBlog /></Layout>} />
        <Route path="/shine-podcast" element={<Layout><ShinePodcast /></Layout>} />
        
        {/* Registration/signup pages */}
        <Route path="/table-group-signup" element={<Layout><TableGroupSignup /></Layout>} />
        <Route path="/event-registration" element={<Layout><EventRegistration /></Layout>} />
        <Route path="/class-registration" element={<Layout><ClassRegistration /></Layout>} />
        <Route path="/join-realm" element={<Layout><JoinRealm /></Layout>} />
        
        {/* Admin page - no nav/footer for clean admin interface */}
        <Route path="/admin" element={<Layout showNav={false} showFooter={false}><Admin /></Layout>} />
        
        {/* 404 page */}
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </Router>
  )
}

export default App
