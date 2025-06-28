import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import RichTextEditor from './RichTextEditor';
import supabase from '../lib/supabase';

const { FiPlus, FiEdit, FiTrash2, FiSave, FiX } = FiIcons;

const AdminSermons = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    sermon_date: '',
    youtube_url: '',
    summary: '',
    discussion_questions: ''
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sermonData = {
        title: formData.title,
        speaker: formData.speaker,
        sermon_date: formData.sermon_date,
        youtube_url: formData.youtube_url,
        summary: formData.summary, // Store HTML directly
        discussion_questions: formData.discussion_questions // Store HTML directly
      };

      if (editingId) {
        const { error } = await supabase
          .from('sermons_portal123')
          .update(sermonData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('sermons_portal123')
          .insert([sermonData]);

        if (error) throw error;
      }

      setFormData({
        title: '',
        speaker: '',
        sermon_date: '',
        youtube_url: '',
        summary: '',
        discussion_questions: ''
      });
      setEditingId(null);
      setShowForm(false);
      fetchSermons();
    } catch (error) {
      console.error('Error saving sermon:', error);
      alert('Error saving sermon. Please try again.');
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
      summary: sermon.summary, // Use HTML directly
      discussion_questions: sermon.discussion_questions // Use HTML directly
    });
    setEditingId(sermon.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this sermon?')) return;

    try {
      const { error } = await supabase
        .from('sermons_portal123')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchSermons();
    } catch (error) {
      console.error('Error deleting sermon:', error);
      alert('Error deleting sermon. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      speaker: '',
      sermon_date: '',
      youtube_url: '',
      summary: '',
      discussion_questions: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-secondary font-fraunces">
          Manage Sermons
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors inline-flex items-center space-x-2 font-inter"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>New Sermon</span>
        </button>
      </div>

      {/* Form */}
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
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, sermon_date: e.target.value })}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                Sermon Summary
              </label>
              <RichTextEditor
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, discussion_questions: e.target.value })}
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
                    <h3 className="text-lg font-semibold text-secondary font-fraunces mb-2">
                      {sermon.title}
                    </h3>
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