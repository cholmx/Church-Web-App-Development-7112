import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { submitContactForm } from '../lib/contactStorage';

const { FiMail, FiCheck, FiUser, FiMessageSquare, FiPhone, FiHome } = FiIcons;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await submitContactForm(formData);
      if (error) throw error;

      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your message. Please try again.');
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
            Message Sent!
          </h2>
          <p className="text-secondary mb-6">
            Thank you for your message. We'll get back to you as soon as possible.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Send Another Message
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
            className="flex items-center justify-center space-x-4 mb-3"
          >
            <SafeIcon icon={FiMail} className="h-8 w-8 text-primary" />
            <Link to="/" className="hover:text-primary transition-colors">
              <h1 className="text-3xl md:text-4xl font-bold text-secondary">
                Contact Us
              </h1>
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-secondary"
          >
            Get in touch with our church team
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
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Full Name *
              </label>
              <div className="relative">
                <SafeIcon icon={FiUser} className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="pl-10 w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Email Address *
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

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Phone Number
              </label>
              <div className="relative">
                <SafeIcon icon={FiPhone} className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Subject *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="prayer">Prayer Request</option>
                <option value="ministry">Ministry Information</option>
                <option value="events">Events & Activities</option>
                <option value="pastoral">Pastoral Care</option>
                <option value="volunteer">Volunteer Opportunities</option>
                <option value="technical">Technical Support</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Message *
              </label>
              <div className="relative">
                <SafeIcon icon={FiMessageSquare} className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="pl-10 w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="How can we help you?"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;