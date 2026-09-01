import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {motion,AnimatePresence} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import {SkeletonForm,LoadingTransition} from '../components/LoadingSkeletons';
import AdminAnnouncements from '../components/AdminAnnouncements';
import AdminSermons from '../components/AdminSermons';
import AdminEvents from '../components/AdminEvents';
import AdminClasses from '../components/AdminClasses';
import AdminResources from '../components/AdminResources';
import AdminFeaturedButtons from '../components/AdminFeaturedButtons';
import AdminMinistries from '../components/AdminMinistries';
import AdminStaffContacts from '../components/AdminStaffContacts';
import AdminCapitalCampaign from '../components/AdminCapitalCampaign';
import AdminComments from '../components/AdminComments';
import AdminDashboard from '../components/AdminDashboard';
import AdminSubmissions from '../components/AdminSubmissions';
import StaffCommsApp from '../staffComms/StaffCommsApp';
import SlideMaker from '../staffTools/slideMaker/SlideMaker';
import SignupSheetMaker from '../staffTools/signupSheet/SignupSheetMaker';

const {FiBell,FiPlay,FiCalendar,FiBookOpen,FiHome,FiLock,FiStar,FiHeart,FiUsers,FiTrendingUp,FiMessageSquare,FiGrid,FiLogOut,FiInbox,FiRadio,FiImage,FiClipboard,FiMenu,FiX}=FiIcons;

const NAV_SECTIONS=[
  {
    items: [
      {id: 'overview',label: 'Overview',icon: FiGrid},
      {id: 'submissions',label: 'Submissions',icon: FiInbox},
    ],
  },
  {
    label: 'Content',
    items: [
      {id: 'announcements',label: 'Announcements',icon: FiBell},
      {id: 'sermons',label: 'Sermons',icon: FiPlay},
      {id: 'events',label: 'Events',icon: FiCalendar},
      {id: 'classes',label: 'Classes',icon: FiBookOpen},
      {id: 'resources',label: 'Resources',icon: FiBookOpen},
      {id: 'ministries',label: 'Ministries',icon: FiHeart},
      {id: 'staff',label: 'Staff Contacts',icon: FiUsers},
      {id: 'featured',label: 'Featured Buttons',icon: FiStar},
      {id: 'campaign',label: 'Growth Campaign',icon: FiTrendingUp},
      {id: 'comments',label: 'Comments',icon: FiMessageSquare},
    ],
  },
  {
    label: 'Tools',
    items: [
      {id: 'comms',label: 'Communication Organizer',icon: FiRadio},
      {id: 'slideMaker',label: 'Slide Maker',icon: FiImage},
      {id: 'signupSheet',label: 'Sign-up Sheets',icon: FiClipboard},
    ],
  },
];

const ALL_TABS=NAV_SECTIONS.flatMap((section)=> section.items);

const Admin=()=> {
  const [isAuthenticated,setIsAuthenticated]=useState(false);
  const [checkingSession,setCheckingSession]=useState(true);
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [activeTab,setActiveTab]=useState('overview');
  const [loading,setLoading]=useState(false);
  const [sidebarOpen,setSidebarOpen]=useState(false);

  useEffect(()=> {
    supabase.auth.getSession().then(({data: {session}})=> {
      setIsAuthenticated(!!session);
      setCheckingSession(false);
    });
    const {data: listener}=supabase.auth.onAuthStateChange((_event,session)=> {
      setIsAuthenticated(!!session);
    });
    return ()=> listener.subscription.unsubscribe();
  },[]);

  const handlePasswordSubmit=async (e)=> {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const {data,error: fnError}=await supabase.functions.invoke('admin-login',{
        body: {password}
      });
      if (fnError || data?.error) {
        throw new Error(data?.error || fnError?.message || 'Invalid password');
      }
      const {error: otpError}=await supabase.auth.verifyOtp({
        token_hash: data.token,
        type: 'magiclink'
      });
      if (otpError) throw otpError;
      setPassword('');
    } catch (err) {
      console.error('Admin login failed:',err);
      setError(err?.message || 'Login failed. Please try again.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout=async ()=> {
    await supabase.auth.signOut();
  };

  const selectTab=(id)=> {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const renderContent=()=> {
    switch (activeTab) {
      case 'overview':
        return <AdminDashboard onNavigate={selectTab} />;
      case 'submissions':
        return <AdminSubmissions />;
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
      case 'ministries':
        return <AdminMinistries />;
      case 'staff':
        return <AdminStaffContacts />;
      case 'featured':
        return <AdminFeaturedButtons />;
      case 'campaign':
        return <AdminCapitalCampaign />;
      case 'comments':
        return <AdminComments />;
      case 'comms':
        return <StaffCommsApp />;
      case 'slideMaker':
        return <SlideMaker />;
      case 'signupSheet':
        return <SignupSheetMaker />;
      default:
        return <AdminDashboard onNavigate={selectTab} />;
    }
  };

  // Password protection screen
  if (!isAuthenticated) {
    if (checkingSession) {
      return (
        <div className="admin-shell min-h-screen py-12 flex items-center justify-center bg-ivory">
          <SkeletonForm />
        </div>
      );
    }
    return (
      <div className="admin-shell min-h-screen py-12 flex items-center justify-center relative bg-ivory">
        {/* Back to Home Button - Top Right */}
        <div className="fixed top-6 right-6 z-50">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 bg-deep"
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
            className="bg-white rounded-3xl shadow-modern-lg p-8 max-w-md w-full mx-4 border border-ink/8"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-deep rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiLock} className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-ink mb-2">
                Admin Access
              </h1>
              <p className="text-ink/50">
                Please enter the admin password to continue
              </p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="admin-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e)=> setPassword(e.target.value)}
                  required
                  className="admin-input"
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-deep text-white py-3 px-6 rounded-xl font-semibold hover:bg-deep-hover transition-colors disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? 'Authenticating...' : 'Access Admin Dashboard'}
              </button>
            </form>
          </motion.div>
        </LoadingTransition>
      </div>
    );
  }

  const activeLabel=ALL_TABS.find((t)=> t.id===activeTab)?.label || 'Overview';

  const NavList=()=> (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
      {NAV_SECTIONS.map((section,i)=> (
        <div key={section.label || `top-${i}`}>
          {section.label && (
            <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/35">
              {section.label}
            </div>
          )}
          <div className="space-y-0.5">
            {section.items.map((tab)=> (
              <button
                key={tab.id}
                onClick={()=> selectTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium border-l-2 transition-colors duration-150 ${
                  activeTab===tab.id
                    ? 'bg-white/5 border-sun text-sun'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <SafeIcon icon={tab.icon} className="h-4 w-4 flex-shrink-0" />
                <span className="text-left leading-tight">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  // Main admin dashboard (shown after authentication)
  return (
    <div className="admin-shell min-h-screen bg-ivory md:flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:flex-shrink-0 bg-deep">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="text-white font-bold text-lg leading-tight">Admin</div>
          <div className="text-white/40 text-xs">Upper Room Fellowship</div>
        </div>
        <NavList />
        <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <SafeIcon icon={FiHome} className="h-4 w-4" />
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <SafeIcon icon={FiLogOut} className="h-4 w-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 bg-deep text-white flex items-center justify-between px-4 h-14">
        <button onClick={()=> setSidebarOpen(true)} className="p-2 -ml-2" aria-label="Open menu">
          <SafeIcon icon={FiMenu} className="h-5 w-5" />
        </button>
        <span className="font-semibold text-sm truncate">{activeLabel}</span>
        <Link to="/" className="p-2 -mr-2" title="Back to Home">
          <SafeIcon icon={FiHome} className="h-5 w-5" />
        </Link>
      </div>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              onClick={()=> setSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/40 z-40"
            />
            <motion.aside
              initial={{x: '-100%'}}
              animate={{x: 0}}
              exit={{x: '-100%'}}
              transition={{duration: 0.2}}
              className="md:hidden fixed top-0 left-0 bottom-0 w-72 bg-deep z-50 flex flex-col"
            >
              <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-lg leading-tight">Admin</div>
                  <div className="text-white/40 text-xs">Upper Room Fellowship</div>
                </div>
                <button onClick={()=> setSidebarOpen(false)} className="p-2 text-white/60 hover:text-white" aria-label="Close menu">
                  <SafeIcon icon={FiX} className="h-5 w-5" />
                </button>
              </div>
              <NavList />
              <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <SafeIcon icon={FiLogOut} className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="hidden md:block text-2xl font-bold text-ink mb-6">
            {activeLabel}
          </h1>
          <motion.div
            key={activeTab}
            initial={{opacity: 0,y: 12}}
            animate={{opacity: 1,y: 0}}
            transition={{duration: 0.3}}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
