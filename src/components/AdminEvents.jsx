import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/localStorage';

const { FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiCalendar, FiClock, FiMapPin, FiDollarSign, FiUsers, FiExternalLink } = FiIcons;

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    cost: '',
    maxAttendees: '',
    image: '',
    link: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events_portal123')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        cost: formData.cost,
        max_attendees: parseInt(formData.maxAttendees),
        current_registrations: 0,
        image: formData.image || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=250&fit=crop',
        link: formData.link
      };

      if (editingId) {
        const { error } = await supabase
          .from('events_portal123')
          .update(eventData)
          .eq('id', editingId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events_portal123')
          .insert([eventData]);
        
        if (error) throw error;
      }

      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        cost: '',
        maxAttendees: '',
        image: '',
        link: ''
      });
      setEditingId(null);
      setShowForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      cost: event.cost,
      maxAttendees: event.max_attendees.toString(),
      image: event.image || '',
      link: event.link || ''
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events_portal123')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      cost: '',
      maxAttendees: '',
      image: '',
      link: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSpotsRemaining = (event) => {
    return event.max_attendees - (event.current_registrations || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-secondary font-fraunces">
          Manage Events
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors inline-flex items-center space-x-2 font-inter"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>New Event</span>
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
            <div>
              <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                Event Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                placeholder="Event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-inter"
                placeholder="Event description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Time *
                </label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                  placeholder="e.g., 7:00 PM"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                  placeholder="Event location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Cost
                </label>
                <input
                  type="text"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                  placeholder="e.g., Free, $25, $50 per person"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Max Attendees *
                </label>
                <input
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                  required
                  min="1"
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                  placeholder="Maximum number of attendees"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                External Link
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                placeholder="https://example.com/event-details"
              />
              <p className="text-sm text-secondary-light mt-1 font-inter">
                Optional: Add a link to external registration, more info, or related content
              </p>
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

      {/* Events List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-secondary font-inter">Loading...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-secondary font-inter">No events yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-accent">
            {events.map((event) => (
              <div key={event.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-secondary font-fraunces mb-2">
                      {event.title}
                    </h3>
                    <p className="text-secondary text-sm mb-3 line-clamp-2 font-inter">
                      {event.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-secondary-light mb-3">
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiCalendar} className="h-3 w-3 text-primary" />
                        <span className="font-inter">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiClock} className="h-3 w-3 text-primary" />
                        <span className="font-inter">{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiMapPin} className="h-3 w-3 text-primary" />
                        <span className="font-inter">{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiDollarSign} className="h-3 w-3 text-primary" />
                        <span className="font-inter">{event.cost || 'Free'}</span>
                      </div>
                    </div>

                    {event.link && (
                      <div className="mb-3">
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiExternalLink} className="h-3 w-3 text-primary" />
                          <a 
                            href={event.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary-dark text-sm font-inter underline"
                          >
                            External Link
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiUsers} className="h-3 w-3 text-primary" />
                        <span className="text-secondary-light font-inter">
                          {getSpotsRemaining(event)} of {event.max_attendees} spots available
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-inter ${
                        getSpotsRemaining(event) > 10 
                          ? 'bg-green-100 text-green-800' 
                          : getSpotsRemaining(event) > 0 
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {getSpotsRemaining(event) > 0 ? 'Available' : 'Full'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(event)}
                      className="p-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiEdit} className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
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

export default AdminEvents;