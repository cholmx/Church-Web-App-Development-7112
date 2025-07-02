import { HashRouter as Router, Routes, Route } from 'react-router-dom'
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
      <div className="min-h-screen bg-accent">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/events" element={<Events />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/give" element={<Give />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/sermon-blog" element={<SermonBlog />} />
          <Route path="/shine-podcast" element={<ShinePodcast />} />
          <Route path="/table-group-signup" element={<TableGroupSignup />} />
          <Route path="/event-registration" element={<EventRegistration />} />
          <Route path="/class-registration" element={<ClassRegistration />} />
          <Route path="/join-realm" element={<JoinRealm />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App