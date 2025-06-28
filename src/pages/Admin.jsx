import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AdminAnnouncements from '../components/AdminAnnouncements';
import AdminSermons from '../components/AdminSermons';
import AdminEvents from '../components/AdminEvents';

const { FiSettings, FiBell, FiPlay, FiCalendar, FiHome, FiLock } = FiIcons;

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('announcements');

  const ADMIN_PASSWORD = 'admin123'; // You can change this to any password you want

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  const tabs = [
    { id: 'announcements', label: 'Announcements', icon: FiBell },
    { id: 'sermons', label: 'Sermons', icon: FiPlay },
    { id: 'events', label: 'Events', icon: FiCalendar }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'announcements':
        return <AdminAnnouncements />;
      case 'sermons':
        return <AdminSermons />;
      case 'events':
        return <AdminEvents />;
      default:
        return <AdminAnnouncements />;
    }
  };

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-accent py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4"
        >
          {/* Home Link */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors font-inter"
            >
              <SafeIcon icon={FiHome} className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>

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
                onChange={(e) => setPassword(e.target.value)}
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
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors font-inter"
            >
              Access Admin Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Main admin dashboard (shown after authentication)
  return (
    <div className="min-h-screen bg-accent py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Home Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
          >
            <SafeIcon icon={FiHome} className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center space-x-4 mb-6"
          >
            <SafeIcon icon={FiSettings} className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-secondary">
              Admin Dashboard
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-secondary"
          >
            Manage your church portal content
          </motion.p>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-lg shadow-md mb-8"
        >
          <div className="border-b border-accent">
            <nav className="flex space-x-8 px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;