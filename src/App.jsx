import {HashRouter as Router,Routes,Route,useLocation} from 'react-router-dom'
import {AnimatePresence,motion} from 'framer-motion'

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
import SermonPodcast from './pages/SermonPodcast'
import TableGroupSignup from './pages/TableGroupSignup'
import EventRegistration from './pages/EventRegistration'
import ClassRegistration from './pages/ClassRegistration'
import JoinRealm from './pages/JoinRealm'
import Resources from './pages/Resources'
import Admin from './pages/Admin'
import Yellow from './pages/Yellow'
import Green from './pages/Green'
import OverflowSignup from './pages/OverflowSignup'
import CapitalCampaign from './pages/CapitalCampaign'
import NotFound from './pages/NotFound'

import './App.css'

const pageVariants = {
  initial: {opacity: 0, y: 16},
  animate: {opacity: 1, y: 0},
  exit: {opacity: 0, y: -8},
}

const pageTransition = {duration: 0.28, ease: [0.4, 0, 0.2, 1]}

const AnimatedRoutes = () => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        style={{minHeight: '100vh'}}
      >
        <Routes location={location}>
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
          <Route path="/sermon-podcast" element={<SermonPodcast />} />
          <Route path="/table-group-signup" element={<TableGroupSignup />} />
          <Route path="/event-registration" element={<EventRegistration />} />
          <Route path="/class-registration" element={<ClassRegistration />} />
          <Route path="/join-realm" element={<JoinRealm />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/yellow" element={<Yellow />} />
          <Route path="/green" element={<Green />} />
          <Route path="/overflow-signup" element={<OverflowSignup />} />
          <Route path="/capital-campaign" element={<CapitalCampaign />} />
          <Route path="/growth-campaign" element={<CapitalCampaign />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-accent">
        <AnimatedRoutes />
      </div>
    </Router>
  )
}

export default App