import React from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const {FiUsers, FiHeart, FiBookOpen, FiMusic, FiTarget, FiGift, FiHome} = FiIcons;

const Ministries = () => {
  const ministries = [
    {
      icon: FiUsers,
      title: 'Children\'s Ministry',
      description: 'Nurturing young hearts to know and love Jesus through age-appropriate teaching, activities, and care.',
      features: ['Sunday School', 'Vacation Bible School', 'Children\'s Choir', 'Family Events'],
      ageGroup: 'Ages 0-12',
      color: 'primary'
    },
    {
      icon: FiTarget,
      title: 'Youth Ministry',
      description: 'Empowering teenagers to grow in faith, build friendships, and discover their purpose in God.',
      features: ['Youth Group', 'Summer Camps', 'Mission Trips', 'Leadership Training'],
      ageGroup: 'Ages 13-18',
      color: 'secondary'
    },
    {
      icon: FiHeart,
      title: 'Women\'s Ministry',
      description: 'Creating opportunities for women to connect, grow spiritually, and support one another.',
      features: ['Bible Studies', 'Retreats', 'Mentorship', 'Service Projects'],
      ageGroup: 'All Ages',
      color: 'pink'
    },
    {
      icon: FiBookOpen,
      title: 'Men\'s Ministry',
      description: 'Challenging men to be godly leaders in their homes, workplaces, and communities.',
      features: ['Men\'s Groups', 'Accountability', 'Service Projects', 'Leadership Development'],
      ageGroup: 'All Ages',
      color: 'orange'
    },
    {
      icon: FiMusic,
      title: 'Worship Ministry',
      description: 'Leading our congregation in meaningful worship through music, arts, and creative expression.',
      features: ['Worship Team', 'Choir', 'Sound & Media', 'Creative Arts'],
      ageGroup: 'All Ages',
      color: 'purple'
    },
    {
      icon: FiGift,
      title: 'Outreach Ministry',
      description: 'Serving our community and spreading God\'s love through practical acts of service and evangelism.',
      features: ['Food Pantry', 'Community Events', 'Mission Support', 'Evangelism Training'],
      ageGroup: 'All Ages',
      color: 'green'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary text-white',
      secondary: 'bg-secondary text-white',
      pink: 'bg-pink-500 text-white',
      orange: 'bg-orange-500 text-white',
      purple: 'bg-purple-500 text-white',
      green: 'bg-green-500 text-white'
    };
    return colors[color] || colors.primary;
  };

  const getIconColor = (color) => {
    const colors = {
      primary: 'text-primary',
      secondary: 'text-secondary',
      pink: 'text-pink-500',
      orange: 'text-orange-500',
      purple: 'text-purple-500',
      green: 'text-green-500'
    };
    return colors[color] || colors.primary;
  };

  const getBadgeColor = (color) => {
    const colors = {
      primary: 'bg-primary text-white',
      secondary: 'bg-secondary text-white',
      pink: 'bg-pink-100 text-pink-800',
      orange: 'bg-orange-100 text-orange-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800'
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="min-h-screen bg-accent relative">
      {/* Back to Home Button - Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105" style={{backgroundColor: '#83A682'}} title="Back to Home">
          <SafeIcon icon={FiHome} className="h-5 w-5 text-white" />
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}
            className="text-4xl md:text-6xl font-bold mb-6 font-inter"
          >
            Our Ministries
          </motion.h1>
          <motion.p
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, delay: 0.2}}
            className="text-xl text-primary-light page-subtitle"
          >
            Discover ways to grow, serve, and connect through our various ministry opportunities
          </motion.p>
        </div>
      </section>

      {/* Ministries Grid */}
      <section className="py-16 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministries.map((ministry, index) => (
              <motion.div
                key={index}
                initial={{opacity: 0, y: 30}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: index * 0.1}}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <SafeIcon icon={ministry.icon} className={`h-12 w-12 ${getIconColor(ministry.color)}`} />
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getBadgeColor(ministry.color)} font-inter`}>
                      {ministry.ageGroup}
                    </span>
                  </div>
                  <h3 className="text-xl mb-3 text-secondary font-fraunces">{ministry.title}</h3>
                  <p className="text-secondary mb-4 font-inter">{ministry.description}</p>
                  <div>
                    <h4 className="text-secondary mb-2 font-fraunces">What We Offer:</h4>
                    <ul className="space-y-1">
                      {ministry.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2 text-secondary">
                          <div className={`w-2 h-2 rounded-full ${getIconColor(ministry.color).replace('text-', 'bg-')}`}></div>
                          <span className="text-sm font-inter">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-accent">
                    <button className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${getColorClasses(ministry.color)} hover:opacity-90 font-inter`}>
                      Learn More
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-fraunces">Ready to Get Involved?</h2>
          <p className="text-xl text-secondary mb-8 page-subtitle">
            Whether you're new to faith or have been walking with Jesus for years, there's a place for you to serve and grow.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiUsers} className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg mb-2 font-fraunces">Connect</h3>
              <p className="text-secondary font-inter">Find your community and build meaningful relationships</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiBookOpen} className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg mb-2 font-fraunces">Grow</h3>
              <p className="text-secondary font-inter">Deepen your faith through study and discipleship</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiHeart} className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg mb-2 font-fraunces">Serve</h3>
              <p className="text-secondary font-inter">Use your gifts to make a difference in others' lives</p>
            </div>
          </div>
          <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors font-inter">
            Contact Us to Get Started
          </button>
        </div>
      </section>

      {/* Ministry Leadership */}
      <section className="py-16 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 font-fraunces">Ministry Leadership</h2>
            <p className="text-xl text-secondary page-subtitle">Meet some of the dedicated leaders serving our church family</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Jennifer Adams',
                role: 'Children\'s Ministry Director',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face'
              },
              {
                name: 'Michael Davis',
                role: 'Youth Pastor',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
              },
              {
                name: 'Sarah Johnson',
                role: 'Worship Director',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face'
              }
            ].map((leader, index) => (
              <motion.div
                key={index}
                initial={{opacity: 0, y: 30}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: index * 0.1}}
                className="bg-white rounded-lg shadow-md overflow-hidden text-center"
              >
                <img src={leader.image} alt={leader.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl mb-1 text-secondary font-fraunces">{leader.name}</h3>
                  <p className="text-primary font-medium font-inter">{leader.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Ministries;