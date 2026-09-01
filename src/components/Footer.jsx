import React from 'react';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMapPin, FiPhone, FiMail, FiFacebook, FiInstagram, FiYoutube, FiSettings } = FiIcons;

const Footer = () => {
  return (
    <footer className="bg-deep text-ivory">
      <div className="max-w-[1145px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Church Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-5">
              <img
                src="/logo.png"
                alt="Upper Room Fellowship"
                className="h-8 w-auto brightness-0 invert"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center">
                <span className="font-gsans uppercase font-black text-lg tracking-tight leading-none">
                  Upper Room Fellowship
                </span>
              </div>
            </div>
            <p className="font-caladea italic text-ivory/70 mb-5 max-w-sm">
              A place where faith grows, community thrives, and lives are transformed through God's love.
            </p>
            <div className="space-y-2.5 font-ui text-sm">
              <div className="flex items-center space-x-2.5">
                <SafeIcon icon={FiMapPin} className="h-4 w-4 text-sun flex-shrink-0" />
                <span className="text-ivory/70">123 Faith Street, Hope City, HC 12345</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <SafeIcon icon={FiPhone} className="h-4 w-4 text-sun flex-shrink-0" />
                <span className="text-ivory/70">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <SafeIcon icon={FiMail} className="h-4 w-4 text-sun flex-shrink-0" />
                <span className="text-ivory/70">info@upperroomfellowship.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-gsans uppercase font-black text-sm tracking-wide mb-4">Quick Links</h3>
            <ul className="space-y-2.5 font-caladea italic">
              <li><Link to="/about" className="text-ivory/70 hover:text-sun transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-ivory/70 hover:text-sun transition-colors">Services</Link></li>
              <li><Link to="/events" className="text-ivory/70 hover:text-sun transition-colors">Events</Link></li>
              <li><Link to="/ministries" className="text-ivory/70 hover:text-sun transition-colors">Opportunities</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-gsans uppercase font-black text-sm tracking-wide mb-4">Connect</h3>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 rounded-full bg-ivory/10 flex items-center justify-center text-ivory/80 hover:bg-sun hover:text-ink transition-all duration-200">
                <SafeIcon icon={FiFacebook} className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-ivory/10 flex items-center justify-center text-ivory/80 hover:bg-sun hover:text-ink transition-all duration-200">
                <SafeIcon icon={FiInstagram} className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-ivory/10 flex items-center justify-center text-ivory/80 hover:bg-sun hover:text-ink transition-all duration-200">
                <SafeIcon icon={FiYoutube} className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-ivory/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center">
          <p className="font-ui text-sm text-ivory/50">
            © 2024 Upper Room Fellowship. All rights reserved.
          </p>
          <Link to="/admin" className="inline-flex items-center space-x-1.5 font-caladea italic text-ivory/30 hover:text-ivory/60 transition-colors text-xs">
            <SafeIcon icon={FiSettings} className="h-3 w-3" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
