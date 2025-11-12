import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {SkeletonGrid,LoadingTransition} from '../components/LoadingSkeletons';
import supabase from '../lib/supabase';

const {FiBell,FiPlay,FiMic,FiUsers,FiCreditCard,FiUserPlus,FiMail,FiCalendar,FiBookOpen,FiSettings,FiFacebook,FiInstagram,FiYoutube}=FiIcons;

const Home=()=> {
  const [hasEvents,setHasEvents]=useState(false);
  const [hasClasses,setHasClasses]=useState(false);
  const [hasResources,setHasResources]=useState(false);
  const [loading,setLoading]=useState(true);

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
      // Add a minimum delay to show skeleton
      setTimeout(()=> setLoading(false),800);
    }
  };

  // Featured buttons at the top (Classes and Events)
  const featuredButtons=[
    ...(hasClasses
      ? [
        {
          title: 'Classes',
          description: 'Available church classes',
          icon: FiBookOpen,
          path: '/class-registration'
        }
      ]
      : []),
    ...(hasEvents
      ? [
        {
          title: 'Events',
          description: 'Upcoming church events',
          icon: FiCalendar,
          path: '/event-registration'
        }
      ]
      : [])
  ];

  // Main buttons (including Contact for desktop)
  const mainButtons=[
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
      title: 'Sermon Podcast',
      description: 'Listen to our sermon recordings',
      icon: FiPlay,
      path: '/sermon-podcast'
    },
    {
      title: 'Table Group Sign-Up',
      description: 'Join a small group',
      icon: FiUsers,
      path: '/table-group-signup'
    },
    {
      title: 'Give',
      description: 'Online giving portal',
      icon: FiCreditCard,
      path: '/give'
    },
    // Conditionally include resources
    ...(hasResources
      ? [
        {
          title: 'Resources',
          description: 'Books and helpful materials',
          icon: FiBookOpen,
          path: '/resources'
        }
      ]
      : []),
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

  // Mobile-only buttons (excluding Contact)
  const mobileMainButtons=mainButtons.filter(
    (button)=> button.title !=='Contact'
  );

  // Contact button (separate for mobile centering)
  const contactButton={
    title: 'Contact',
    description: 'Get in touch with us',
    icon: FiMail,
    path: '/contact'
  };

  const socialLinks=[
    {
      name: 'Facebook',
      icon: FiFacebook,
      url: 'https://www.facebook.com/urfellowship/',
      hoverColor: 'hover:text-blue-600'
    },
    {
      name: 'Instagram',
      icon: FiInstagram,
      url: 'https://www.instagram.com/urfellowship/',
      hoverColor: 'hover:text-pink-600'
    },
    {
      name: 'YouTube',
      icon: FiYoutube,
      url: 'https://www.youtube.com/c/TheUpperRoomFellowship',
      hoverColor: 'hover:text-red-600'
    }
  ];

  // Custom skeleton for featured buttons (horizontal layout)
  const FeaturedButtonsSkeleton=()=> (
    <div className="mb-4 flex justify-center">
      <div className="flex justify-center gap-4">
        {Array.from({length: featuredButtons.length || 2}).map((_,i)=> (
          <div
            key={i}
            className="animate-pulse bg-gray-200 rounded-lg shadow-md featured-skeleton"
            style={{
              // Mobile: 160px x 120px,Desktop: 225px x 150px (matches actual buttons)
              width: '160px',
              height: '120px'
            }}
          >
            <div className="p-4 flex flex-col items-center justify-center h-full">
              <div className="w-6 h-6 bg-gray-300 rounded-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-16 mb-1"></div>
              <div className="h-2 bg-gray-300 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Custom skeleton for main buttons (matches actual layout)
  const MainButtonsSkeleton=()=> (
    <div className="mb-8 flex justify-center">
      {/* Desktop: 3x3 Grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-4">
        {Array.from({length: 9}).map((_,i)=> (
          <div
            key={i}
            className="animate-pulse bg-gray-200 rounded-lg shadow-md"
            style={{width: '225px',height: '150px'}}
          >
            <div className="p-7 flex flex-col items-center justify-center h-full">
              <div className="w-7 h-7 bg-gray-300 rounded-full mb-3"></div>
              <div className="h-3 bg-gray-300 rounded w-20 mb-1"></div>
              <div className="h-2 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
      {/* Mobile: 2 columns */}
      <div className="grid grid-cols-2 md:hidden gap-3">
        {Array.from({length: 8}).map((_,i)=> (
          <div
            key={i}
            className="animate-pulse bg-gray-200 rounded-lg shadow-md"
            style={{width: '160px',height: '120px'}}
          >
            <div className="p-4 flex flex-col items-center justify-center h-full">
              <div className="w-5 h-5 bg-gray-300 rounded-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-16 mb-1"></div>
              <div className="h-2 bg-gray-300 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Contact button skeleton for mobile
  const ContactButtonSkeleton=()=> (
    <div className="flex justify-center mt-4 md:hidden">
      <div
        className="animate-pulse bg-gray-200 rounded-lg shadow-md"
        style={{width: '160px',height: '120px'}}
      >
        <div className="p-4 flex flex-col items-center justify-center h-full">
          <div className="w-5 h-5 bg-gray-300 rounded-full mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-16 mb-1"></div>
          <div className="h-2 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12" style={{backgroundColor: '#fcfaf2'}}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{opacity: 0,y: 30}}
            animate={{opacity: 1,y: 0}}
            transition={{duration: 0.8}}
            className="flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center">
              <h1 className="text-2xl md:text-3xl text-secondary">
                Upper Room Fellowship
              </h1>
              <p className="text-sm text-secondary mt-1">
                Your hub for church life
              </p>
            </div>
          </motion.div>
        </div>

        {/* FEATURED SECTION - Classes and Events with Loading */}
        {loading ? (
          <FeaturedButtonsSkeleton />
        ) : (
          featuredButtons.length > 0 && (
            <div className="mb-4 flex justify-center">
              {/* Center the featured buttons */}
              <div className="flex justify-center gap-4">
                {featuredButtons.map((button,index)=> (
                  <motion.div
                    key={`featured-${button.title}-${index}`}
                    initial={{opacity: 0,y: 30}}
                    animate={{opacity: 1,y: 0}}
                    transition={{duration: 0.6,delay: 0.5 + index * 0.1}}
                  >
                    <Link
                      to={button.path}
                      className="relative overflow-hidden text-white p-4 md:p-7 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 block text-center group border border-gray-200 flex flex-col justify-center items-center featured-button"
                      style={{
                        background: 'linear-gradient(135deg,#E2BA49 0%,#F0C660 100%)',
                        // Mobile: 160px x 120px (same as mobile main buttons)
                        width: '160px',
                        height: '120px'
                      }}
                    >
                      {/* Blue overlay for hover effect */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{background: 'linear-gradient(135deg,#2c4747 0%,#1a2a2a 100%)'}}
                      ></div>
                      {/* Content */}
                      <div className="relative z-10">
                        <SafeIcon
                          icon={button.icon}
                          className="h-5 w-5 md:h-7 md:w-7 mx-auto mb-2 md:mb-3 text-white group-hover:text-yellow-400 group-hover:scale-110 transition-all duration-300"
                        />
                        <h3 className="text-xs md:text-sm mb-1 text-white leading-tight">
                          {button.title}
                        </h3>
                        <p className="text-xs text-white group-hover:text-white opacity-90 leading-tight">
                          {button.description}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        )}

        {/* MAIN BUTTONS SECTION with Loading */}
        {loading ? (
          <>
            <MainButtonsSkeleton />
            <ContactButtonSkeleton />
          </>
        ) : (
          <>
            <div className="mb-8 flex justify-center">
              {/* Desktop: 3x3 Grid with Contact included */}
              <div className="hidden md:grid md:grid-cols-3 gap-4">
                {mainButtons.map((button,index)=> (
                  <motion.div
                    key={`desktop-button-${button.title}-${index}`}
                    initial={{opacity: 0,y: 30}}
                    animate={{opacity: 1,y: 0}}
                    transition={{duration: 0.5,delay: 0.7 + index * 0.05}}
                  >
                    <Link
                      to={button.path}
                      className="relative overflow-hidden text-white p-7 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 block text-center group border border-gray-200 flex flex-col justify-center items-center"
                      style={{
                        background: 'linear-gradient(135deg,#2c4747 0%,#1a2a2a 100%)',
                        width: '225px',
                        height: '150px'
                      }}
                    >
                      {/* Gradient overlay for hover effect */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{background: 'linear-gradient(135deg,#E2BA49 0%,#F0C660 100%)'}}
                      ></div>
                      {/* Content */}
                      <div className="relative z-10">
                        <SafeIcon
                          icon={button.icon}
                          className="h-7 w-7 mx-auto mb-3 text-yellow-400 group-hover:text-white group-hover:scale-110 transition-all duration-300"
                        />
                        <h3 className="text-sm mb-1 text-white leading-tight">
                          {button.title}
                        </h3>
                        <p className="text-xs text-gray-200 group-hover:text-white opacity-80 leading-tight">
                          {button.description}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              {/* Mobile: 2 columns WITHOUT Contact */}
              <div className="grid grid-cols-2 md:hidden gap-3">
                {mobileMainButtons.map((button,index)=> (
                  <motion.div
                    key={`mobile-button-${button.title}-${index}`}
                    initial={{opacity: 0,y: 30}}
                    animate={{opacity: 1,y: 0}}
                    transition={{duration: 0.5,delay: 0.7 + index * 0.05}}
                  >
                    <Link
                      to={button.path}
                      className="relative overflow-hidden text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 block text-center group border border-gray-200 flex flex-col justify-center items-center"
                      style={{
                        background: 'linear-gradient(135deg,#2c4747 0%,#1a2a2a 100%)',
                        width: '160px',
                        height: '120px'
                      }}
                    >
                      {/* Gradient overlay for hover effect */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{background: 'linear-gradient(135deg,#E2BA49 0%,#F0C660 100%)'}}
                      ></div>
                      {/* Content */}
                      <div className="relative z-10">
                        <SafeIcon
                          icon={button.icon}
                          className="h-5 w-5 mx-auto mb-2 text-yellow-400 group-hover:text-white group-hover:scale-110 transition-all duration-300"
                        />
                        <h3 className="text-xs mb-1 text-white leading-tight">
                          {button.title}
                        </h3>
                        <p className="text-xs text-gray-200 group-hover:text-white opacity-80 leading-tight">
                          {button.description}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* MOBILE ONLY: Contact button centered below main grid */}
            <div className="flex justify-center mt-4 md:hidden">
              <motion.div
                key="mobile-contact-button"
                initial={{opacity: 0,y: 30}}
                animate={{opacity: 1,y: 0}}
                transition={{
                  duration: 0.5,
                  delay: 0.7 + mobileMainButtons.length * 0.05
                }}
              >
                <Link
                  to={contactButton.path}
                  className="relative overflow-hidden text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 block text-center group border border-gray-200 flex flex-col justify-center items-center"
                  style={{
                    background: 'linear-gradient(135deg,#2c4747 0%,#1a2a2a 100%)',
                    width: '160px',
                    height: '120px'
                  }}
                >
                  {/* Gradient overlay for hover effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{background: 'linear-gradient(135deg,#E2BA49 0%,#F0C660 100%)'}}
                  ></div>
                  {/* Content */}
                  <div className="relative z-10">
                    <SafeIcon
                      icon={contactButton.icon}
                      className="h-5 w-5 mx-auto mb-2 text-yellow-400 group-hover:text-white group-hover:scale-110 transition-all duration-300"
                    />
                    <h3 className="text-xs mb-1 text-white leading-tight">
                      {contactButton.title}
                    </h3>
                    <p className="text-xs text-gray-200 group-hover:text-white opacity-80 leading-tight">
                      {contactButton.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            </div>
          </>
        )}

        {/* Social Links */}
        <motion.div
          initial={{opacity: 0,y: 30}}
          animate={{opacity: 1,y: 0}}
          transition={{duration: 0.8,delay: 1.2}}
          className="mt-16 text-center"
        >
          <h3 className="text-lg text-secondary mb-4">Follow Us</h3>
          <div className="flex justify-center space-x-6">
            {socialLinks.map((social,index)=> (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{opacity: 0,scale: 0.8}}
                animate={{opacity: 1,scale: 1}}
                transition={{duration: 0.5,delay: 1.3 + index * 0.1}}
                className="text-social-green hover:text-secondary transition-colors duration-300 transform hover:scale-110"
                title={`Follow us on ${social.name}`}
              >
                <SafeIcon icon={social.icon} className="h-8 w-8" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Admin Link */}
        <motion.div
          initial={{opacity: 0,y: 30}}
          animate={{opacity: 1,y: 0}}
          transition={{duration: 0.8,delay: 1.4}}
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
      {/* CSS for responsive featured buttons */}
      <style jsx>{`
        /* Featured button responsive sizing */
        @media (min-width: 768px) {
          .featured-button {
            width: 225px !important;
            height: 150px !important;
          }
          .featured-skeleton {
            width: 225px !important;
            height: 150px !important;
          }
        }
        /* Ensure mobile sizing is consistent */
        @media (max-width: 767px) {
          .featured-button,
          .featured-skeleton {
            width: 160px !important;
            height: 120px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;