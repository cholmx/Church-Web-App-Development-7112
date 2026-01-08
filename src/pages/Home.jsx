import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const {FiBell,FiPlay,FiMic,FiUsers,FiCreditCard,FiUserPlus,FiMail,FiCalendar,FiBookOpen,FiSettings,FiFacebook,FiInstagram,FiYoutube,FiGlobe,FiHeart,FiLogIn,FiExternalLink,FiFileText,FiHeadphones}=FiIcons;

const Home=()=> {
  const [hasEvents,setHasEvents]=useState(false);
  const [hasClasses,setHasClasses]=useState(false);
  const [hasResources,setHasResources]=useState(false);
  const [featuredDbButtons,setFeaturedDbButtons]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=> {
    checkAvailability();
  },[]);

  const checkAvailability=async ()=> {
    try {
      const {data: events}=await supabase.from('events_portal123').select('id').limit(1);
      const {data: classes}=await supabase.from('classes_portal123').select('id').limit(1);
      const {data: resources}=await supabase.from('resources_portal123').select('id').limit(1);
      const {data: featuredButtons}=await supabase
        .from('featured_buttons_portal123')
        .select('*')
        .eq('is_active',true)
        .order('display_order',{ascending: true});

      setHasEvents(events && events.length > 0);
      setHasClasses(classes && classes.length > 0);
      setHasResources(resources && resources.length > 0);
      setFeaturedDbButtons(featuredButtons || []);
    } catch (error) {
      console.error('Error checking availability:',error);
    } finally {
      setTimeout(()=> setLoading(false),800);
    }
  };

  const featuredButtons=[
    ...featuredDbButtons.map(btn=> ({
      title: btn.title,
      description: btn.description,
      icon: FiCalendar,
      path: btn.path
    })),
    ...(hasClasses ? [{title: 'Classes',description: 'Available church classes',icon: FiBookOpen,path: '/class-registration'}] : []),
    ...(hasEvents ? [{title: 'Events',description: 'Upcoming church events',icon: FiCalendar,path: '/event-registration'}] : [])
  ];

  const mainButtons=[
    {title: 'Announcements',description: 'Latest church news',icon: FiBell,path: '/announcements',isInternal: true},
    {title: 'Sermon Blog',description: 'Weekly sermons',icon: FiFileText,path: '/sermon-blog',isInternal: true},
    {title: 'Shine Podcast',description: 'Latest episodes',icon: FiMic,path: '/shine-podcast',isInternal: true},
    {title: 'Sermon Podcast',description: 'Listen to recordings',icon: FiHeadphones,path: '/sermon-podcast',isInternal: true},
    {title: 'Table Group Sign-Up',description: 'Join a small group',icon: FiUsers,path: '/table-group-signup',isInternal: true},
    ...(hasResources ? [{title: 'Resources',description: 'Helpful materials',icon: FiBookOpen,path: '/resources',isInternal: true}] : []),
    {title: 'Join Realm',description: 'Become a member',icon: FiUserPlus,path: '/join-realm',isInternal: true},
    {title: 'Opportunities',description: 'Explore our opportunities',icon: FiHeart,path: '/ministries',isInternal: true},
    {title: 'Contact',description: 'Get in touch with us',icon: FiMail,path: '/contact',isInternal: true}
  ];

  const quickLinks=[
    {title: 'Give',icon: FiCreditCard,path: 'https://onrealm.org/urfellowship/-/form/give/now'},
    {title: 'Realm Login',icon: FiLogIn,path: 'https://onrealm.org/urfellowship/'},
    {title: 'Church Website',icon: FiGlobe,path: 'https://urfellowship.com'}
  ];

  const socialLinks=[
    {name: 'Facebook',icon: FiFacebook,url: 'https://www.facebook.com/urfellowship/'},
    {name: 'Instagram',icon: FiInstagram,url: 'https://www.instagram.com/urfellowship/'},
    {name: 'YouTube',icon: FiYoutube,url: 'https://www.youtube.com/c/TheUpperRoomFellowship'}
  ];

  const SkeletonButton=()=> (
    <div className="bg-accent-dark rounded-2xl animate-pulse w-[160px] h-[120px] md:w-[225px] md:h-[150px] p-4 flex flex-col items-center justify-center">
      <div className="w-8 h-8 bg-accent rounded-full mb-3"></div>
      <div className="h-4 bg-accent rounded w-20 mb-2"></div>
      <div className="h-3 bg-accent rounded w-24"></div>
    </div>
  );

  const SkeletonQuickLink=()=> (
    <div className="bg-accent-dark rounded-xl animate-pulse w-[120px] h-[60px] md:w-[140px] md:h-[70px]">
    </div>
  );

  return (
    <div className="min-h-screen py-12 md:py-20 bg-accent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-6 md:mb-8">
          <motion.h1
            initial={{opacity: 0,y: 20}} animate={{opacity: 1,y: 0}} transition={{duration: 0.7}}
            className="text-3xl md:text-4xl text-text-primary"
          >
            Upper Room Fellowship
          </motion.h1>
          <motion.p
            initial={{opacity: 0,y: 20}} animate={{opacity: 1,y: 0}} transition={{duration: 0.7,delay: 0.1}}
            className="text-base md:text-lg text-text-primary mt-1"
          >
            Your hub for church life
          </motion.p>
        </header>

        <main>
          {loading ? (
            <div className="flex flex-col items-center gap-8">
              <div className="flex flex-col gap-4 w-full">
                <div className="bg-accent-dark rounded-2xl animate-pulse w-full h-[70px]"></div>
                <div className="bg-accent-dark rounded-2xl animate-pulse w-full h-[70px]"></div>
              </div>
              <div className="hidden md:grid md:grid-cols-3 gap-4"> {Array(9).fill(0).map((_, i) => <SkeletonButton key={i} />)} </div>
              <div className="grid grid-cols-2 md:hidden gap-3"> {Array(9).fill(0).map((_, i) => <SkeletonButton key={i} />)} </div>
              <div className="flex justify-center gap-3 mt-8">
                {Array(3).fill(0).map((_, i) => <SkeletonQuickLink key={i} />)}
              </div>
            </div>
          ) : (
            <>
              {featuredButtons.length > 0 && (
                <section className="mb-8 flex justify-center w-full">
                  <div className="flex flex-col gap-3 md:gap-4 w-full max-w-[344px] md:max-w-[711px]">
                    {featuredButtons.map((button, i) => (
                      <HomeButton key={button.title} {...button} isFeatured delay={0.3 + i * 0.1} />
                    ))}
                  </div>
                </section>
              )}

              <section className="flex flex-col items-center">
                <div className="hidden md:grid md:grid-cols-3 gap-4">
                  {mainButtons.map((button, i) => (
                    <HomeButton key={button.title} {...button} delay={0.5 + i * 0.05} />
                  ))}
                </div>
                <div className="grid grid-cols-2 md:hidden gap-3">
                  {mainButtons.map((button, i) => (
                    <HomeButton key={button.title} {...button} delay={0.5 + i * 0.05} />
                  ))}
                </div>
              </section>

              <section className="mt-12 flex flex-col items-center">
                <motion.h3
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.6, delay: 0.9}}
                  className="text-lg text-text-primary mb-4 font-heading"
                >
                  Quick Links
                </motion.h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {quickLinks.map((link, i) => (
                    <QuickLinkButton key={link.title} {...link} delay={1.0 + i * 0.1} />
                  ))}
                </div>
              </section>
            </>
          )}

          <motion.footer 
            initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.8, delay: 1.2}}
            className="mt-16 text-center"
          >
            <h3 className="text-lg text-text-primary mb-4">Follow Us</h3>
            <div className="flex justify-center space-x-6">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.name} href={social.url} target="_blank" rel="noopener noreferrer"
                  initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}} transition={{duration: 0.5, delay: 1.3 + i * 0.1}}
                  className="text-social-green hover:text-text-primary transition-colors transform hover:scale-110"
                >
                  <SafeIcon icon={social.icon} className="h-8 w-8" />
                </motion.a>
              ))}
            </div>
            <div className="mt-12">
              <Link to="/admin" className="inline-flex items-center space-x-2 text-text-light hover:text-text-primary transition-colors">
                <SafeIcon icon={FiSettings} className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            </div>
          </motion.footer>
        </main>
      </div>
    </div>
  );
};

const HomeButton = ({ title, description, icon, path, isFeatured = false, isInternal = true, delay = 0 }) => {
  const baseClasses = isFeatured
    ? "relative overflow-hidden p-4 rounded-2xl shadow-modern hover:shadow-modern-lg transition-all duration-300 hover:-translate-y-1 block text-center group flex flex-col justify-center items-center w-full h-[60px] md:h-[70px]"
    : "relative overflow-hidden p-4 rounded-2xl shadow-modern hover:shadow-modern-lg transition-all duration-300 hover:-translate-y-1 block text-center group flex flex-col justify-center items-center w-[160px] h-[120px] md:w-[225px] md:h-[150px]";

  const featuredClasses = "bg-brand-yellow text-text-primary";
  const mainClasses = "bg-brand-blue text-white";

  const content = (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isFeatured ? 'from-white/30' : 'from-white/20'}`}></div>
      {isFeatured ? (
        <div className="relative z-10 flex flex-col items-center">
          <h3 className="text-sm md:text-base font-bold font-heading leading-tight text-text-primary">{title}</h3>
          <p className="text-xs opacity-80 leading-tight text-text-primary">{description}</p>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center">
          <SafeIcon icon={icon} className="h-6 w-6 md:h-8 md:w-8 mb-2 md:mb-3 transition-transform duration-300 group-hover:scale-110" style={{color: '#E2BA49'}} />
          <h3 className="text-sm md:text-base font-bold font-heading leading-tight text-white">{title}</h3>
          <p className="text-xs opacity-80 leading-tight text-white">{description}</p>
        </div>
      )}
    </>
  );

  return (
    <motion.div initial={{opacity: 0, y: 30}} animate={{opacity: 1, y: 0}} transition={{duration: 0.6, delay}}>
      {isInternal ? (
        <Link to={path} className={`${baseClasses} ${isFeatured ? featuredClasses : mainClasses}`}>
          {content}
        </Link>
      ) : (
        <a href={path} target="_blank" rel="noopener noreferrer" className={`${baseClasses} ${isFeatured ? featuredClasses : mainClasses}`}>
          {content}
        </a>
      )}
    </motion.div>
  );
};

const QuickLinkButton = ({ title, icon, path, delay = 0 }) => {
  return (
    <motion.a
      href={path}
      target="_blank"
      rel="noopener noreferrer"
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5, delay}}
      className="relative overflow-hidden px-4 py-3 rounded-xl bg-accent-dark hover:bg-brand-blue shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group flex items-center gap-2 w-[120px] md:w-[140px] justify-center"
    >
      <SafeIcon icon={icon} className="h-4 w-4 md:h-5 md:w-5 text-brand-yellow transition-transform duration-300 group-hover:scale-110" />
      <span className="text-xs md:text-sm font-semibold text-text-primary group-hover:text-white transition-colors duration-300">{title}</span>
    </motion.a>
  );
};

export default Home;