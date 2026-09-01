import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMenu, FiX, FiSearch, FiArrowRight } = FiIcons;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Events', path: '/events' },
    { name: 'Opportunities', path: '/ministries' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`sticky top-0 z-50 bg-ivory transition-all duration-300 ${
          scrolled ? 'backdrop-blur-md bg-ivory/90 border-b border-ink/8 shadow-sm' : 'border-b border-transparent'
        }`}
      >
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src="/logo.png"
                alt="Upper Room Fellowship"
                className="h-9 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center">
                <span className="font-gsans uppercase font-black text-ink text-lg tracking-tight leading-none">
                  Upper Room Fellowship
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`font-caladea italic text-[15px] pb-1 border-b-2 transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-ink border-sun'
                      : 'text-ink/70 border-transparent hover:text-ink hover:border-sun/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/search"
                className="p-2 rounded-full text-ink/70 hover:text-ink hover:bg-ink/5 transition-all duration-200"
                title="Search"
              >
                <SafeIcon icon={FiSearch} className="h-4 w-4" />
              </Link>
              <Link
                to="/give"
                className="group inline-flex items-center gap-2 bg-deep text-ivory font-ui font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_24px_-8px_rgba(11,22,19,0.5)]"
              >
                Give
                <SafeIcon icon={FiArrowRight} className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-1">
              <Link
                to="/search"
                className="p-2 rounded-full text-ink hover:bg-ink/5 transition-all duration-200"
                title="Search"
              >
                <SafeIcon icon={FiSearch} className="h-5 w-5" />
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full text-ink hover:bg-ink/5 transition-all duration-200"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                <SafeIcon icon={isOpen ? FiX : FiMenu} className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-ivory md:hidden flex flex-col"
          >
            <div className="h-20 flex-shrink-0" />
            <div className="flex-1 flex flex-col justify-center px-6 gap-2 overflow-y-auto">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`font-gsans uppercase font-black text-4xl leading-tight tracking-tight block py-2 transition-colors ${
                      isActive(item.path) ? 'text-sun' : 'text-ink'
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="px-6 pb-10 pt-4 flex flex-col gap-3 flex-shrink-0">
              <Link
                to="/give"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-deep text-ivory font-ui font-semibold text-base px-5 py-4 rounded-full"
              >
                Give
              </Link>
              <Link
                to="/search"
                onClick={() => setIsOpen(false)}
                className="w-full text-center border border-ink/15 text-ink font-ui font-semibold text-base px-5 py-4 rounded-full"
              >
                Search
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
