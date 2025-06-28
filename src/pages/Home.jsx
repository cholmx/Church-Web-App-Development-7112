import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiBell, FiPlay, FiMic, FiUsers, FiCreditCard, FiUserPlus, FiMail, FiCalendar, FiSettings } = FiIcons;

const Home = () => {
  const portalButtons = [
    {
      title: 'Announcements',
      description: 'Latest church news and updates',
      icon: FiBell,
      path: '/announcements'
    },
    {
      title: 'Sermon Blog',
      description: 'Weekly sermons and discussion',
      icon: FiPlay,
      path: '/sermon-blog'
    },
    {
      title: 'Shine Podcast',
      description: 'Latest podcast episodes',
      icon: FiMic,
      path: '/shine-podcast'
    },
    {
      title: 'Table Group Sign-Up',
      description: 'Join a small group',
      icon: FiUsers,
      path: '/table-group-signup'
    },
    {
      title: 'Event Registration',
      description: 'Sign up for church events',
      icon: FiCalendar,
      path: '/event-registration'
    },
    {
      title: 'Give',
      description: 'Online giving portal',
      icon: FiCreditCard,
      path: '/give'
    },
    {
      title: 'Join Realm',
      description: 'Become a member',
      icon: FiUserPlus,
      path: '/join-realm'
    },
    {
      title: 'Contact',
      description: 'Get in touch with us',
      icon: FiMail,
      path: '/contact'
    }
  ];

  return (
    <div className="min-h-screen bg-accent py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center space-x-4 mb-3"
          >
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">UR</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-secondary">
              Upper Room Fellowship
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-secondary"
          >
            Your hub for church life and community connection
          </motion.p>
        </div>

        {/* Portal Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {portalButtons.map((button, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={button.path}
                className="bg-white text-secondary p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 block text-center group border border-gray-200"
              >
                <SafeIcon
                  icon={button.icon}
                  className="h-12 w-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="text-xl font-semibold mb-2 text-secondary">{button.title}</h3>
                <p className="text-sm text-secondary opacity-75">{button.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Admin Link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-16 text-center"
        >
          <Link
            to="/admin"
            className="inline-flex items-center space-x-1 text-sm text-secondary-light hover:text-secondary transition-colors"
          >
            <SafeIcon icon={FiSettings} className="h-3 w-3" />
            <span>Admin</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;