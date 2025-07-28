import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiBell, FiPlay, FiMic, FiUsers, FiCreditCard, FiUserPlus, FiMail, FiCalendar, FiBookOpen, FiSettings, FiFacebook, FiInstagram, FiYoutube } = FiIcons;

const Home = () => {
  const [hasEvents, setHasEvents] = useState(false);
  const [hasClasses, setHasClasses] = useState(false);
  const [hasResources, setHasResources] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      // Check for events
      const { data: events } = await supabase
        .from('events_portal123')
        .select('id')
        .limit(1);

      // Check for classes
      const { data: classes } = await supabase
        .from('classes_portal123')
        .select('id')
        .limit(1);

      // Check for resources
      const { data: resources } = await supabase
        .from('resources_portal123')
        .select('id')
        .limit(1);

      setHasEvents(events && events.length > 0);
      setHasClasses(classes && classes.length > 0);
      setHasResources(resources && resources.length > 0);
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoError = () => {
    setLogoError(true);
  };

  // Core buttons that always appear (first row)
  const coreButtons = [
    {
      title: 'Announcements',
      description: 'Latest church news and updates',
      icon: FiBell,
      path: '/announcements',
    },
    {
      title: 'Sermon Blog',
      description: 'Weekly sermons and discussion',
      icon: FiPlay,
      path: '/sermon-blog',
    },
    {
      title: 'Shine Podcast',
      description: 'Latest podcast episodes',
      icon: FiMic,
      path: '/shine-podcast',
    },
  ];

  // Second row buttons
  const secondRowButtons = [
    {
      title: 'Give',
      description: 'Online giving portal',
      icon: FiCreditCard,
      path: '/give',
    },
    // Conditionally include resources
    ...(hasResources
      ? [
          {
            title: 'Resources',
            description: 'Books and helpful materials',
            icon: FiBookOpen,
            path: '/resources',
          },
        ]
      : []),
    // Conditionally include event registration
    ...(hasEvents
      ? [
          {
            title: 'Events',
            description: 'Upcoming church events',
            icon: FiCalendar,
            path: '/event-registration',
          },
        ]
      : []),
    // Conditionally include class registration
    ...(hasClasses
      ? [
          {
            title: 'Classes',
            description: 'Available church classes',
            icon: FiBookOpen,
            path: '/class-registration',
          },
        ]
      : []),
  ];

  // Bottom row buttons (always at bottom)
  const bottomButtons = [
    {
      title: 'Table Group Sign-Up',
      description: 'Join a small group',
      icon: FiUsers,
      path: '/table-group-signup',
    },
    {
      title: 'Join Realm',
      description: 'Become a member',
      icon: FiUserPlus,
      path: '/join-realm',
    },
    {
      title: 'Contact',
      description: 'Get in touch with us',
      icon: FiMail,
      path: '/contact',
    },
  ];

  // Calculate how many rows we need
  let allButtons = [];

  // If we have additional content, organize in proper rows
  if (hasEvents || hasClasses || hasResources) {
    // First row: Core buttons (3 buttons)
    allButtons = [...coreButtons];

    // Second row: Give + Resources/Events/Classes
    allButtons = [...allButtons, ...secondRowButtons];

    // Third row: Bottom buttons (3 buttons)
    allButtons = [...allButtons, ...bottomButtons];
  } else {
    // No additional content - organize in 2 rows
    // First row: Announcements, Sermon Blog, Shine Podcast
    // Second row: Give, Table Group Sign-Up, Join Realm, Contact
    allButtons = [
      ...coreButtons,
      {
        title: 'Give',
        description: 'Online giving portal',
        icon: FiCreditCard,
        path: '/give',
      },
      {
        title: 'Table Group Sign-Up',
        description: 'Join a small group',
        icon: FiUsers,
        path: '/table-group-signup',
      },
      {
        title: 'Join Realm',
        description: 'Become a member',
        icon: FiUserPlus,
        path: '/join-realm',
      },
    ];

    // Add contact as the last button
    allButtons.push({
      title: 'Contact',
      description: 'Get in touch with us',
      icon: FiMail,
      path: '/contact',
    });
  }

  const socialLinks = [
    {
      name: 'Facebook',
      icon: FiFacebook,
      url: 'https://www.facebook.com/urfellowship/',
      hoverColor: 'hover:text-blue-600',
    },
    {
      name: 'Instagram',
      icon: FiInstagram,
      url: 'https://www.instagram.com/urfellowship/',
      hoverColor: 'hover:text-pink-600',
    },
    {
      name: 'YouTube',
      icon: FiYoutube,
      url: 'https://www.youtube.com/c/TheUpperRoomFellowship',
      hoverColor: 'hover:text-red-600',
    },
  ];

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: '#fcfaf2' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center mb-2"
          >
            {!logoError ? (
              <img
                src="/logo.png"
                alt="Upper Room Fellowship"
                className="h-16 w-auto mb-4"
                onError={handleLogoError}
              />
            ) : (
              <div className="mb-4">
                {/* Fallback content if logo fails to load */}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-secondary font-inter">
              Upper Room Fellowship
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-secondary font-inter font-bold"
          >
            Your hub for church life and community connection
          </motion.p>
        </div>

        {/* Social Media Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center space-x-6 mb-12"
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="text-social-green hover:text-secondary transition-colors duration-300 transform hover:scale-110"
              title={`Follow us on ${social.name}`}
            >
              <SafeIcon icon={social.icon} className="h-8 w-8" />
            </motion.a>
          ))}
        </motion.div>

        {/* Portal Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allButtons.map((button, index) => (
            <motion.div
              key={`${button.title}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
            >
              <Link
                to={button.path}
                className="relative overflow-hidden text-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 block text-center group border border-gray-200 h-full flex flex-col justify-center items-center min-h-[200px]"
                style={{
                  background: 'linear-gradient(135deg, #506E6E 0%, #406060 100%)',
                }}
              >
                {/* Gradient overlay for hover effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #E2BA49 0%, #F0C660 100%)',
                  }}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  <SafeIcon
                    icon={button.icon}
                    className="h-12 w-12 mx-auto mb-4 text-yellow-400 group-hover:text-white group-hover:scale-110 transition-all duration-300"
                  />
                  <h3 className="text-xl font-bold mb-2 text-white font-inter">
                    {button.title}
                  </h3>
                  <p className="text-sm text-gray-200 group-hover:text-white font-inter">
                    {button.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Admin Link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
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