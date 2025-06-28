import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/localStorage';

const { FiPlay, FiCalendar, FiUser, FiMessageCircle, FiHome } = FiIcons;

const SermonBlog = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const { data, error } = await supabase
        .from('sermons_portal123')
        .select('*')
        .order('sermon_date', { ascending: false });
      
      if (error) throw error;
      setSermons(data || []);
    } catch (error) {
      console.error('Error fetching sermons:', error);
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

  const getYouTubeEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}` 
      : url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-accent py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Loading sermons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Home Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
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
            <SafeIcon icon={FiPlay} className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-secondary">
              Sermon Blog
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-secondary"
          >
            Weekly sermons and discussion questions for Table Groups
          </motion.p>
        </div>

        {/* Sermons List */}
        <div className="space-y-12">
          {sermons.length === 0 ? (
            <div className="text-center py-12">
              <SafeIcon icon={FiPlay} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-secondary">No sermons yet</p>
              <p className="text-secondary-light">Check back soon for updates!</p>
            </div>
          ) : (
            sermons.map((sermon, index) => (
              <motion.div
                key={sermon.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-8">
                  {/* Sermon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-secondary mb-2">
                        {sermon.title}
                      </h2>
                      <div className="flex items-center space-x-4 text-secondary-light">
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                          <span className="text-sm">
                            {formatDate(sermon.sermon_date)}
                          </span>
                        </div>
                        {sermon.speaker && (
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiUser} className="h-4 w-4" />
                            <span className="text-sm">{sermon.speaker}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* YouTube Video */}
                  {sermon.youtube_url && (
                    <div className="mb-8">
                      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                        <iframe
                          src={getYouTubeEmbedUrl(sermon.youtube_url)}
                          title={sermon.title}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}

                  {/* Sermon Summary */}
                  {sermon.summary && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-secondary mb-4">
                        Sermon Summary
                      </h3>
                      <div className="prose max-w-none">
                        <div 
                          className="text-secondary leading-relaxed" 
                          dangerouslySetInnerHTML={{ __html: sermon.summary }} 
                        />
                      </div>
                    </div>
                  )}

                  {/* Discussion Questions */}
                  {sermon.discussion_questions && (
                    <div className="bg-accent p-6 rounded-lg">
                      <div className="flex items-center space-x-2 mb-4">
                        <SafeIcon icon={FiMessageCircle} className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold text-secondary">
                          Table Group Discussion Questions
                        </h3>
                      </div>
                      <div className="prose max-w-none">
                        <div 
                          className="text-secondary leading-relaxed" 
                          dangerouslySetInnerHTML={{ __html: sermon.discussion_questions }} 
                        />
                      </div>
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

export default SermonBlog;