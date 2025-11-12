import React,{useState,useEffect} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import RichTextEditor from './RichTextEditor';
import {SkeletonTable,SkeletonForm,LoadingTransition} from './LoadingSkeletons';
import supabase from '../lib/supabase';

const {FiPlus,FiEdit,FiTrash2,FiSave,FiX}=FiIcons;

const AdminAnnouncements=()=> {
  const [announcements,setAnnouncements]=useState([]);
  const [loading,setLoading]=useState(true);
  const [editingId,setEditingId]=useState(null);
  const [showForm,setShowForm]=useState(false);
  const [formData,setFormData]=useState({title: '',content: '',author: '',announcement_date: ''});

  useEffect(()=> {
    fetchAnnouncements();
  },[]);

  const fetchAnnouncements=async ()=> {
    try {
      const {data,error}=await supabase
        .from('announcements_portal123')
        .select('*')
        .order('announcement_date',{ascending: false});
      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:',error);
    } finally {
      setTimeout(()=> setLoading(false),600);
    }
  };

  const handleSubmit=async (e)=> {
    e.preventDefault();
    setLoading(true);
    try {
      const announcementData={
        title: formData.title,
        content: formData.content,
        author: formData.author,
        announcement_date: formData.announcement_date || new Date().toISOString().split('T')[0]
      };

      if (editingId) {
        const {error}=await supabase
          .from('announcements_portal123')
          .update(announcementData)
          .eq('id',editingId);
        if (error) throw error;
      } else {
        const {error}=await supabase
          .from('announcements_portal123')
          .insert([announcementData]);
        if (error) throw error;
      }
      handleCancel();
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:',error);
      alert('Error saving announcement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit=(announcement)=> {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      author: announcement.author || '',
      announcement_date: announcement.announcement_date || ''
    });
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const handleDelete=async (id)=> {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const {error}=await supabase
        .from('announcements_portal123')
        .delete()
        .eq('id',id);
      if (error) throw error;
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:',error);
      alert('Error deleting announcement. Please try again.');
    }
  };

  const handleCancel=()=> {
    setFormData({title: '',content: '',author: '',announcement_date: ''});
    setEditingId(null);
    setShowForm(false);
  };

  const handleContentChange=(e)=> {
    setFormData({...formData,content: e.target.value});
  };

  const formatDate=(dateString)=> {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US',{
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-text-primary">Manage Announcements</h2>
        <button
          onClick={()=> setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Form with Loading */}
      {showForm && (
        <LoadingTransition isLoading={loading && editingId} skeleton={<SkeletonForm />}>
          <motion.div
            initial={{opacity: 0,y: 20}}
            animate={{opacity: 1,y: 0}}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e)=> setFormData({...formData,title: e.target.value})}
                    required
                    className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Announcement title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.announcement_date}
                    onChange={(e)=> setFormData({...formData,announcement_date: e.target.value})}
                    required
                    className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Content *</label>
                <RichTextEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Paste your formatted announcement here... Bold text,line breaks,and lists will be preserved automatically!"
                  rows={12}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e)=> setFormData({...formData,author: e.target.value})}
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Author name (optional)"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 inline-flex items-center space-x-2"
                >
                  <SafeIcon icon={FiSave} className="h-4 w-4" />
                  <span>{editingId ? 'Update' : 'Create'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors inline-flex items-center space-x-2"
                >
                  <SafeIcon icon={FiX} className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </motion.div>
        </LoadingTransition>
      )}

      {/* Announcements List with Loading */}
      <LoadingTransition isLoading={loading && !showForm} skeleton={<SkeletonTable rows={5} columns={4} />}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {announcements.length===0 ? (
            <div className="p-8 text-center">
              <p className="text-text-primary">No announcements yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-accent">
              {announcements.map((announcement)=> (
                <motion.div
                  key={announcement.id}
                  initial={{opacity: 0,y: 20}}
                  animate={{opacity: 1,y: 0}}
                  className="p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-2xl text-text-primary mb-2">
                        {announcement.title}
                      </h3>
                      <div
                        className="announcement-content text-sm mb-2 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{__html: announcement.content}}
                      />
                      <div className="text-sm text-text-light">
                        {announcement.author && `By ${announcement.author} • `}
                        {announcement.announcement_date
                          ? formatDate(announcement.announcement_date)
                          : formatDate(announcement.created_at)}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={()=> handleEdit(announcement)}
                        className="p-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiEdit} className="h-4 w-4" />
                      </button>
                      <button
                        onClick={()=> handleDelete(announcement.id)}
                        className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </LoadingTransition>
    </div>
  );
};

export default AdminAnnouncements;