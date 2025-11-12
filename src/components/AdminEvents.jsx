import React,{useState,useEffect} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import RichTextEditor from './RichTextEditor';
import {SkeletonTable,SkeletonForm,LoadingTransition} from './LoadingSkeletons';
import supabase from '../lib/supabase';

const {FiPlus,FiEdit,FiTrash2,FiSave,FiX,FiExternalLink}=FiIcons;

const AdminEvents=()=> {
  const [events,setEvents]=useState([]);
  const [loading,setLoading]=useState(true);
  const [editingId,setEditingId]=useState(null);
  const [showForm,setShowForm]=useState(false);
  const [formData,setFormData]=useState({title: '',details: '',link: ''});

  useEffect(()=> {
    fetchEvents();
  },[]);

  const fetchEvents=async ()=> {
    try {
      const {data,error}=await supabase
        .from('events_portal123')
        .select('*')
        .order('created_at',{ascending: false});
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:',error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit=async (e)=> {
    e.preventDefault();
    setLoading(true);
    try {
      const eventData={
        title: formData.title,
        details: formData.details,
        link: formData.link
      };

      if (editingId) {
        const {error}=await supabase
          .from('events_portal123')
          .update(eventData)
          .eq('id',editingId);
        if (error) throw error;
      } else {
        const {error}=await supabase
          .from('events_portal123')
          .insert([eventData]);
        if (error) throw error;
      }
      handleCancel();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:',error);
      alert('Error saving event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit=(event)=> {
    setFormData({
      title: event.title,
      details: event.details,
      link: event.link || ''
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete=async (id)=> {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const {error}=await supabase
        .from('events_portal123')
        .delete()
        .eq('id',id);
      if (error) throw error;
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:',error);
      alert('Error deleting event. Please try again.');
    }
  };

  const handleCancel=()=> {
    setFormData({title: '',details: '',link: ''});
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-text-primary">Manage Events</h2>
        <button
          onClick={()=> setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>New Event</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <LoadingTransition isLoading={loading && editingId} skeleton={<SkeletonForm />}>
          <motion.div
            initial={{opacity: 0,y: 20}}
            animate={{opacity: 1,y: 0}}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Event Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e)=> setFormData({...formData,title: e.target.value})}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Event title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Event Details *</label>
                <RichTextEditor
                  value={formData.details}
                  onChange={(e)=> setFormData({...formData,details: e.target.value})}
                  placeholder="Enter event description,date,time,location,cost,etc..."
                  rows={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">External Link</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e)=> setFormData({...formData,link: e.target.value})}
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com/event-details"
                />
                <p className="text-sm text-text-light mt-1">
                  Optional: Add a link to external registration,more info,or related content
                </p>
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

      {/* Events List */}
      <LoadingTransition isLoading={loading && !showForm} skeleton={<SkeletonTable rows={3} columns={2} />}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {events.length===0 ? (
            <div className="p-8 text-center">
              <p className="text-text-primary">No events yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-accent">
              {events.map((event)=> (
                <div key={event.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg text-text-primary mb-2">{event.title}</h3>
                      <div
                        className="text-text-primary text-sm mb-3 prose prose-sm max-w-none rendered-content"
                        dangerouslySetInnerHTML={{__html: event.details}}
                      />
                      {event.link && (
                        <div className="mb-3">
                          <a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-primary hover:text-primary-dark text-sm underline"
                          >
                            <SafeIcon icon={FiExternalLink} className="h-3 w-3" />
                            <span>External Link</span>
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={()=> handleEdit(event)}
                        className="p-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiEdit} className="h-4 w-4" />
                      </button>
                      <button
                        onClick={()=> handleDelete(event.id)}
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
      </LoadingTransition>
    </div>
  );
};

export default AdminEvents;