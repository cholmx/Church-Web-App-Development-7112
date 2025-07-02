import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import DailyScripture from '../components/DailyScripture';
import supabase from '../lib/localStorage';

const {
  FiBell,
  FiPlay,
  FiMic,
  FiUsers,
  FiCreditCard,
  FiUserPlus,
  FiMail,
  FiCalendar,
  FiBookOpen,
  FiSettings,
  FiFacebook,
  FiInstagram,
  FiYoutube,
} = FiIcons;

const Home = () => {
  const [hasEvents, setHasEvents] = useState(false);
  const [hasClasses, setHasClasses] = useState(false);
  const [hasResources, setHasResources] = useState(false);
  const [hasScriptures, setHasScriptures] = useState(false);
  const [loading, setLoading] = useState(true);

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
      const resourcesData = localStorage.getItem('resources_portal123');
      const resources = resourcesData ? JSON.parse(resourcesData) : null;

      // Check for scriptures
      const { data: scriptures } = await supabase
        .from('daily_scriptures_portal123')
        .select('id')
        .limit(1);

      setHasEvents(events && events.length > 0);
      setHasClasses(classes && classes.length > 0);
      setHasResources(resources && resources.length > 0 && resources[0].amazon_link);
      setHasScriptures(scriptures && scriptures.length > 0);
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setLoading(false);
    }
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
            description: 'Books and materials',
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
    // Second row: Give + Events/Classes/Resources
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
    <div className="min-h-screen bg-accent py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center space-x-4 mb-3"
          >
            <img
              src="/logo.png"
              alt="Upper Room Fellowship"
              className="h-16 w-auto"
              onError={(e) => {
                // Fallback to text logo if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden items-center space-x-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg font-inter">URF</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-secondary">
                Upper Room Fellowship
              </h1>
            </div>
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

        {/* Daily Scripture */}
        {hasScriptures && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <DailyScripture />
          </motion.div>
        )}

        {/* Social Media Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
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
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className={`text-primary ${social.hoverColor} transition-colors duration-300 transform hover:scale-110`}
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
                className="bg-white text-secondary p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 block text-center group border border-gray-200 h-full flex flex-col justify-center items-center min-h-[200px]"
              >
                <SafeIcon
                  icon={button.icon}
                  className="h-12 w-12 mx-auto mb-4 text-secondary group-hover:text-primary group-hover:scale-110 transition-all duration-300"
                />
                <h3 className="text-xl font-semibold mb-2 text-secondary">
                  {button.title}
                </h3>
                <p className="text-sm text-secondary opacity-75">{button.description}</p>
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