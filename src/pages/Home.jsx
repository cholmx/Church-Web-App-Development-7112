import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const {FiBell,FiPlay,FiMic,FiUsers,FiCreditCard,FiUserPlus,FiMail,FiCalendar,FiBookOpen,FiGlobe,FiHeart,FiLogIn,FiExternalLink,FiFileText,FiHeadphones,FiTrendingUp,FiCheck,FiStar}=FiIcons;

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
      setLoading(false);
    }
  };

  const featuredButtons=[
    {title: 'Transforming Together Growth Campaign',description: 'Updates, vision, and ways to give and commit',icon: FiTrendingUp,path: '/capital-campaign',gradient: true},
    ...featuredDbButtons.map(btn=> ({
      title: btn.title,
      description: btn.description || '',
      icon: FiCheck,
      path: btn.path,
      isInternal: !btn.path.startsWith('http')
    })),
    ...(hasClasses ? [{title: 'Classes',description: 'Available church classes',icon: FiBookOpen,path: '/class-registration',isGold: true}] : []),
    ...(hasEvents ? [{title: 'Events',description: 'Upcoming church events',icon: FiCalendar,path: '/event-registration',isSun: true}] : [])
  ];

  const mainButtons=[
    {title: 'Announcements',description: 'Latest church news',icon: FiBell,path: '/announcements',isInternal: true},
    {title: 'Sermon Blog',description: 'Weekly sermons',icon: FiFileText,path: '/sermon-blog',isInternal: true},
    {title: 'Shine Podcast',description: 'Latest episodes',icon: FiMic,path: '/shine-podcast',isInternal: true},
    {title: 'Sermon Podcast',description: 'Listen to recordings',icon: FiHeadphones,path: '/sermon-podcast',isInternal: true},
    {title: 'Give',description: 'Support our ministry',icon: FiCreditCard,path: 'https://onrealm.org/urfellowship/-/form/give/now',isInternal: false},
    {title: 'Table Group Sign-Up',description: 'Join a small group',icon: FiUsers,path: '/table-group-signup',isInternal: true},
    ...(hasResources ? [{title: 'Resources',description: 'Helpful materials',icon: FiBookOpen,path: '/resources',isInternal: true}] : []),
    {title: 'Join Realm',description: 'Our online community',icon: FiUserPlus,path: '/join-realm',isInternal: true},
    {title: 'Opportunities',description: 'Explore our opportunities',icon: FiHeart,path: '/ministries',isInternal: true}
  ];

  const quickLinks=[
    {title: 'Contact',icon: FiMail,path: '/contact',isInternal: true},
    {title: 'Realm Login',icon: FiLogIn,path: 'https://onrealm.org/urfellowship/'},
    {title: 'Website',icon: FiGlobe,path: 'https://urfellowship.com'}
  ];

  const SkeletonButton=()=> (
    <div className="bg-ink/5 rounded-3xl animate-pulse w-full min-h-[160px] md:min-h-[200px] p-5 flex flex-col items-center justify-center">
      <div className="w-8 h-8 bg-ink/10 rounded-full mb-3"></div>
      <div className="h-4 bg-ink/10 rounded w-20 mb-2"></div>
      <div className="h-3 bg-ink/10 rounded w-24"></div>
    </div>
  );

  const SkeletonQuickLink=()=> (
    <div className="bg-ink/5 rounded-full animate-pulse w-[130px] h-[48px] md:w-[150px]">
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Navbar />
      <div className="flex-1 py-16 md:py-24 max-w-[1145px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <header className="text-center mb-10 md:mb-14">
          <motion.p
            initial={{opacity: 0,y: 12}} animate={{opacity: 1,y: 0}} transition={{duration: 0.5}}
            className="font-caladea italic text-gold-text text-sm md:text-base mb-2"
          >
            Welcome home
          </motion.p>
          <motion.h1
            initial={{opacity: 0,y: 20}} animate={{opacity: 1,y: 0}} transition={{duration: 0.7,delay: 0.05}}
            className="font-gsans uppercase font-black text-4xl md:text-6xl lg:text-7xl text-ink tracking-tight leading-[0.95]"
          >
            Upper Room Fellowship
          </motion.h1>
          <motion.p
            initial={{opacity: 0,y: 20}} animate={{opacity: 1,y: 0}} transition={{duration: 0.7,delay: 0.12}}
            className="font-ui text-base md:text-lg text-ink/60 mt-4"
          >
            Your hub for church life
          </motion.p>
        </header>

        <main>
          {loading ? (
            <div className="flex flex-col items-center gap-8">
              <div className="w-full max-w-[344px] md:max-w-[711px]">
                <div className="bg-ink/5 rounded-3xl animate-pulse w-full h-[100px] mb-4"></div>
              </div>
              <div className="flex flex-col gap-4 w-full max-w-[344px] md:max-w-[711px]">
                <div className="bg-ink/5 rounded-3xl animate-pulse w-full h-[70px]"></div>
                <div className="bg-ink/5 rounded-3xl animate-pulse w-full h-[70px]"></div>
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

              <section className="flex justify-center w-full">
                <div className="w-full max-w-[344px] md:max-w-[711px]">
                  <div className="hidden md:grid md:grid-cols-3 gap-4 w-full items-stretch">
                    {mainButtons.map((button, i) => (
                      <HomeButton key={button.title} {...button} delay={0.5 + i * 0.05} stretch />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:hidden gap-3 w-full items-stretch">
                    {mainButtons.map((button, i) => (
                      <HomeButton key={button.title} {...button} delay={0.5 + i * 0.05} isLastOdd={mainButtons.length % 2 !== 0 && i === mainButtons.length - 1} stretch />
                    ))}
                  </div>
                </div>
              </section>

              <section className="mt-14 flex flex-col items-center">
                <motion.div
                  initial={{opacity: 0, y: 16}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.5, delay: 0.9}}
                  className="flex items-center gap-3 mb-5"
                >
                  <div className="h-px w-10 bg-ink/15"></div>
                  <span className="font-caladea italic text-xs uppercase tracking-widest text-ink/50">Quick Links</span>
                  <div className="h-px w-10 bg-ink/15"></div>
                </motion.div>
                <div className="flex flex-wrap justify-center gap-3">
                  {quickLinks.map((link, i) => (
                    <QuickLinkButton key={link.title} {...link} delay={1.0 + i * 0.1} />
                  ))}
                  <motion.a
                    href="https://g.page/r/CfHLfp3nAOi_EBM/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{opacity: 0, y: 12}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.4, delay: 1.3}}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-ink font-ui font-semibold text-sm hover:-translate-y-1 transition-all duration-200 shadow-sm border border-ink/8"
                  >
                    <SafeIcon icon={FiStar} className="h-4 w-4 text-sun" />
                    Leave a Review
                  </motion.a>
                </div>
              </section>
            </>
          )}

        </main>
      </div>
      <Footer />
    </div>
  );
};

const HomeButton = ({ title, description, icon, path, isFeatured = false, isInternal = true, delay = 0, gradient = false, isGold = false, isSun = false, isLastOdd = false, stretch = false }) => {
  const baseClasses = isFeatured
    ? "relative overflow-hidden p-4 md:p-5 rounded-3xl border border-white/10 shadow-modern hover:shadow-modern-lg transition-all duration-300 hover:-translate-y-1 block group w-full"
    : `relative overflow-hidden p-5 rounded-3xl border border-ink/5 shadow-modern hover:shadow-modern-lg transition-all duration-300 hover:-translate-y-1 block text-center group flex flex-col justify-center items-center w-full${stretch ? ' h-full' : ' min-h-[160px] md:min-h-[200px]'}`;

  const tinted = isGold || isSun;
  const iconColor = tinted ? 'text-ink' : 'text-ink';
  const textColor = tinted ? 'text-ink' : 'text-ink';
  const subTextColor = tinted ? 'text-ink/65' : 'text-ink/55';
  const iconBgClass = tinted ? 'bg-ink/10' : 'bg-sun/15';

  const content = (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      {isFeatured ? (
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4 flex-1">
            <div className={`${gradient ? 'bg-sun text-ink' : `${iconBgClass} ${iconColor}`} p-2.5 md:p-3 rounded-2xl flex-shrink-0`}>
              <SafeIcon icon={icon} className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <h3 className={`text-sm md:text-base font-bold font-gsans leading-tight ${gradient ? 'text-ivory' : textColor}`}>{title}</h3>
              <p className={`font-ui text-xs leading-tight mt-0.5 ${gradient ? 'text-ivory/70' : subTextColor}`}>{description}</p>
            </div>
          </div>
          <div className={`flex items-center space-x-1 flex-shrink-0 ml-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200 ${gradient ? 'text-ivory' : textColor}`}>
            <SafeIcon icon={FiExternalLink} className="h-4 w-4" />
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-2.5 rounded-2xl bg-sun/15 mb-2.5 md:mb-3 transition-transform duration-300 group-hover:scale-110">
            <SafeIcon icon={icon} className="h-5 w-5 md:h-6 md:w-6 text-gold-text" />
          </div>
          <h3 className="text-sm md:text-base font-bold font-gsans leading-tight text-ink">{title}</h3>
          <p className="font-ui text-xs leading-tight text-ink/55 mt-0.5">{description}</p>
        </div>
      )}
    </>
  );

  const surfaceClasses = isFeatured
    ? (gradient ? '' : 'bg-white')
    : 'bg-white';

  const gradientStyle = gradient
    ? {background: 'linear-gradient(135deg, #0B1613 0%, #A6790F 100%)'}
    : isSun
      ? {backgroundColor: '#FFC44F'}
      : isGold
        ? {backgroundColor: '#CCA866'}
        : {};

  return (
    <motion.div initial={{opacity: 0, y: 30}} animate={{opacity: 1, y: 0}} transition={{duration: 0.6, delay}} className={`${isLastOdd ? 'col-span-2' : ''}${stretch ? ' h-full flex flex-col' : ''}`}>
      {isInternal ? (
        <Link to={path} className={`${baseClasses} ${surfaceClasses}`} style={gradientStyle}>
          {content}
        </Link>
      ) : (
        <a href={path} target="_blank" rel="noopener noreferrer" className={`${baseClasses} ${surfaceClasses}`} style={gradientStyle}>
          {content}
        </a>
      )}
    </motion.div>
  );
};

const QuickLinkButton = ({ title, icon, path, isInternal = false, delay = 0 }) => {
  const className = "relative overflow-hidden px-4 py-3 rounded-full bg-white border border-ink/8 hover:border-sun/60 shadow-modern hover:shadow-modern-lg transition-all duration-300 hover:-translate-y-1 group flex items-center gap-2.5 w-[130px] md:w-[150px] justify-center";
  const inner = (
    <>
      <SafeIcon icon={icon} className="h-4 w-4 text-gold-text transition-transform duration-300 group-hover:scale-110 flex-shrink-0" />
      <span className="font-ui text-xs md:text-sm font-semibold text-ink group-hover:text-gold-text transition-colors duration-200">{title}</span>
    </>
  );
  return (
    <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5, delay}}>
      {isInternal ? (
        <Link to={path} className={className}>{inner}</Link>
      ) : (
        <a href={path} target="_blank" rel="noopener noreferrer" className={className}>{inner}</a>
      )}
    </motion.div>
  );
};

export default Home;
