import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { SkeletonCard, LoadingTransition } from '../components/LoadingSkeletons';
import { useCleanContent } from '../hooks/useCleanContent';
import supabase from '../lib/supabase';

const { FiTrendingUp, FiHome, FiPlayCircle, FiFileText, FiHelpCircle, FiEye, FiMessageSquare, FiSend, FiChevronDown, FiChevronUp } = FiIcons;

const CapitalCampaign = () => {
  const [updates, setUpdates] = useState([]);
  const [visionItems, setVisionItems] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('updates');
  const [commentForm, setCommentForm] = useState({
    author_name: '',
    author_email: '',
    comment_text: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  useCleanContent();

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      const [updatesRes, visionRes, faqsRes, commentsRes] = await Promise.all([
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
          .order('created_at', { ascending: false }),
        supabase
          .from('campaign_comments')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
      ]);

      if (updatesRes.error) throw updatesRes.error;
      if (visionRes.error) throw visionRes.error;
      if (faqsRes.error) throw faqsRes.error;
      if (commentsRes.error) throw commentsRes.error;

      setUpdates(updatesRes.data || []);
      setVisionItems(visionRes.data || []);
      setFaqs(faqsRes.data || []);
      setComments(commentsRes.data || []);
    } catch (error) {
      console.error('Error fetching growth campaign content:', error);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(false);

    try {
      const { error } = await supabase
        .from('campaign_comments')
        .insert([commentForm]);

      if (error) throw error;

      setCommentForm({
        author_name: '',
        author_email: '',
        comment_text: ''
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsFormExpanded(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
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
          <p className="text-text-light">Check back soon for updates!</p>
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
                className="announcement-content"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          </motion.div>
        ))
      )}
    </div>
  );

  const renderComments = () => (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <button
          onClick={() => setIsFormExpanded(!isFormExpanded)}
          className="w-full px-6 py-4 md:px-8 md:py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiMessageSquare} className="h-6 w-6 text-primary" />
            <span className="text-xl md:text-2xl font-semibold">Ask a Question or Leave a Comment</span>
          </div>
          <SafeIcon
            icon={isFormExpanded ? FiChevronUp : FiChevronDown}
            className="h-6 w-6 text-primary"
          />
        </button>

        {isFormExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6 md:px-8 md:pb-8 border-t border-gray-200"
          >
            {submitSuccess && (
              <div className="mt-6 mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">
                  Thank you! Your comment has been submitted and is awaiting approval.
                </p>
              </div>
            )}

            <form onSubmit={handleCommentSubmit} className="space-y-4 mt-6">
              <div>
                <label htmlFor="author_name" className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="author_name"
                  required
                  value={commentForm.author_name}
                  onChange={(e) => setCommentForm({ ...commentForm, author_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="author_email" className="block text-sm font-medium mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="author_email"
                  required
                  value={commentForm.author_email}
                  onChange={(e) => setCommentForm({ ...commentForm, author_email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="comment_text" className="block text-sm font-medium mb-2">
                  Your Question or Comment
                </label>
                <textarea
                  id="comment_text"
                  required
                  rows="4"
                  value={commentForm.comment_text}
                  onChange={(e) => setCommentForm({ ...commentForm, comment_text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="What would you like to know?"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white"
                style={{ backgroundColor: '#83A682' }}
              >
                <SafeIcon icon={FiSend} className="h-5 w-5" />
                <span>{submitting ? 'Submitting...' : 'Submit'}</span>
              </button>
            </form>
          </motion.div>
        )}
      </motion.div>

      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Questions & Comments</h3>
        {comments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <SafeIcon icon={FiMessageSquare} className="h-16 w-16 text-text-light mx-auto mb-4" />
            <p className="text-xl">No comments yet</p>
            <p className="text-text-light">Be the first to ask a question!</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-start space-x-3 mb-3">
                <SafeIcon icon={FiMessageSquare} className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg">{comment.author_name}</h4>
                    <span className="text-sm text-text-light">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-text-primary mb-4">{comment.comment_text}</p>

                  {comment.admin_reply && (
                    <div className="mt-4 pl-4 border-l-4 border-primary bg-gray-50 p-4 rounded">
                      <p className="text-sm font-semibold mb-2">Response:</p>
                      <p className="text-text-primary">{comment.admin_reply}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
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
              <h1 className="text-3xl md:text-4xl">Growth Campaign</h1>
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base page-subtitle"
          >
            Transforming Together
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

          <button
            onClick={() => setActiveTab('comments')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'comments'
                ? 'shadow-lg text-white'
                : 'bg-white shadow-md hover:shadow-lg'
            }`}
            style={activeTab === 'comments' ? { backgroundColor: '#83A682' } : {}}
          >
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiMessageSquare} className="h-5 w-5" />
              <span>Comments</span>
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
          {activeTab === 'comments' && renderComments()}
        </LoadingTransition>
      </div>
    </div>
  );
};

export default CapitalCampaign;
