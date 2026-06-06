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

const {FiSettings,FiBell,FiPlay,FiCalendar,FiBookOpen,FiHome,FiLock,FiMic,FiExternalLink}=FiIcons;

const Admin=()=> {
  const [isAuthenticated,setIsAuthenticated]=useState(false);
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [activeTab,setActiveTab]=useState('announcements');
  const [loading,setLoading]=useState(false);

  const ADMIN_PASSWORD='urf500admin';

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
    {id: 'announcements',label: 'Announcements',icon: FiBell},
    {id: 'sermons',label: 'Sermons',icon: FiPlay},
    {id: 'events',label: 'Events',icon: FiCalendar},
    {id: 'classes',label: 'Classes',icon: FiBookOpen},
    {id: 'resources',label: 'Resources',icon: FiBookOpen},
  ];

  const renderContent=()=> {
    switch (activeTab) {
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
      default:
        return <AdminAnnouncements />;
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
            className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiLock} className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-secondary mb-2 font-fraunces">
                Admin Access
              </h1>
              <p className="text-secondary-light font-inter">
                Please enter the admin password to continue
              </p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e)=> setPassword(e.target.value)}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
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
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors font-inter disabled:opacity-50"
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
            <h1 className="text-4xl md:text-5xl font-bold text-secondary">
              Admin Dashboard
            </h1>
          </motion.div>
          <motion.p
            initial={{opacity: 0,y: 30}}
            animate={{opacity: 1,y: 0}}
            transition={{duration: 0.8,delay: 0.2}}
            className="text-xl text-secondary"
          >
            Manage your church portal content and notifications
          </motion.p>
        </div>

        {/* Hidden Pages Quick Access */}
        <motion.div
          initial={{opacity: 0,y: 30}}
          animate={{opacity: 1,y: 0}}
          transition={{duration: 0.8,delay: 0.3}}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-secondary mb-4 font-inter flex items-center space-x-2">
            <SafeIcon icon={FiMic} className="h-5 w-5 text-primary" />
            <span>Hidden Podcast Pages</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/yellow"
              className="flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg hover:bg-yellow-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{backgroundColor: '#E2BA49'}}
                >
                  <SafeIcon icon={FiMic} className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary font-inter">Yellow Podcast</h4>
                  <p className="text-sm text-secondary-light font-inter">Hidden podcast page</p>
                </div>
              </div>
              <SafeIcon icon={FiExternalLink} className="h-4 w-4 text-secondary-light group-hover:text-secondary transition-colors" />
            </Link>
            <Link
              to="/green"
              className="flex items-center justify-between p-4 border-2 border-green-400 rounded-lg hover:bg-green-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{backgroundColor: '#83A682'}}
                >
                  <SafeIcon icon={FiMic} className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary font-inter">Green Podcast</h4>
                  <p className="text-sm text-secondary-light font-inter">Hidden podcast page</p>
                </div>
              </div>
              <SafeIcon icon={FiExternalLink} className="h-4 w-4 text-secondary-light group-hover:text-secondary transition-colors" />
            </Link>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 font-inter">
              <strong>Note:</strong> These pages are hidden from the main navigation and can only be accessed via direct links or through this admin panel.
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{opacity: 0,y: 30}}
          animate={{opacity: 1,y: 0}}
          transition={{duration: 0.8,delay: 0.4}}
          className="bg-white rounded-lg shadow-md mb-8"
        >
          <div className="border-b border-accent">
            <nav className="flex space-x-8 px-8 overflow-x-auto">
              {tabs.map((tab)=> (
                <button
                  key={tab.id}
                  onClick={()=> setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                    activeTab===tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-secondary hover:text-primary'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={tab.icon} className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
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