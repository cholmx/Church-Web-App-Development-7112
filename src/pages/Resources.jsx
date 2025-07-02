import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiBookOpen, FiHome, FiExternalLink } = FiIcons;

const Resources = () => {
  const [resourcesData, setResourcesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResourcesData();
  }, []);

  const fetchResourcesData = async () => {
    try {
      const cached = localStorage.getItem('resources_portal123');
      if (cached) {
        const data = JSON.parse(cached);
        if (data && data.length > 0) {
          setResourcesData(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching resources data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResourceClick = () => {
    if (resourcesData?.amazon_link) {
      window.open(resourcesData.amazon_link, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-accent py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary font-inter">Loading...</p>
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
            className="flex items-center justify-center space-x-4 mb-3"
          >
            <SafeIcon icon={FiBookOpen} className="h-8 w-8 text-primary" />
            <Link to="/" className="hover:text-primary transition-colors">
              <h1 className="text-3xl md:text-4xl font-bold text-secondary font-inter">
                {resourcesData?.title || 'Resources'}
              </h1>
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-white font-inter"
          >
            {resourcesData?.description || 'Helpful resources for your faith journey'}
          </motion.p>
        </div>

        {/* Resources Card */}
        {resourcesData?.amazon_link ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="bg-primary text-white p-8 text-center">
              <SafeIcon icon={FiBookOpen} className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4 font-inter">
                {resourcesData.title}
              </h2>
              {resourcesData.description && (
                <p className="text-white text-lg font-inter">
                  {resourcesData.description}
                </p>
              )}
            </div>

            <div className="p-8 text-center">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-secondary mb-4 font-inter">
                  Curated Book Collection
                </h3>
                <p className="text-secondary mb-6 font-inter">
                  Browse our carefully selected collection of books to help you grow in your faith, deepen your understanding of Scripture, and strengthen your relationship with God.
                </p>
                <button
                  onClick={handleResourceClick}
                  className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors inline-flex items-center space-x-3 font-inter"
                >
                  <SafeIcon icon={FiExternalLink} className="h-5 w-5" />
                  <span>Browse Books</span>
                </button>
              </div>

              {/* Additional Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <SafeIcon icon={FiBookOpen} className="h-6 w-6 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2 font-inter">
                      Recommended Reading
                    </h4>
                    <p className="text-green-700 font-inter">
                      These books have been carefully selected by our pastoral team to support your spiritual growth and biblical understanding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-12 text-center"
          >
            <SafeIcon icon={FiBookOpen} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-secondary mb-2 font-inter">
              Resources Coming Soon
            </h2>
            <p className="text-secondary-light font-inter">
              We're working on curating helpful resources for you. Check back soon!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Resources;