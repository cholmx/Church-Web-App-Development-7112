import React,{useState,useEffect} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import RichTextEditor from './RichTextEditor';
import {SkeletonTable,SkeletonForm,LoadingTransition} from './LoadingSkeletons';
import supabase from '../lib/supabase';
import { toTitleCase } from '../utils/textFormat';

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
        title: toTitleCase(formData.title),
        content: formData.content,
        author: toTitleCase(formData.author),
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
      const errorMessage = error?.message || 'Unknown error occurred';
      alert(`Error saving announcement: ${errorMessage}\n\nPlease check the console for more details.`);
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
          className="admin-btn-primary"
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
            className="admin-card"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e)=> setFormData({...formData,title: e.target.value})}
                    required
                    className="admin-input"
                    placeholder="Announcement title"
                  />
                </div>
                <div>
                  <label className="admin-label">Date *</label>
                  <input
                    type="date"
                    value={formData.announcement_date}
                    onChange={(e)=> setFormData({...formData,announcement_date: e.target.value})}
                    required
                    className="admin-input"
                  />
                </div>
              </div>
              <div>
                <label className="admin-label">Content *</label>
                <RichTextEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Paste your formatted announcement here... Bold text,line breaks,and lists will be preserved automatically!"
                  rows={12}
                />
              </div>
              <div>
                <label className="admin-label">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e)=> setFormData({...formData,author: e.target.value})}
                  className="admin-input"
                  placeholder="Author name (optional)"
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" disabled={loading} className="admin-btn-primary">
                  <SafeIcon icon={FiSave} className="h-4 w-4" />
                  <span>{editingId ? 'Update' : 'Create'}</span>
                </button>
                <button type="button" onClick={handleCancel} className="admin-btn-secondary">
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
        <div className="bg-white rounded-2xl shadow-modern overflow-hidden">
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
                    <div className="flex space-x-1 ml-4">
                      <button onClick={()=> handleEdit(announcement)} className="admin-btn-edit">
                        <SafeIcon icon={FiEdit} className="h-4 w-4" />
                      </button>
                      <button onClick={()=> handleDelete(announcement.id)} className="admin-btn-danger">
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