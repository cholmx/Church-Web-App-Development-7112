import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/localStorage';

const { FiSave, FiRefreshCw } = FiIcons;

const AdminPodcast = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    spotify_embed_url: '',
    description: ''
  });

  useEffect(() => {
    fetchPodcastData();
  }, []);

  const fetchPodcastData = async () => {
    try {
      const { data, error } = await supabase
        .from('podcast_portal123')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setFormData({
          title: data[0].title || '',
          spotify_embed_url: data[0].spotify_embed_url || '',
          description: data[0].description || ''
        });
      }
    } catch (error) {
      console.error('Error fetching podcast data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // For localStorage version, we'll just replace the entire podcast data
      const podcastData = [{
        id: '1',
        title: formData.title,
        spotify_embed_url: formData.spotify_embed_url,
        description: formData.description,
        updated_at: new Date().toISOString()
      }];
      
      localStorage.setItem('podcast_portal123', JSON.stringify(podcastData));
      alert('Podcast updated successfully!');
    } catch (error) {
      console.error('Error saving podcast:', error);
      alert('Error saving podcast. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-secondary font-fraunces">
          Manage Podcast
        </h2>
        <button
          onClick={fetchPodcastData}
          className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary-dark transition-colors inline-flex items-center space-x-2 font-inter"
        >
          <SafeIcon icon={FiRefreshCw} className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2 font-inter">
              Podcast Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
              placeholder="Episode title or podcast name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2 font-inter">
              Spotify Embed URL *
            </label>
            <input
              type="url"
              name="spotify_embed_url"
              value={formData.spotify_embed_url}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
              placeholder="https://open.spotify.com/embed/episode/..."
            />
            <p className="text-sm text-secondary-light mt-1 font-inter">
              Get the embed URL from Spotify: Share → Embed Episode → Copy the src URL
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
              rows={6}
              className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-inter"
              placeholder="Episode description (HTML allowed)"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 inline-flex items-center justify-center space-x-2 font-inter"
          >
            <SafeIcon icon={FiSave} className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Podcast'}</span>
          </button>
        </form>
      </motion.div>

      {/* Preview */}
      {formData.spotify_embed_url && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-secondary mb-4 font-fraunces">
            Preview
          </h3>
          <div className="w-full h-96 rounded-lg overflow-hidden bg-gray-100">
            <iframe
              src={formData.spotify_embed_url}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Podcast Preview"
            ></iframe>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminPodcast;