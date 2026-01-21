import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { SkeletonCard, LoadingTransition } from '../components/LoadingSkeletons';
import { useCleanContent } from '../hooks/useCleanContent';
import supabase from '../lib/supabase';

const { FiTrendingUp, FiHome, FiPlayCircle, FiFileText, FiHelpCircle, FiEye } = FiIcons;

const CapitalCampaign = () => {
  const [updates, setUpdates] = useState([]);
  const [visionItems, setVisionItems] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('updates');

  useCleanContent();

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      const [updatesRes, visionRes, faqsRes] = await Promise.all([
        supabase
          .from('campaign_updates')
          .select('*')
          .eq('published', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false }),
        supabase
          .from('campaign_vision')
          .select('*')
          .eq('published', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false }),
        supabase
          .from('campaign_faqs')
          .select('*')
          .eq('published', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false })
      ]);

      if (updatesRes.error) throw updatesRes.error;
      if (visionRes.error) throw visionRes.error;
      if (faqsRes.error) throw faqsRes.error;

      setUpdates(updatesRes.data || []);
      setVisionItems(visionRes.data || []);
      setFaqs(faqsRes.data || []);
    } catch (error) {
      console.error('Error fetching capital campaign content:', error);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderUpdates = () => (
    <div className="space-y-8">
      {updates.length === 0 ? (
        <div className="text-center py-12">
          <SafeIcon icon={FiFileText} className="h-16 w-16 text-text-light mx-auto mb-4" />
          <p className="text-xl">No updates yet</p>
          <p className="text-text-light">Check back soon for campaign updates!</p>
        </div>
      ) : (
        updates.map((update, index) => (
          <motion.div
            key={update.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <SafeIcon
                    icon={update.type === 'video' ? FiPlayCircle : FiFileText}
                    className="h-6 w-6 text-primary"
                  />
                  <h3 className="text-2xl md:text-3xl">{update.title}</h3>
                </div>
                <span className="text-sm text-text-light whitespace-nowrap ml-4">
                  {formatDate(update.created_at)}
                </span>
              </div>

              {update.type === 'video' && update.video_url && (
                <div className="mb-6 rounded-lg overflow-hidden aspect-video bg-gray-100">
                  {update.video_url.includes('youtube.com') || update.video_url.includes('youtu.be') ? (
                    <iframe
                      src={update.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                      title={update.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video controls className="w-full h-full">
                      <source src={update.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}

              {update.thumbnail_url && update.type === 'video' && !update.video_url && (
                <div className="mb-6">
                  <img
                    src={update.thumbnail_url}
                    alt={update.title}
                    className="w-full rounded-lg"
                  />
                </div>
              )}

              <div className="prose max-w-none">
                <div
                  className="announcement-content"
                  dangerouslySetInnerHTML={{ __html: update.content }}
                />
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );

  const renderVision = () => (
    <div className="space-y-8">
      {visionItems.length === 0 ? (
        <div className="text-center py-12">
          <SafeIcon icon={FiEye} className="h-16 w-16 text-text-light mx-auto mb-4" />
          <p className="text-xl">No vision content yet</p>
          <p className="text-text-light">Check back soon!</p>
        </div>
      ) : (
        visionItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {item.image_url && (
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-8">
              <h3 className="text-2xl md:text-3xl mb-4">{item.title}</h3>
              <div className="prose max-w-none">
                <div
                  className="announcement-content"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );

  const renderFAQs = () => (
    <div className="space-y-6">
      {faqs.length === 0 ? (
        <div className="text-center py-12">
          <SafeIcon icon={FiHelpCircle} className="h-16 w-16 text-text-light mx-auto mb-4" />
          <p className="text-xl">No FAQs yet</p>
          <p className="text-text-light">Check back soon for answers to common questions!</p>
        </div>
      ) : (
        faqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-start space-x-3 mb-3">
              <SafeIcon icon={FiHelpCircle} className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <h3 className="text-xl md:text-2xl font-semibold">{faq.question}</h3>
            </div>
            <div className="ml-9 prose max-w-none">
              <div
                className="announcement-content text-text-light"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          </motion.div>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen py-12 relative" style={{ backgroundColor: '#fcfaf2' }}>
      {/* Back to Home Button */}
      <div className="fixed top-6 right-6 z-50">
        <Link
          to="/"
          className="inline-flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          style={{ backgroundColor: '#83A682' }}
          title="Back to Home"
        >
          <SafeIcon icon={FiHome} className="h-5 w-5 text-white" />
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center space-x-4 mb-1"
          >
            <SafeIcon icon={FiTrendingUp} className="h-8 w-8 text-primary" />
            <Link to="/" className="hover:text-primary transition-colors">
              <h1 className="text-3xl md:text-4xl">Capital Campaign</h1>
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base page-subtitle"
          >
            Building together for our future
          </motion.p>
        </div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <button
            onClick={() => setActiveTab('updates')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'updates'
                ? 'shadow-lg text-white'
                : 'bg-white shadow-md hover:shadow-lg'
            }`}
            style={activeTab === 'updates' ? { backgroundColor: '#83A682' } : {}}
          >
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFileText} className="h-5 w-5" />
              <span>Updates</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('vision')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'vision'
                ? 'shadow-lg text-white'
                : 'bg-white shadow-md hover:shadow-lg'
            }`}
            style={activeTab === 'vision' ? { backgroundColor: '#83A682' } : {}}
          >
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiEye} className="h-5 w-5" />
              <span>Vision</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'faqs'
                ? 'shadow-lg text-white'
                : 'bg-white shadow-md hover:shadow-lg'
            }`}
            style={activeTab === 'faqs' ? { backgroundColor: '#83A682' } : {}}
          >
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiHelpCircle} className="h-5 w-5" />
              <span>Q&A</span>
            </div>
          </button>
        </motion.div>

        {/* Content */}
        <LoadingTransition
          isLoading={loading}
          skeleton={
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} showImage={false} showMeta={true} />
              ))}
            </div>
          }
        >
          {activeTab === 'updates' && renderUpdates()}
          {activeTab === 'vision' && renderVision()}
          {activeTab === 'faqs' && renderFAQs()}
        </LoadingTransition>
      </div>
    </div>
  );
};

export default CapitalCampaign;
