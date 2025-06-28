import React from 'react';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMapPin, FiPhone, FiMail, FiFacebook, FiInstagram, FiYoutube } = FiIcons;

const Footer = () => {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm font-fraunces">GC</span>
              </div>
              <span className="text-xl font-bold font-fraunces">Grace Community Church</span>
            </div>
            <p className="text-gray-300 mb-4 font-inter">
              A place where faith grows, community thrives, and lives are transformed through God's love.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiMapPin} className="h-4 w-4 text-primary" />
                <span className="text-gray-300 font-inter">123 Faith Street, Hope City, HC 12345</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiPhone} className="h-4 w-4 text-primary" />
                <span className="text-gray-300 font-inter">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiMail} className="h-4 w-4 text-primary" />
                <span className="text-gray-300 font-inter">info@gracecommunity.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-fraunces">Quick Links</h3>
            <ul className="space-y-2 font-inter">
              <li><Link to="/about" className="text-gray-300 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/events" className="text-gray-300 hover:text-primary transition-colors">Events</Link></li>
              <li><Link to="/ministries" className="text-gray-300 hover:text-primary transition-colors">Ministries</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-fraunces">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <SafeIcon icon={FiFacebook} className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <SafeIcon icon={FiInstagram} className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <SafeIcon icon={FiYoutube} className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 font-inter">
            © 2024 Grace Community Church. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;