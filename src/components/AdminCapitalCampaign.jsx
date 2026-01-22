import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import RichTextEditor from './RichTextEditor';
import { SkeletonTable, SkeletonForm, LoadingTransition } from './LoadingSkeletons';
import supabase from '../lib/supabase';

const { FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiFileText, FiEye, FiHelpCircle } = FiIcons;

const AdminCapitalCampaign = () => {
  const [activeSection, setActiveSection] = useState('updates');
  const [updates, setUpdates] = useState([]);
  const [visionItems, setVisionItems] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [updateFormData, setUpdateFormData] = useState({
    title: '',
    content: '',
    type: 'written',
    video_url: '',
    thumbnail_url: '',
    published: false,
    display_order: 0
  });

  const [visionFormData, setVisionFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    published: false,
    display_order: 0
  });

  const [faqFormData, setFaqFormData] = useState({
    question: '',
    answer: '',
    published: false,
    display_order: 0
  });

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    setLoading(true);
    try {
      const [updatesRes, visionRes, faqsRes] = await Promise.all([
        supabase
          .from('campaign_updates')
          .select('*')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false }),
        supabase
          .from('campaign_vision')
          .select('*')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false }),
        supabase
          .from('campaign_faqs')
          .select('*')
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
      console.error('Error fetching growth campaign content:', error);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        title: updateFormData.title,
        content: updateFormData.content,
        type: updateFormData.type,
        video_url: updateFormData.video_url || null,
        thumbnail_url: updateFormData.thumbnail_url || null,
        published: updateFormData.published,
        display_order: updateFormData.display_order
      };

      if (editingId) {
        const { error } = await supabase
          .from('campaign_updates')
          .update(data)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('campaign_updates')
          .insert([data]);
        if (error) throw error;
      }
      handleCancel();
      fetchAllContent();
    } catch (error) {
      console.error('Error saving update:', error);
      alert(`Error saving update: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVisionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        title: visionFormData.title,
        content: visionFormData.content,
        image_url: visionFormData.image_url || null,
        published: visionFormData.published,
        display_order: visionFormData.display_order
      };

      if (editingId) {
        const { error } = await supabase
          .from('campaign_vision')
          .update(data)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('campaign_vision')
          .insert([data]);
        if (error) throw error;
      }
      handleCancel();
      fetchAllContent();
    } catch (error) {
      console.error('Error saving vision:', error);
      alert(`Error saving vision: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFaqSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        question: faqFormData.question,
        answer: faqFormData.answer,
        published: faqFormData.published,
        display_order: faqFormData.display_order
      };

      if (editingId) {
        const { error } = await supabase
          .from('campaign_faqs')
          .update(data)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('campaign_faqs')
          .insert([data]);
        if (error) throw error;
      }
      handleCancel();
      fetchAllContent();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert(`Error saving FAQ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUpdate = (update) => {
    setUpdateFormData({
      title: update.title,
      content: update.content,
      type: update.type,
      video_url: update.video_url || '',
      thumbnail_url: update.thumbnail_url || '',
      published: update.published,
      display_order: update.display_order
    });
    setEditingId(update.id);
    setActiveSection('updates');
    setShowForm(true);
  };

  const handleEditVision = (item) => {
    setVisionFormData({
      title: item.title,
      content: item.content,
      image_url: item.image_url || '',
      published: item.published,
      display_order: item.display_order
    });
    setEditingId(item.id);
    setActiveSection('vision');
    setShowForm(true);
  };

  const handleEditFaq = (faq) => {
    setFaqFormData({
      question: faq.question,
      answer: faq.answer,
      published: faq.published,
      display_order: faq.display_order
    });
    setEditingId(faq.id);
    setActiveSection('faqs');
    setShowForm(true);
  };

  const handleDelete = async (table, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchAllContent();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item. Please try again.');
    }
  };

  const handleCancel = () => {
    setUpdateFormData({
      title: '',
      content: '',
      type: 'written',
      video_url: '',
      thumbnail_url: '',
      published: false,
      display_order: 0
    });
    setVisionFormData({
      title: '',
      content: '',
      image_url: '',
      published: false,
      display_order: 0
    });
    setFaqFormData({
      question: '',
      answer: '',
      published: false,
      display_order: 0
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderUpdatesSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-text-primary">Campaign Updates</h3>
        <button
          onClick={() => { setActiveSection('updates'); setShowForm(true); }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>New Update</span>
        </button>
      </div>

      {showForm && activeSection === 'updates' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Title *</label>
                <input
                  type="text"
                  value={updateFormData.title}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, title: e.target.value })}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Type *</label>
                <select
                  value={updateFormData.type}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, type: e.target.value })}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="written">Written Update</option>
                  <option value="video">Video Update</option>
                </select>
              </div>
            </div>

            {updateFormData.type === 'video' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Video URL</label>
                  <input
                    type="url"
                    value={updateFormData.video_url}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, video_url: e.target.value })}
                    className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="YouTube or video URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Thumbnail URL</label>
                  <input
                    type="url"
                    value={updateFormData.thumbnail_url}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, thumbnail_url: e.target.value })}
                    className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Content *</label>
              <RichTextEditor
                value={updateFormData.content}
                onChange={(e) => setUpdateFormData({ ...updateFormData, content: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Display Order</label>
                <input
                  type="number"
                  value={updateFormData.display_order}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex items-center pt-7">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={updateFormData.published}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, published: e.target.checked })}
                    className="form-checkbox h-5 w-5 text-primary"
                  />
                  <span className="ml-2 text-text-primary">Published</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-text-primary px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors inline-flex items-center space-x-2"
              >
                <SafeIcon icon={FiX} className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} className="h-4 w-4" />
                <span>{editingId ? 'Update' : 'Create'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <LoadingTransition isLoading={loading} skeleton={<SkeletonTable />}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-accent">
            <thead className="bg-accent">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-accent">
              {updates.map((update) => (
                <tr key={update.id}>
                  <td className="px-6 py-4 text-sm text-text-primary">{update.title}</td>
                  <td className="px-6 py-4 text-sm text-text-light capitalize">{update.type}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${update.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {update.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-light">{update.display_order}</td>
                  <td className="px-6 py-4 text-sm text-text-light">{formatDate(update.created_at)}</td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button
                      onClick={() => handleEditUpdate(update)}
                      className="text-primary hover:text-primary-dark"
                    >
                      <SafeIcon icon={FiEdit} className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('campaign_updates', update.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LoadingTransition>
    </div>
  );

  const renderVisionSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-text-primary">Campaign Vision</h3>
        <button
          onClick={() => { setActiveSection('vision'); setShowForm(true); }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>New Vision Item</span>
        </button>
      </div>

      {showForm && activeSection === 'vision' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <form onSubmit={handleVisionSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Title *</label>
                <input
                  type="text"
                  value={visionFormData.title}
                  onChange={(e) => setVisionFormData({ ...visionFormData, title: e.target.value })}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Image URL</label>
                <input
                  type="url"
                  value={visionFormData.image_url}
                  onChange={(e) => setVisionFormData({ ...visionFormData, image_url: e.target.value })}
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Content *</label>
              <RichTextEditor
                value={visionFormData.content}
                onChange={(e) => setVisionFormData({ ...visionFormData, content: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Display Order</label>
                <input
                  type="number"
                  value={visionFormData.display_order}
                  onChange={(e) => setVisionFormData({ ...visionFormData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex items-center pt-7">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visionFormData.published}
                    onChange={(e) => setVisionFormData({ ...visionFormData, published: e.target.checked })}
                    className="form-checkbox h-5 w-5 text-primary"
                  />
                  <span className="ml-2 text-text-primary">Published</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-text-primary px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors inline-flex items-center space-x-2"
              >
                <SafeIcon icon={FiX} className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} className="h-4 w-4" />
                <span>{editingId ? 'Update' : 'Create'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <LoadingTransition isLoading={loading} skeleton={<SkeletonTable />}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-accent">
            <thead className="bg-accent">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-accent">
              {visionItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm text-text-primary">{item.title}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${item.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {item.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-light">{item.display_order}</td>
                  <td className="px-6 py-4 text-sm text-text-light">{formatDate(item.created_at)}</td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button
                      onClick={() => handleEditVision(item)}
                      className="text-primary hover:text-primary-dark"
                    >
                      <SafeIcon icon={FiEdit} className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('campaign_vision', item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LoadingTransition>
    </div>
  );

  const renderFaqsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-text-primary">FAQs</h3>
        <button
          onClick={() => { setActiveSection('faqs'); setShowForm(true); }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>New FAQ</span>
        </button>
      </div>

      {showForm && activeSection === 'faqs' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <form onSubmit={handleFaqSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Question *</label>
              <input
                type="text"
                value={faqFormData.question}
                onChange={(e) => setFaqFormData({ ...faqFormData, question: e.target.value })}
                required
                className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Answer *</label>
              <RichTextEditor
                value={faqFormData.answer}
                onChange={(e) => setFaqFormData({ ...faqFormData, answer: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Display Order</label>
                <input
                  type="number"
                  value={faqFormData.display_order}
                  onChange={(e) => setFaqFormData({ ...faqFormData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex items-center pt-7">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={faqFormData.published}
                    onChange={(e) => setFaqFormData({ ...faqFormData, published: e.target.checked })}
                    className="form-checkbox h-5 w-5 text-primary"
                  />
                  <span className="ml-2 text-text-primary">Published</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-text-primary px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors inline-flex items-center space-x-2"
              >
                <SafeIcon icon={FiX} className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} className="h-4 w-4" />
                <span>{editingId ? 'Update' : 'Create'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <LoadingTransition isLoading={loading} skeleton={<SkeletonTable />}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-accent">
            <thead className="bg-accent">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Question</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-accent">
              {faqs.map((faq) => (
                <tr key={faq.id}>
                  <td className="px-6 py-4 text-sm text-text-primary">{faq.question}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${faq.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {faq.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-light">{faq.display_order}</td>
                  <td className="px-6 py-4 text-sm text-text-light">{formatDate(faq.created_at)}</td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button
                      onClick={() => handleEditFaq(faq)}
                      className="text-primary hover:text-primary-dark"
                    >
                      <SafeIcon icon={FiEdit} className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('campaign_faqs', faq.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LoadingTransition>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-text-primary">Manage Growth Campaign</h2>

      <div className="flex space-x-4 border-b border-accent">
        <button
          onClick={() => setActiveSection('updates')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === 'updates'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-light hover:text-text-primary'
          }`}
        >
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFileText} className="h-4 w-4" />
            <span>Updates</span>
          </div>
        </button>
        <button
          onClick={() => setActiveSection('vision')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === 'vision'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-light hover:text-text-primary'
          }`}
        >
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiEye} className="h-4 w-4" />
            <span>Vision</span>
          </div>
        </button>
        <button
          onClick={() => setActiveSection('faqs')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === 'faqs'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-light hover:text-text-primary'
          }`}
        >
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiHelpCircle} className="h-4 w-4" />
            <span>FAQs</span>
          </div>
        </button>
      </div>

      {activeSection === 'updates' && renderUpdatesSection()}
      {activeSection === 'vision' && renderVisionSection()}
      {activeSection === 'faqs' && renderFaqsSection()}
    </div>
  );
};

export default AdminCapitalCampaign;
