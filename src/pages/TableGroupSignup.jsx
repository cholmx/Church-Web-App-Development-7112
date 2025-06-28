import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { submitTableGroupSignup } from '../lib/contactStorage';

const { FiUsers, FiCheck, FiUser, FiMail, FiHash, FiHome } = FiIcons;

const TableGroupSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    partySize: '',
    unavailableDays: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      unavailableDays: prev.unavailableDays.includes(day)
        ? prev.unavailableDays.filter(d => d !== day)
        : [...prev.unavailableDays, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await submitTableGroupSignup({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        party_size: parseInt(formData.partySize),
        unavailable_days: formData.unavailableDays
      });

      if (error) throw error;

      setIsSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        partySize: '',
        unavailableDays: []
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-accent py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiCheck} className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-secondary mb-4">
            Thank You!
          </h2>
          <p className="text-secondary mb-6">
            Your Table Group sign-up has been submitted successfully. We'll be in touch soon to help you find the perfect group!
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Submit Another
            </button>
            <Link
              to="/"
              className="block w-full bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors text-center"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Home Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
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
            <SafeIcon icon={FiUsers} className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-secondary">
              Table Group Sign-Up
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-secondary"
          >
            Complete this quick form, and we'll be in touch soon.
          </motion.p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <SafeIcon icon={FiUser} className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="pl-10 w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="First"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <SafeIcon icon={FiUser} className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="pl-10 w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Last"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Email *
              </label>
              <div className="relative">
                <SafeIcon icon={FiMail} className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="pl-10 w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Party Size */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Number in party *
              </label>
              <div className="relative">
                <SafeIcon icon={FiHash} className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="partySize"
                  value={formData.partySize}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="20"
                  className="pl-10 w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="1"
                />
              </div>
            </div>

            {/* Unavailable Days */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Days you are unable to meet for a Table Group *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {days.map(day => (
                  <label key={day} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.unavailableDays.includes(day)}
                      onChange={() => handleDayToggle(day)}
                      className="w-4 h-4 text-primary focus:ring-primary border-accent-dark rounded"
                    />
                    <span className="text-sm text-secondary">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Sign-Up'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default TableGroupSignup;