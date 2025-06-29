import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/localStorage';

const { FiBell, FiCalendar, FiUser, FiHome } = FiIcons;

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements_portal123')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-accent py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary font-inter">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Home Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors font-inter"
          >
            <SafeIcon icon={FiHome} className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center space-x-4 mb-6"
          >
            <SafeIcon icon={FiBell} className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-secondary font-inter">
              Announcements
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-secondary font-inter"
          >
            Stay updated with the latest church news and events
          </motion.p>
        </div>

        {/* Announcements List */}
        <div className="space-y-8">
          {announcements.length === 0 ? (
            <div className="text-center py-12">
              <SafeIcon icon={FiBell} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-secondary font-inter">No announcements yet</p>
              <p className="text-secondary-light font-inter">Check back soon for updates!</p>
            </div>
          ) : (
            announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-secondary font-inter">
                      {announcement.title}
                    </h2>
                    <div className="flex items-center space-x-2 text-secondary-light">
                      <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                      <span className="text-sm font-inter">
                        {formatDate(announcement.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <div 
                      className="text-secondary leading-relaxed force-inter-tight font-inter preserve-formatting rendered-content"
                      dangerouslySetInnerHTML={{ __html: announcement.content }}
                      style={{
                        fontFamily: 'Inter Tight, sans-serif',
                        lineHeight: '1.6',
                        letterSpacing: '0.1px'
                      }}
                    />
                  </div>

                  {announcement.author && (
                    <div className="mt-6 pt-4 border-t border-accent flex items-center space-x-2">
                      <SafeIcon icon={FiUser} className="h-4 w-4 text-secondary-light" />
                      <span className="text-sm text-secondary-light font-inter">
                        By {announcement.author}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;