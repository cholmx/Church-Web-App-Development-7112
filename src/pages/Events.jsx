import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCalendar, FiClock, FiMapPin, FiUsers, FiFilter, FiHome } = FiIcons;

const Events = () => {
  const [filter, setFilter] = useState('all');

  const events = [
    {
      id: 1,
      title: 'Christmas Eve Candlelight Service',
      date: '2024-12-24',
      time: '6:00 PM',
      location: 'Main Sanctuary',
      category: 'worship',
      description: 'Join us for a beautiful candlelight service celebrating the birth of Jesus Christ.',
      image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=250&fit=crop'
    },
    {
      id: 2,
      title: 'New Year Prayer & Fasting',
      date: '2025-01-01',
      time: '12:00 AM',
      location: 'Prayer Room',
      category: 'prayer',
      description: 'Start the new year with prayer and seeking God\'s guidance for the year ahead.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      title: 'Youth Winter Retreat',
      date: '2025-01-15',
      time: '9:00 AM',
      location: 'Mountain View Camp',
      category: 'youth',
      description: 'A weekend retreat for our youth to grow in faith and build friendships.',
      image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=250&fit=crop'
    },
    {
      id: 4,
      title: 'Marriage Enrichment Workshop',
      date: '2025-01-20',
      time: '7:00 PM',
      location: 'Fellowship Hall',
      category: 'family',
      description: 'Strengthen your marriage with biblical principles and practical tools.',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=250&fit=crop'
    },
    {
      id: 5,
      title: 'Community Food Drive',
      date: '2025-02-01',
      time: '10:00 AM',
      location: 'Church Parking Lot',
      category: 'outreach',
      description: 'Help us collect food donations for families in need in our community.',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=250&fit=crop'
    },
    {
      id: 6,
      title: 'Women\'s Bible Study',
      date: '2025-02-05',
      time: '10:00 AM',
      location: 'Conference Room',
      category: 'study',
      description: 'Join other women for fellowship and Bible study every Tuesday morning.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop'
    }
  ];

  const categories = [
    { key: 'all', label: 'All Events' },
    { key: 'worship', label: 'Worship' },
    { key: 'prayer', label: 'Prayer' },
    { key: 'youth', label: 'Youth' },
    { key: 'family', label: 'Family' },
    { key: 'outreach', label: 'Outreach' },
    { key: 'study', label: 'Bible Study' }
  ];

  const filteredEvents = filter === 'all' ? events : events.filter(event => event.category === filter);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      worship: 'bg-primary text-white',
      prayer: 'bg-secondary text-white',
      youth: 'bg-green-500 text-white',
      family: 'bg-pink-500 text-white',
      outreach: 'bg-orange-500 text-white',
      study: 'bg-purple-500 text-white'
    };
    return colors[category] || 'bg-gray-500 text-white';
  };

  return (
    <div className="min-h-screen bg-accent">
      {/* Home Link */}
      <div className="pt-6 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
        >
          <SafeIcon icon={FiHome} className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 font-fraunces"
          >
            Upcoming Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-primary-light font-inter"
          >
            Stay connected and grow together through our church events and activities
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b border-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center space-x-2 text-secondary">
              <SafeIcon icon={FiFilter} className="h-5 w-5" />
              <span className="font-medium font-inter">Filter by:</span>
            </div>
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setFilter(category.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors font-inter ${
                  filter === category.key
                    ? 'bg-primary text-white'
                    : 'bg-accent text-secondary hover:bg-accent-dark'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
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
                  <p className="text-secondary mb-4 font-inter">{event.description}</p>
                  <div className="space-y-2 text-sm text-secondary-light">
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
                  </div>
                  <div className="mt-4 pt-4 border-t border-accent">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(event.category)} font-inter`}>
                      {categories.find(cat => cat.key === event.category)?.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-secondary text-lg font-inter">No events found for the selected category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-fraunces">Stay Connected</h2>
          <p className="text-xl mb-8 text-primary-light font-inter">
            Don't miss out on upcoming events and opportunities to grow in faith and community.
          </p>
          <div className="space-x-4">
            <button className="bg-white text-secondary px-8 py-3 rounded-full font-semibold hover:bg-accent transition-colors font-inter">
              Subscribe to Updates
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-secondary transition-colors font-inter">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;