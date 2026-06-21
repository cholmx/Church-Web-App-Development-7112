import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {SkeletonForm,LoadingTransition} from '../components/LoadingSkeletons';
import AdminAnnouncements from '../components/AdminAnnouncements';
import AdminSermons from '../components/AdminSermons';
import AdminEvents from '../components/AdminEvents';
import AdminClasses from '../components/AdminClasses';
import AdminResources from '../components/AdminResources';
import AdminFeaturedButtons from '../components/AdminFeaturedButtons';
import AdminMinistries from '../components/AdminMinistries';
import AdminStaffContacts from '../components/AdminStaffContacts';
import AdminCapitalCampaign from '../components/AdminCapitalCampaign';
import AdminComments from '../components/AdminComments';
import AdminDashboard from '../components/AdminDashboard';
import AdminLeadershipLinks from '../components/AdminLeadershipLinks';

const {FiSettings,FiBell,FiPlay,FiCalendar,FiBookOpen,FiHome,FiLock,FiMic,FiExternalLink,FiStar,FiHeart,FiUsers,FiTrendingUp,FiMessageSquare,FiGrid}=FiIcons;

const Admin=()=> {
  const [isAuthenticated,setIsAuthenticated]=useState(false);
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [activeTab,setActiveTab]=useState('overview');
  const [loading,setLoading]=useState(false);

  const ADMIN_PASSWORD='upperroom500';

  const handlePasswordSubmit=(e)=> {
    e.preventDefault();
    setLoading(true);
    // Simulate authentication delay
    setTimeout(()=> {
      if (password===ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Invalid password. Please try again.');
        setPassword('');
      }
      setLoading(false);
    },800);
  };

  const tabs=[
    {id: 'overview',label: 'Overview',icon: FiGrid},
    {id: 'announcements',label: 'Announcements',icon: FiBell},
    {id: 'sermons',label: 'Sermons',icon: FiPlay},
    {id: 'events',label: 'Events',icon: FiCalendar},
    {id: 'classes',label: 'Classes',icon: FiBookOpen},
    {id: 'resources',label: 'Resources',icon: FiBookOpen},
    {id: 'ministries',label: 'Ministries',icon: FiHeart},
    {id: 'staff',label: 'Staff Contacts',icon: FiUsers},
    {id: 'featured',label: 'Featured Buttons',icon: FiStar},
    {id: 'campaign',label: 'Growth Campaign',icon: FiTrendingUp},
    {id: 'comments',label: 'Comments',icon: FiMessageSquare},
    {id: 'links',label: 'Leadership Links',icon: FiExternalLink},
  ];

  const renderContent=()=> {
    switch (activeTab) {
      case 'overview':
        return <AdminDashboard onNavigate={(tab)=> setActiveTab(tab)} />;
      case 'announcements':
        return <AdminAnnouncements />;
      case 'sermons':
        return <AdminSermons />;
      case 'events':
        return <AdminEvents />;
      case 'classes':
        return <AdminClasses />;
      case 'resources':
        return <AdminResources />;
      case 'ministries':
        return <AdminMinistries />;
      case 'staff':
        return <AdminStaffContacts />;
      case 'featured':
        return <AdminFeaturedButtons />;
      case 'campaign':
        return <AdminCapitalCampaign />;
      case 'comments':
        return <AdminComments />;
      case 'links':
        return <AdminLeadershipLinks />;
      default:
        return <AdminDashboard onNavigate={(tab)=> setActiveTab(tab)} />;
    }
  };

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center relative" style={{backgroundColor: '#fcfaf2'}}>
        {/* Back to Home Button - Top Right */}
        <div className="fixed top-6 right-6 z-50">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            style={{backgroundColor: '#83A682'}}
            title="Back to Home"
          >
            <SafeIcon icon={FiHome} className="h-5 w-5 text-white" />
          </Link>
        </div>

        <LoadingTransition isLoading={loading} skeleton={<SkeletonForm />}>
          <motion.div
            initial={{opacity: 0,scale: 0.9}}
            animate={{opacity: 1,scale: 1}}
            transition={{duration: 0.5}}
            className="bg-white rounded-3xl shadow-modern-lg p-8 max-w-md w-full mx-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiLock} className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2 font-fraunces">
                Admin Access
              </h1>
              <p className="text-text-light font-inter">
                Please enter the admin password to continue
              </p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="admin-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e)=> setPassword(e.target.value)}
                  required
                  className="admin-input"
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm font-inter">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? 'Authenticating...' : 'Access Admin Dashboard'}
              </button>
            </form>
          </motion.div>
        </LoadingTransition>
      </div>
    );
  }

  // Main admin dashboard (shown after authentication)
  return (
    <div className="min-h-screen py-12 relative" style={{backgroundColor: '#fcfaf2'}}>
      {/* Back to Home Button - Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <Link
          to="/"
          className="inline-flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          style={{backgroundColor: '#83A682'}}
          title="Back to Home"
        >
          <SafeIcon icon={FiHome} className="h-5 w-5 text-white" />
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{opacity: 0,y: 30}}
            animate={{opacity: 1,y: 0}}
            transition={{duration: 0.8}}
            className="flex items-center justify-center space-x-4 mb-6"
          >
            <SafeIcon icon={FiSettings} className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
              Admin Dashboard
            </h1>
          </motion.div>
          <motion.p
            initial={{opacity: 0,y: 30}}
            animate={{opacity: 1,y: 0}}
            transition={{duration: 0.8,delay: 0.2}}
            className="text-xl text-text-primary"
          >
            Manage your church portal content and notifications
          </motion.p>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{opacity: 0,y: 30}}
          animate={{opacity: 1,y: 0}}
          transition={{duration: 0.8,delay: 0.4}}
          className="bg-white rounded-2xl shadow-modern mb-8 p-4"
        >
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {tabs.map((tab)=> (
              <button
                key={tab.id}
                onClick={()=> setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl font-semibold text-xs transition-all duration-200 ${
                  activeTab===tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-light hover:text-text-primary hover:bg-accent'
                }`}
              >
                <SafeIcon icon={tab.icon} className="h-5 w-5 flex-shrink-0" />
                <span className="text-center leading-tight">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{opacity: 0,y: 30}}
          animate={{opacity: 1,y: 0}}
          transition={{duration: 0.8,delay: 0.6}}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;