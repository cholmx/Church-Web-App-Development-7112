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

  useEffect(()=> {
    checkAvailability();
  },[]);

  const checkAvailability=async ()=> {
    try {
      const {data: events}=await supabase.from('events_portal123').select('id').limit(1);
      const {data: classes}=await supabase.from('classes_portal123').select('id').limit(1);
      const {data: resources}=await supabase.from('resources_portal123').select('id').limit(1);

      setHasEvents(events && events.length > 0);
      setHasClasses(classes && classes.length > 0);
      setHasResources(resources && resources.length > 0);
    } catch (error) {
      console.error('Error checking availability:',error);
    } finally {
      setTimeout(()=> setLoading(false),800);
    }
  };

  const featuredButtons=[
    ...(hasClasses ? [{title: 'Classes',description: 'Available church classes',icon: FiBookOpen,path: '/class-registration'}] : []),
    ...(hasEvents ? [{title: 'Events',description: 'Upcoming church events',icon: FiCalendar,path: '/event-registration'}] : [])
  ];

  const mainButtons=[
    {title: 'Announcements',description: 'Latest church news',icon: FiBell,path: '/announcements'},
    {title: 'Sermon Blog',description: 'Weekly sermons',icon: FiPlay,path: '/sermon-blog'},
    {title: 'Shine Podcast',description: 'Latest episodes',icon: FiMic,path: '/shine-podcast'},
    {title: 'Sermon Podcast',description: 'Listen to recordings',icon: FiPlay,path: '/sermon-podcast'},
    {title: 'Table Group Sign-Up',description: 'Join a small group',icon: FiUsers,path: '/table-group-signup'},
    {title: 'Give',description: 'Online giving portal',icon: FiCreditCard,path: '/give'},
    ...(hasResources ? [{title: 'Resources',description: 'Helpful materials',icon: FiBookOpen,path: '/resources'}] : []),
    {title: 'Join Realm',description: 'Become a member',icon: FiUserPlus,path: '/join-realm'},
    {title: 'Contact',description: 'Get in touch with us',icon: FiMail,path: '/contact'}
  ];
  
  const mobileMainButtons=mainButtons.filter(b=> b.title !=='Contact');
  const contactButton=mainButtons.find(b=> b.title==='Contact');

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

  return (
    <div className="min-h-screen py-12 md:py-20 bg-accent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 md:mb-16">
          <motion.h1 
            initial={{opacity: 0,y: 20}} animate={{opacity: 1,y: 0}} transition={{duration: 0.7}}
            className="text-3xl md:text-4xl text-text-primary"
          >
            Upper Room Fellowship
          </motion.h1>
          <motion.p 
            initial={{opacity: 0,y: 20}} animate={{opacity: 1,y: 0}} transition={{duration: 0.7,delay: 0.1}}
            className="text-base md:text-lg text-text-primary mt-2"
          >
            Your hub for church life
          </motion.p>
        </header>

        <main>
          {loading ? (
            <div className="flex flex-col items-center gap-8">
              <div className="flex justify-center gap-4"> <SkeletonButton /> <SkeletonButton /> </div>
              <div className="hidden md:grid md:grid-cols-3 gap-4"> {Array(9).fill(0).map((_, i) => <SkeletonButton key={i} />)} </div>
              <div className="grid grid-cols-2 md:hidden gap-3"> {Array(8).fill(0).map((_, i) => <SkeletonButton key={i} />)} </div>
              <div className="flex justify-center md:hidden"> <SkeletonButton /> </div>
            </div>
          ) : (
            <>
              {featuredButtons.length > 0 && (
                <section className="mb-4">
                  <div className="flex justify-center gap-3 md:gap-4">
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
                  {mobileMainButtons.map((button, i) => (
                    <HomeButton key={button.title} {...button} delay={0.5 + i * 0.05} />
                  ))}
                </div>
                {contactButton && (
                  <div className="mt-3 md:hidden">
                     <HomeButton {...contactButton} delay={0.5 + mobileMainButtons.length * 0.05} />
                  </div>
                )}
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

const HomeButton = ({ title, description, icon, path, isFeatured = false, delay = 0 }) => {
  const baseClasses = "relative overflow-hidden p-4 rounded-2xl shadow-modern hover:shadow-modern-lg transition-all duration-300 hover:-translate-y-1 block text-center group flex flex-col justify-center items-center w-[160px] h-[120px] md:w-[225px] md:h-[150px]";
  const featuredClasses = "bg-brand-yellow text-white";
  const mainClasses = "bg-brand-blue text-white";

  return (
    <motion.div initial={{opacity: 0, y: 30}} animate={{opacity: 1, y: 0}} transition={{duration: 0.6, delay}}>
      <Link to={path} className={`${baseClasses} ${isFeatured ? featuredClasses : mainClasses}`}>
        <div className={`absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isFeatured ? 'from-white/30' : 'from-white/20'}`}></div>
        <div className="relative z-10 flex flex-col items-center">
          <SafeIcon icon={icon} className="h-6 w-6 md:h-8 md:w-8 mb-2 md:mb-3 transition-transform duration-300 group-hover:scale-110 text-white" />
          <h3 className="text-sm md:text-base font-bold font-heading leading-tight text-white">{title}</h3>
          <p className="text-xs opacity-80 leading-tight text-white">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default Home;