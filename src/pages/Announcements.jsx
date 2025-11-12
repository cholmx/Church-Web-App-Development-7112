import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {SkeletonCard,LoadingTransition} from '../components/LoadingSkeletons';
import {useCleanContent} from '../hooks/useCleanContent';
import supabase from '../lib/supabase';

const {FiBell,FiCalendar,FiUser,FiHome}=FiIcons;

const Announcements=()=> {
  const [announcements,setAnnouncements]=useState([]);
  const [loading,setLoading]=useState(true);

  // Use the custom hook to clean inline styles
  useCleanContent();

  useEffect(()=> {
    fetchAnnouncements();
  },[]);

  const fetchAnnouncements=async ()=> {
    try {
      const {data,error}=await supabase
        .from('announcements_portal123')
        .select('*')
        .order('announcement_date',{ascending: false});

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:',error);
    } finally {
      // Add minimum delay to show skeleton
      setTimeout(()=> setLoading(false),600);
    }
  };

  const formatDate=(dateString)=> {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US',{
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen py-12 relative" style={{backgroundColor: '#fcfaf2'}}>
      {/* Back to Home Button - Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105" style={{backgroundColor: '#83A682'}} title="Back to Home">
          <SafeIcon icon={FiHome} className="h-5 w-5 text-white" />
        </Link>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{opacity: 0,y: 30}}
            animate={{opacity: 1,y: 0}}
            transition={{duration: 0.8}}
            className="flex items-center justify-center space-x-4 mb-1"
          >
            <SafeIcon icon={FiBell} className="h-8 w-8 text-primary" />
            <Link to="/" className="hover:text-primary transition-colors">
              <h1 className="text-3xl md:text-4xl"> Announcements </h1>
            </Link>
          </motion.div>
          <motion.p
            initial={{opacity: 0,y: 30}}
            animate={{opacity: 1,y: 0}}
            transition={{duration: 0.8,delay: 0.2}}
            className="text-base page-subtitle"
          >
            Stay updated with the latest church news and events
          </motion.p>
        </div>

        {/* Announcements List with Loading */}
        <LoadingTransition
          isLoading={loading}
          skeleton={
            <div className="space-y-8">
              {Array.from({length: 3}).map((_,i)=> (
                <SkeletonCard key={i} showImage={false} showMeta={true} />
              ))}
            </div>
          }
        >
          <div className="space-y-8">
            {announcements.length===0 ? (
              <div className="text-center py-12">
                <SafeIcon icon={FiBell} className="h-16 w-16 text-text-light mx-auto mb-4" />
                <p className="text-xl">No announcements yet</p>
                <p className="text-text-light">Check back soon for updates!</p>
              </div>
            ) : (
              announcements.map((announcement,index)=> (
                <motion.div
                  key={announcement.id}
                  initial={{opacity: 0,y: 30}}
                  animate={{opacity: 1,y: 0}}
                  transition={{duration: 0.5,delay: index * 0.1}}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-3xl md:text-4xl leading-tight">
                        {announcement.title}
                      </h2>
                      <div className="flex items-center space-x-2 text-text-light">
                        <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                        <span className="text-sm">
                          {announcement.announcement_date
                            ? formatDate(announcement.announcement_date)
                            : formatDate(announcement.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="prose max-w-none">
                      <div
                        className="announcement-content"
                        dangerouslySetInnerHTML={{__html: announcement.content}}
                      />
                    </div>
                    {announcement.author && (
                      <div className="mt-6 pt-4 border-t border-accent flex items-center space-x-2">
                        <SafeIcon icon={FiUser} className="h-4 w-4 text-text-light" />
                        <span className="text-sm text-text-light">
                          By {announcement.author}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </LoadingTransition>
      </div>
    </div>
  );
};

export default Announcements;