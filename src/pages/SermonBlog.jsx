import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiPlay, FiCalendar, FiUser, FiMessageCircle, FiHome, FiLayers, FiFilter } = FiIcons;

const SermonBlog = () => {
  const [sermons, setSermons] = useState([]);
  const [sermonSeries, setSermonSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState('');

  useEffect(() => {
    fetchSermons();
    fetchSermonSeries();
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

  const fetchSermonSeries = async () => {
    try {
      const { data, error } = await supabase
        .from('sermon_series_portal123')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setSermonSeries(data || []);
    } catch (error) {
      console.error('Error fetching sermon series:', error);
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
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  const getSeriesName = (seriesId) => {
    const series = sermonSeries.find(s => s.id === seriesId);
    return series ? series.name : null;
  };

  const getSeriesDescription = (seriesId) => {
    const series = sermonSeries.find(s => s.id === seriesId);
    return series ? series.description : null;
  };

  // Filter sermons based on selected series
  const filteredSermons = selectedSeries === '' 
    ? sermons 
    : selectedSeries === 'standalone'
    ? sermons.filter(sermon => !sermon.sermon_series_id)
    : sermons.filter(sermon => sermon.sermon_series_id === selectedSeries);

  if (loading) {
    return (
      <div className="min-h-screen bg-accent py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary font-inter">Loading sermons...</p>
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
            className="flex items-center justify-center space-x-4 mb-3"
          >
            <SafeIcon icon={FiPlay} className="h-8 w-8 text-primary" />
            <Link to="/" className="hover:text-primary transition-colors">
              <h1 className="text-3xl md:text-4xl font-bold text-secondary font-inter">
                Sermon Blog
              </h1>
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-secondary font-inter"
          >
            Weekly sermons and discussion questions for Table Groups
          </motion.p>
        </div>

        {/* Filter Section */}
        {(sermonSeries.length > 0 || sermons.some(s => !s.sermon_series_id)) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiFilter} className="h-5 w-5 text-secondary" />
                <span className="font-medium text-secondary font-inter">Filter by Series:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSeries('')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors font-inter ${
                    selectedSeries === '' 
                      ? 'bg-primary text-white' 
                      : 'bg-accent text-secondary hover:bg-accent-dark'
                  }`}
                >
                  All Sermons
                </button>
                {sermons.some(s => !s.sermon_series_id) && (
                  <button
                    onClick={() => setSelectedSeries('standalone')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors font-inter ${
                      selectedSeries === 'standalone' 
                        ? 'bg-primary text-white' 
                        : 'bg-accent text-secondary hover:bg-accent-dark'
                    }`}
                  >
                    Standalone Sermons
                  </button>
                )}
                {sermonSeries.map((series) => (
                  <button
                    key={series.id}
                    onClick={() => setSelectedSeries(series.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors font-inter ${
                      selectedSeries === series.id 
                        ? 'bg-primary text-white' 
                        : 'bg-accent text-secondary hover:bg-accent-dark'
                    }`}
                  >
                    {series.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Series Description */}
        {selectedSeries && selectedSeries !== 'standalone' && selectedSeries !== '' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-primary text-white rounded-lg p-6 mb-8"
          >
            <div className="flex items-center space-x-3 mb-3">
              <SafeIcon icon={FiLayers} className="h-6 w-6" />
              <h2 className="text-2xl font-bold font-inter">{getSeriesName(selectedSeries)}</h2>
            </div>
            {getSeriesDescription(selectedSeries) && (
              <p className="text-primary-light font-inter">{getSeriesDescription(selectedSeries)}</p>
            )}
          </motion.div>
        )}

        {/* Sermons List */}
        <div className="space-y-12">
          {filteredSermons.length === 0 ? (
            <div className="text-center py-12">
              <SafeIcon icon={FiPlay} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-secondary mb-2 font-inter">
                {selectedSeries === '' ? 'No sermons yet' : 'No sermons in this series'}
              </h2>
              <p className="text-secondary-light font-inter">Check back soon for updates!</p>
            </div>
          ) : (
            filteredSermons.map((sermon, index) => (
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
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-3xl font-bold text-secondary font-inter">
                          {sermon.title}
                        </h2>
                        {sermon.sermon_series_id && selectedSeries === '' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-white font-inter">
                            <SafeIcon icon={FiLayers} className="h-3 w-3 mr-1" />
                            {getSeriesName(sermon.sermon_series_id)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-gray-500">
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                          <span className="text-sm font-inter">
                            {formatDate(sermon.sermon_date)}
                          </span>
                        </div>
                        {sermon.speaker && (
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiUser} className="h-4 w-4" />
                            <span className="text-sm font-inter">{sermon.speaker}</span>
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
                          allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}

                  {/* Sermon Summary */}
                  {sermon.summary && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-4 text-secondary font-inter">
                        Sermon Summary
                      </h3>
                      <div className="prose max-w-none">
                        <div 
                          className="rendered-content text-secondary font-inter"
                          dangerouslySetInnerHTML={{ __html: sermon.summary }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Discussion Questions */}
                  {sermon.discussion_questions && (
                    <div className="p-6 rounded-lg discussion-questions-section bg-gray-50">
                      <div className="flex items-center space-x-2 mb-4">
                        <SafeIcon icon={FiMessageCircle} className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-bold text-secondary font-inter">
                          Table Group Discussion Questions
                        </h3>
                      </div>
                      <div className="prose max-w-none">
                        <div 
                          className="rendered-content text-secondary font-inter"
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