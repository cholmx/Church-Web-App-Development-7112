import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSave, FiRefreshCw, FiBookOpen, FiExternalLink } = FiIcons;

const AdminResources = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amazon_link: '',
    description: ''
  });

  useEffect(() => {
    fetchResourcesData();
  }, []);

  const fetchResourcesData = async () => {
    try {
      const cached = localStorage.getItem('resources_portal123');
      if (cached) {
        const data = JSON.parse(cached);
        if (data && data.length > 0) {
          setFormData({
            title: data[0].title || '',
            amazon_link: data[0].amazon_link || '',
            description: data[0].description || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching resources data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const resourcesData = [{
        id: '1',
        title: formData.title,
        amazon_link: formData.amazon_link,
        description: formData.description,
        updated_at: new Date().toISOString()
      }];

      localStorage.setItem('resources_portal123', JSON.stringify(resourcesData));
      alert('Resources updated successfully!');
    } catch (error) {
      console.error('Error saving resources:', error);
      alert('Error saving resources. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-secondary font-inter">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-secondary font-inter">
          Manage Resources
        </h2>
        <button
          onClick={fetchResourcesData}
          className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary-dark transition-colors inline-flex items-center space-x-2 font-inter"
        >
          <SafeIcon icon={FiRefreshCw} className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2 font-inter">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
              placeholder="e.g., Recommended Books"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2 font-inter">
              Amazon Link *
            </label>
            <input
              type="url"
              name="amazon_link"
              value={formData.amazon_link}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
              placeholder="https://www.amazon.com/shop/your-store"
            />
            <p className="text-sm text-secondary-light mt-1 font-inter">
              Enter your Amazon affiliate link or book collection URL
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2 font-inter">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-inter"
              placeholder="Brief description of the resources"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 inline-flex items-center justify-center space-x-2 font-inter"
          >
            <SafeIcon icon={FiSave} className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Resources'}</span>
          </button>
        </form>
      </motion.div>

      {formData.amazon_link && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-secondary mb-4 font-inter">Preview</h3>
          <div className="border border-accent-dark rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <SafeIcon icon={FiBookOpen} className="h-8 w-8 text-primary" />
              <h4 className="text-xl font-semibold text-secondary font-inter">
                {formData.title || 'Resources'}
              </h4>
            </div>
            {formData.description && (
              <p className="text-secondary mb-4 font-inter">{formData.description}</p>
            )}
            <a
              href={formData.amazon_link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors inline-flex items-center space-x-2 font-inter"
            >
              <SafeIcon icon={FiExternalLink} className="h-4 w-4" />
              <span>View Resources</span>
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminResources;