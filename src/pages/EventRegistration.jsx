import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { submitContactForm } from '../lib/contactStorage';
import supabase from '../lib/localStorage';

const { FiCalendar, FiClock, FiMapPin, FiUsers, FiDollarSign, FiCheck, FiHome, FiExternalLink } = FiIcons;

const EventRegistration = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attendees: '1',
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSpotsRemaining = (event) => {
    return event.max_attendees - (event.current_registrations || 0);
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setIsSubmitted(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const registrationData = {
        ...formData,
        subject: `Event Registration: ${selectedEvent.title}`,
        message: `Event Registration Details:
        
Event: ${selectedEvent.title}
Date: ${formatDate(selectedEvent.date)}
Time: ${selectedEvent.time}
Location: ${selectedEvent.location}
Number of Attendees: ${formData.attendees}
Special Requests: ${formData.specialRequests || 'None'}
        
Contact Information:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}`
      };

      const { error } = await submitContactForm(registrationData);
      if (error) throw error;

      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        attendees: '1',
        specialRequests: ''
      });
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('There was an error submitting your registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      attendees: '1',
      specialRequests: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-accent py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary font-inter">Loading events...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-accent py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiCheck} className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-secondary mb-4 font-fraunces">
              Registration Successful!
            </h2>
            <p className="text-secondary mb-6 font-inter">
              Thank you for registering for <strong>{selectedEvent.title}</strong>. We'll send you a confirmation email with more details soon.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleBackToEvents}
                className="w-full bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors font-inter"
              >
                Register for Another Event
              </button>
              <Link
                to="/"
                className="block w-full bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors text-center font-inter"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (selectedEvent) {
    return (
      <div className="min-h-screen bg-accent py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* Back Button */}
          <button
            onClick={handleBackToEvents}
            className="mb-6 text-primary hover:text-primary-dark transition-colors font-inter"
          >
            ← Back to Events
          </button>

          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
          >
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-secondary mb-4 font-fraunces">{selectedEvent.title}</h2>
              <p className="text-secondary mb-4 font-inter">{selectedEvent.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCalendar} className="h-4 w-4 text-primary" />
                  <span className="font-inter">{formatDate(selectedEvent.date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiClock} className="h-4 w-4 text-primary" />
                  <span className="font-inter">{selectedEvent.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiMapPin} className="h-4 w-4 text-primary" />
                  <span className="font-inter">{selectedEvent.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiDollarSign} className="h-4 w-4 text-primary" />
                  <span className="font-inter">{selectedEvent.cost || 'Free'}</span>
                </div>
              </div>

              {selectedEvent.link && (
                <div className="mb-4">
                  <a
                    href={selectedEvent.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors font-inter"
                  >
                    <SafeIcon icon={FiExternalLink} className="h-4 w-4" />
                    <span>More Information</span>
                  </a>
                </div>
              )}

              <div className="bg-accent p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-secondary font-inter">Availability:</span>
                  <span className={`font-semibold font-inter ${getSpotsRemaining(selectedEvent) > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                    {getSpotsRemaining(selectedEvent)} spots remaining
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h3 className="text-xl font-bold text-secondary mb-6 font-fraunces">Register for this Event</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Number of Attendees *
                </label>
                <select
                  name="attendees"
                  value={formData.attendees}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2 font-inter">
                  Special Requests or Dietary Restrictions
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-inter"
                  placeholder="Any special accommodations needed..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-inter"
              >
                {isSubmitting ? 'Submitting Registration...' : 'Register Now'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="flex items-center justify-center space-x-4 mb-6"
          >
            <SafeIcon icon={FiCalendar} className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-secondary font-fraunces">
              Event Registration
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-secondary font-inter"
          >
            Sign up for upcoming events at Upper Room Fellowship
          </motion.p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <SafeIcon icon={FiCalendar} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-secondary font-inter">No events available</p>
              <p className="text-secondary-light font-inter">Check back soon for upcoming events!</p>
            </div>
          ) : (
            events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-secondary font-fraunces">{event.title}</h3>
                  <p className="text-secondary mb-4 text-sm font-inter">{event.description}</p>
                  
                  <div className="space-y-2 text-sm text-secondary-light mb-4">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCalendar} className="h-4 w-4 text-primary" />
                      <span className="font-inter">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiClock} className="h-4 w-4 text-primary" />
                      <span className="font-inter">{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiMapPin} className="h-4 w-4 text-primary" />
                      <span className="font-inter">{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiDollarSign} className="h-4 w-4 text-primary" />
                      <span className="font-inter">{event.cost || 'Free'}</span>
                    </div>
                    {event.link && (
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiExternalLink} className="h-4 w-4 text-primary" />
                        <a 
                          href={event.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-dark font-inter underline"
                        >
                          More Info
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiUsers} className="h-4 w-4 text-primary" />
                      <span className="text-sm text-secondary-light font-inter">
                        {getSpotsRemaining(event)} spots left
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-inter ${
                      getSpotsRemaining(event) > 10 
                        ? 'bg-green-100 text-green-800' 
                        : getSpotsRemaining(event) > 0 
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {getSpotsRemaining(event) > 0 ? 'Available' : 'Full'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleEventSelect(event)}
                    disabled={getSpotsRemaining(event) === 0}
                    className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                  >
                    {getSpotsRemaining(event) > 0 ? 'Register Now' : 'Event Full'}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;