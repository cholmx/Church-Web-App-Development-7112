import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const {FiBell,FiPlay,FiMic,FiUsers,FiCreditCard,FiUserPlus,FiMail,FiCalendar,FiBookOpen,FiSettings,FiFacebook,FiInstagram,FiYoutube}=FiIcons;

const Home=()=> {
  const [hasEvents,setHasEvents]=useState(false);
  const [hasClasses,setHasClasses]=useState(false);
  const [hasResources,setHasResources]=useState(false);
  const [loading,setLoading]=useState(true);
  const [logoError,setLogoError]=useState(false);

  useEffect(()=> {
    checkAvailability();
  },[]);

  const checkAvailability=async ()=> {
    try {
      // Check for events
      const {data: events}=await supabase
        .from('events_portal123')
        .select('id')
        .limit(1);

      // Check for classes
      const {data: classes}=await supabase
        .from('classes_portal123')
        .select('id')
        .limit(1);

      // Check for resources
      const {data: resources}=await supabase
        .from('resources_portal123')
        .select('id')
        .limit(1);

      setHasEvents(events && events.length > 0);
      setHasClasses(classes && classes.length > 0);
      setHasResources(resources && resources.length > 0);
    } catch (error) {
      console.error('Error checking availability:',error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoError=()=> {
    setLogoError(true);
  };

  // Featured buttons at the top (Classes and Events)
  const featuredButtons=[
    ...(hasClasses ? [
      {
        title: 'Classes',
        description: 'Available church classes',
        icon: FiBookOpen,
        path: '/class-registration',
      },
    ] : []),
    ...(hasEvents ? [
      {
        title: 'Events',
        description: 'Upcoming church events',
        icon: FiCalendar,
        path: '/event-registration',
      },
    ] : []),
  ];

  // Main buttons (including Contact for desktop)
  const mainButtons=[
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
    {
      title: 'Sermon Podcast',
      description: 'Listen to our sermon recordings',
      icon: FiPlay,
      path: '/sermon-podcast',
    },
    {
      title: 'Table Group Sign-Up',
      description: 'Join a small group',
      icon: FiUsers,
      path: '/table-group-signup',
    },
    {
      title: 'Give',
      description: 'Online giving portal',
      icon: FiCreditCard,
      path: '/give',
    },
    // Conditionally include resources
    ...(hasResources ? [
      {
        title: 'Resources',
        description: 'Books and helpful materials',
        icon: FiBookOpen,
        path: '/resources',
      },
    ] : []),
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

  // Mobile-only buttons (excluding Contact)
  const mobileMainButtons=mainButtons.filter(button=> button.title !=='Contact');

  // Contact button (separate for mobile centering)
  const contactButton={
    title: 'Contact',
    description: 'Get in touch with us',
    icon: FiMail,
    path: '/contact',
  };

  const socialLinks=[
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
    <div className="min-h-screen py-12" style={{backgroundColor: '#fcfaf2'}}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{opacity: 0,y: 30}}
            animate={{opacity: 1,y: 0}}
            transition={{duration: 0.8}}
            className="flex flex-col items-center justify-center"
          >
            {!logoError ? (
              <img
                src="/logo.png"
                alt="Upper Room Fellowship"
                className="h-12 w-auto mb-3"
                onError={handleLogoError}
              />
            ) : (
              <div className="mb-3">
                {/* Fallback content if logo fails to load */}
              </div>
            )}

            {/* Desktop: Title and Social Icons Side by Side */}
            <div className="hidden md:flex md:items-center md:justify-center md:space-x-8 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-secondary" style={{fontFamily: 'Inter Tight,sans-serif'}}>
                Upper Room Fellowship
              </h1>
              
              {/* Social Media Icons - Desktop Only */}
              <div className="flex space-x-4">
                {socialLinks.map((social,index)=> (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{opacity: 0,scale: 0.8}}
                    animate={{opacity: 1,scale: 1}}
                    transition={{duration: 0.5,delay: 0.4 + index * 0.1}}
                    className="text-social-green hover:text-secondary transition-colors duration-300 transform hover:scale-110"
                    title={`Follow us on ${social.name}`}
                  >
                    <SafeIcon icon={social.icon} className="h-7 w-7" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Mobile: Title Only */}
            <h1 className="md:hidden text-2xl md:text-3xl font-bold text-secondary mb-1" style={{fontFamily: 'Inter Tight,sans-serif'}}>
              Upper Room Fellowship
            </h1>

            <p className="text-sm text-secondary" style={{fontFamily: 'Inter,sans-serif',fontWeight: '400'}}>
              Your hub for church life and community connection
            </p>
          </motion.div>
        </div>

        {/* Social Media Icons - Mobile Only */}
        <motion.div
          initial={{opacity: 0,y: 20}}
          animate={{opacity: 1,y: 0}}
          transition={{duration: 0.8,delay: 0.3}}
          className="flex md:hidden justify-center space-x-6 mb-12"
        >
          {socialLinks.map((social,index)=> (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{opacity: 0,scale: 0.8}}
              animate={{opacity: 1,scale: 1}}
              transition={{duration: 0.5,delay: 0.4 + index * 0.1}}
              className="text-social-green hover:text-secondary transition-colors duration-300 transform hover:scale-110"
              title={`Follow us on ${social.name}`}
            >
              <SafeIcon icon={social.icon} className="h-9 w-9" />
            </motion.a>
          ))}
        </motion.div>

        {/* FEATURED SECTION - Classes and Events */}
        {featuredButtons.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
              {featuredButtons.map((button,index)=> (
                <motion.div
                  key={`featured-${button.title}-${index}`}
                  initial={{opacity: 0,y: 30}}
                  animate={{opacity: 1,y: 0}}
                  transition={{duration: 0.6,delay: 0.5 + index * 0.1}}
                  className="flex-shrink-0"
                >
                  <Link
                    to={button.path}
                    className="relative overflow-hidden text-white p-7 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 block text-center group border-2 border-yellow-400 h-full flex flex-col justify-center items-center w-[291px] h-[185px]"
                    style={{background: 'linear-gradient(135deg,#E2BA49 0%,#F0C660 100%)',}}
                  >
                    {/* Gradient overlay for hover effect */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{background: 'linear-gradient(135deg,#2c4747 0%,#1a2a2a 100%)',}}
                    ></div>

                    {/* Content */}
                    <div className="relative z-10">
                      <SafeIcon icon={button.icon} className="h-9 w-9 mx-auto mb-3 text-white group-hover:text-yellow-400 group-hover:scale-110 transition-all duration-300" />
                      <h3 className="text-base font-bold mb-1 text-white font-inter leading-tight">
                        {button.title}
                      </h3>
                      <p className="text-sm text-white opacity-90 font-inter leading-tight">
                        {button.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* MAIN BUTTONS SECTION */}
        <div className="mb-8">
          {/* Desktop: 3x3 Grid with Contact included */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {mainButtons.map((button,index)=> (
              <motion.div
                key={`desktop-button-${button.title}-${index}`}
                initial={{opacity: 0,y: 30}}
                animate={{opacity: 1,y: 0}}
                transition={{duration: 0.5,delay: 0.7 + index * 0.05}}
              >
                <Link
                  to={button.path}
                  className="relative overflow-hidden text-white p-7 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 block text-center group border border-gray-200 h-full flex flex-col justify-center items-center w-full h-[185px]"
                  style={{background: 'linear-gradient(135deg,#2c4747 0%,#1a2a2a 100%)',}}
                >
                  {/* Gradient overlay for hover effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{background: 'linear-gradient(135deg,#E2BA49 0%,#F0C660 100%)',}}
                  ></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <SafeIcon icon={button.icon} className="h-9 w-9 mx-auto mb-3 text-yellow-400 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                    <h3 className="text-base font-bold mb-1 text-white font-inter leading-tight">
                      {button.title}
                    </h3>
                    <p className="text-sm text-gray-200 group-hover:text-white font-inter opacity-80 leading-tight">
                      {button.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile: 2 columns WITHOUT Contact */}
          <div className="grid grid-cols-2 md:hidden gap-4 max-w-3xl mx-auto">
            {mobileMainButtons.map((button,index)=> (
              <motion.div
                key={`mobile-button-${button.title}-${index}`}
                initial={{opacity: 0,y: 30}}
                animate={{opacity: 1,y: 0}}
                transition={{duration: 0.5,delay: 0.7 + index * 0.05}}
              >
                <Link
                  to={button.path}
                  className="relative overflow-hidden text-white p-7 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 block text-center group border border-gray-200 h-full flex flex-col justify-center items-center w-full h-[185px]"
                  style={{background: 'linear-gradient(135deg,#2c4747 0%,#1a2a2a 100%)',}}
                >
                  {/* Gradient overlay for hover effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{background: 'linear-gradient(135deg,#E2BA49 0%,#F0C660 100%)',}}
                  ></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <SafeIcon icon={button.icon} className="h-9 w-9 mx-auto mb-3 text-yellow-400 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                    <h3 className="text-base font-bold mb-1 text-white font-inter leading-tight">
                      {button.title}
                    </h3>
                    <p className="text-sm text-gray-200 group-hover:text-white font-inter opacity-80 leading-tight">
                      {button.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* MOBILE ONLY: Contact button centered below main grid */}
          <div className="flex justify-center mt-4 md:hidden">
            <motion.div
              key="mobile-contact-button"
              initial={{opacity: 0,y: 30}}
              animate={{opacity: 1,y: 0}}
              transition={{duration: 0.5,delay: 0.7 + mobileMainButtons.length * 0.05}}
              className="w-full max-w-[calc(50%-0.5rem)]"
            >
              <Link
                to={contactButton.path}
                className="relative overflow-hidden text-white p-7 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 block text-center group border border-gray-200 h-full flex flex-col justify-center items-center w-full h-[185px]"
                style={{background: 'linear-gradient(135deg,#2c4747 0%,#1a2a2a 100%)',}}
              >
                {/* Gradient overlay for hover effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{background: 'linear-gradient(135deg,#E2BA49 0%,#F0C660 100%)',}}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  <SafeIcon icon={contactButton.icon} className="h-9 w-9 mx-auto mb-3 text-yellow-400 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  <h3 className="text-base font-bold mb-1 text-white font-inter leading-tight">
                    {contactButton.title}
                  </h3>
                  <p className="text-sm text-gray-200 group-hover:text-white font-inter opacity-80 leading-tight">
                    {contactButton.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Admin Link */}
        <motion.div
          initial={{opacity: 0,y: 30}}
          animate={{opacity: 1,y: 0}}
          transition={{duration: 0.8,delay: 1.2}}
          className="mt-16 text-center"
        >
          <Link
            to="/admin"
            className="inline-flex items-center space-x-1 text-base text-secondary-light hover:text-secondary transition-colors"
          >
            <SafeIcon icon={FiSettings} className="h-4 w-4" />
            <span>Admin</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;