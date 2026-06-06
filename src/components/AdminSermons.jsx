import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import RichTextEditor from './RichTextEditor';
import supabase from '../lib/supabase';

const { FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiLayers, FiAlertTriangle, FiCheckCircle } = FiIcons;

const AdminSermons = () => {
  const [sermons, setSermons] = useState([]);
  const [sermonSeries, setSermonSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSeriesForm, setShowSeriesForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    sermon_date: '',
    youtube_url: '',
    summary: '',
    discussion_questions: '',
    sermon_series_id: ''
  });

  const [seriesFormData, setSeriesFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchSermons();
    fetchSermonSeries();
  }, []);

  const fetchSermons = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('sermons_portal123')
        .select('*')
        .order('sermon_date', { ascending: false });

      if (error) throw error;
      setSermons(data || []);
    } catch (error) {
      console.error('Error fetching sermons:', error);
      setError('Failed to fetch sermons: ' + error.message);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      const sermonData = {
        title: formData.title,
        speaker: formData.speaker,
        sermon_date: formData.sermon_date,
        youtube_url: formData.youtube_url,
        summary: formData.summary,
        discussion_questions: formData.discussion_questions,
        sermon_series_id: formData.sermon_series_id || null
      };

      if (editingId) {
        const { error } = await supabase
          .from('sermons_portal123')
          .update(sermonData)
          .eq('id', editingId);

        if (error) throw error;
        setSuccess('Sermon updated successfully!');
      } else {
        const { error } = await supabase
          .from('sermons_portal123')
          .insert([sermonData]);

        if (error) throw error;
        setSuccess('Sermon created successfully!');
      }

      setFormData({
        title: '',
        speaker: '',
        sermon_date: '',
        youtube_url: '',
        summary: '',
        discussion_questions: '',
        sermon_series_id: ''
      });
      setEditingId(null);
      setShowForm(false);
      fetchSermons();
    } catch (error) {
      console.error('Error saving sermon:', error);
      setError('Error saving sermon: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeriesSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      const { error } = await supabase
        .from('sermon_series_portal123')
        .insert([seriesFormData]);

      if (error) throw error;
      
      setSuccess('Sermon series created successfully!');
      setSeriesFormData({
        name: '',
        description: '',
        start_date: '',
        end_date: ''
      });
      setShowSeriesForm(false);
      fetchSermonSeries();
    } catch (error) {
      console.error('Error saving sermon series:', error);
      setError('Error saving sermon series: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sermon) => {
    setFormData({
      title: sermon.title,
      speaker: sermon.speaker || '',
      sermon_date: sermon.sermon_date,
      youtube_url: sermon.youtube_url || '',
      summary: sermon.summary,
      discussion_questions: sermon.discussion_questions,
      sermon_series_id: sermon.sermon_series_id || ''
    });
    setEditingId(sermon.id);
    setShowForm(true);
    setError(null);
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this sermon?')) return;

    try {
      const { error } = await supabase
        .from('sermons_portal123')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('Sermon deleted successfully!');
      fetchSermons();
    } catch (error) {
      console.error('Error deleting sermon:', error);
      setError('Error deleting sermon: ' + error.message);
    }
  };

  const handleDeleteSeries = async (id) => {
    if (!confirm('Are you sure you want to delete this sermon series? This will not delete the sermons in the series.')) return;

    try {
      const { error } = await supabase
        .from('sermon_series_portal123')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('Sermon series deleted successfully!');
      fetchSermonSeries();
    } catch (error) {
      console.error('Error deleting sermon series:', error);
      setError('Error deleting sermon series: ' + error.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      speaker: '',
      sermon_date: '',
      youtube_url: '',
      summary: '',
      discussion_questions: '',
      sermon_series_id: ''
    });
    setEditingId(null);
    setShowForm(false);
    setError(null);
    setSuccess('');
  };

  const getSeriesName = (seriesId) => {
    const series = sermonSeries.find(s => s.id === seriesId);
    return series ? series.name : 'Standalone Sermon';
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiCheckCircle} className="h-5 w-5 text-green-600" />
            <p className="text-green-700 font-inter">{success}</p>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiAlertTriangle} className="h-5 w-5 text-red-600" />
            <p className="text-red-700 font-inter">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-secondary font-inter">
          Manage Sermons
        </h2>
        <div className="space-x-2">
          <button
            onClick={() => setShowSeriesForm(true)}
            className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary-dark transition-colors inline-flex items-center space-x-2 font-inter"
          >
            <SafeIcon icon={FiLayers} className="h-4 w-4" />
            <span>New Series</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors inline-flex items-center space-x-2 font-inter"
          >
            <SafeIcon icon={FiPlus} className="h-4 w-4" />
            <span>New Sermon</span>
          </button>
        </div>
      </div>

      {/* Series Management */}
      {sermonSeries.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-secondary mb-4 font-inter">
            Sermon Series
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sermonSeries.map((series) => (
              <div key={series.id} className="border border-accent-dark rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-secondary font-inter">{series.name}</h4>
                  <button
                    onClick={() => handleDeleteSeries(series.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-secondary-light mb-2 font-inter">{series.description}</p>
                <div className="text-xs text-secondary-light font-inter">
                  {new Date(series.start_date).toLocaleDateString()} - {
                    series.end_date ? new Date(series.end_date).toLocaleDateString() : 'Ongoing'
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Series Form */}
      {showSeriesForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-secondary mb-4 font-inter">
            Create New Sermon Series
          </h3>
          <form onSubmit={handleSeriesSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Series Name *
                </label>
                <input
                  type="text"
                  value={seriesFormData.name}
                  onChange={(e) => setSeriesFormData({...seriesFormData, name: e.target.value})}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                  placeholder="e.g., Faith in Action"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={seriesFormData.start_date}
                  onChange={(e) => setSeriesFormData({...seriesFormData, start_date: e.target.value})}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Description
                </label>
                <textarea
                  value={seriesFormData.description}
                  onChange={(e) => setSeriesFormData({...seriesFormData, description: e.target.value})}
                  rows={3}
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-inter"
                  placeholder="Brief description of the sermon series"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={seriesFormData.end_date}
                  onChange={(e) => setSeriesFormData({...seriesFormData, end_date: e.target.value})}
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 inline-flex items-center space-x-2 font-inter"
              >
                <SafeIcon icon={FiSave} className="h-4 w-4" />
                <span>Create Series</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSeriesForm(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors inline-flex items-center space-x-2 font-inter"
              >
                <SafeIcon icon={FiX} className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Sermon Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                  placeholder="Sermon title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Speaker
                </label>
                <input
                  type="text"
                  value={formData.speaker}
                  onChange={(e) => setFormData({...formData, speaker: e.target.value})}
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                  placeholder="Speaker name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Sermon Date *
                </label>
                <input
                  type="date"
                  value={formData.sermon_date}
                  onChange={(e) => setFormData({...formData, sermon_date: e.target.value})}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Sermon Series
                </label>
                <select
                  value={formData.sermon_series_id}
                  onChange={(e) => setFormData({...formData, sermon_series_id: e.target.value})}
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                >
                  <option value="">Standalone Sermon</option>
                  {sermonSeries.map((series) => (
                    <option key={series.id} value={series.id}>
                      {series.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                YouTube URL
              </label>
              <input
                type="url"
                value={formData.youtube_url}
                onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
                className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                Sermon Summary
              </label>
              <RichTextEditor
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                placeholder="Paste your sermon summary here... Formatting will be preserved!"
                rows={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                Discussion Questions
              </label>
              <RichTextEditor
                value={formData.discussion_questions}
                onChange={(e) => setFormData({...formData, discussion_questions: e.target.value})}
                placeholder="Paste your discussion questions here... Lists and formatting will be preserved!"
                rows={6}
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 inline-flex items-center space-x-2 font-inter"
              >
                <SafeIcon icon={FiSave} className="h-4 w-4" />
                <span>{editingId ? 'Update' : 'Create'}</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors inline-flex items-center space-x-2 font-inter"
              >
                <SafeIcon icon={FiX} className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Sermons List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-secondary font-inter">Loading...</p>
          </div>
        ) : sermons.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-secondary font-inter">No sermons yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-accent">
            {sermons.map((sermon) => (
              <div key={sermon.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-secondary font-inter mb-2">
                      {sermon.title}
                    </h3>
                    {sermon.sermon_series_id && (
                      <div className="mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-white font-inter">
                          <SafeIcon icon={FiLayers} className="h-3 w-3 mr-1" />
                          {getSeriesName(sermon.sermon_series_id)}
                        </span>
                      </div>
                    )}
                    <div className="text-sm text-secondary-light font-inter mb-2">
                      {sermon.speaker && `${sermon.speaker} • `}
                      {new Date(sermon.sermon_date).toLocaleDateString()}
                    </div>
                    {sermon.youtube_url && (
                      <div className="text-sm text-primary font-inter mb-2">
                        YouTube: {sermon.youtube_url}
                      </div>
                    )}
                    {sermon.summary && (
                      <div className="text-sm text-secondary font-inter mb-2">
                        Summary: {sermon.summary.replace(/<[^>]*>/g, '').substring(0, 100)}...
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(sermon)}
                      className="p-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiEdit} className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sermon.id)}
                      className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSermons;