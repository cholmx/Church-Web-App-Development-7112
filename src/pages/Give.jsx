import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCreditCard, FiExternalLink, FiShield, FiHeart, FiHome } = FiIcons;

const Give = () => {
  const handleGiveClick = () => {
    window.open('https://onrealm.org/urfellowship/-/form/give/now', '_blank');
  };

  return (
    <div className="min-h-screen bg-accent py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <SafeIcon icon={FiCreditCard} className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-secondary">
              Give
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-secondary"
          >
            Support our church through online giving
          </motion.p>
        </div>

        {/* Give Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="bg-primary text-white p-8 text-center">
            <SafeIcon icon={FiHeart} className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Give with Joy
            </h2>
            <p className="text-primary-light text-lg">
              "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
            </p>
            <p className="text-primary-light text-sm mt-2">
              - 2 Corinthians 9:7
            </p>
          </div>
          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-secondary mb-4">
                Secure Online Giving
              </h3>
              <p className="text-secondary mb-6">
                Your generous giving helps support our church's mission and ministries. Click below to access our secure online giving platform.
              </p>
              <button
                onClick={handleGiveClick}
                className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors inline-flex items-center space-x-3"
              >
                <SafeIcon icon={FiExternalLink} className="h-5 w-5" />
                <span>Give Online Now</span>
              </button>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiShield} className="h-6 w-6 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">
                    Safe & Secure
                  </h4>
                  <p className="text-green-700">
                    Your donation is processed through our secure, encrypted payment system. Your financial information is protected with industry-standard security measures.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-accent p-6 rounded-lg">
                <h4 className="font-semibold text-secondary mb-2">
                  Tax Deductible
                </h4>
                <p className="text-secondary text-sm">
                  All donations are tax-deductible. You will receive a receipt for your records.
                </p>
              </div>
              <div className="bg-accent p-6 rounded-lg">
                <h4 className="font-semibold text-secondary mb-2">
                  Multiple Options
                </h4>
                <p className="text-secondary text-sm">
                  Set up one-time gifts or recurring donations to support our ongoing ministry.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-secondary">
            Questions about giving? Contact our church office for assistance.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Give;