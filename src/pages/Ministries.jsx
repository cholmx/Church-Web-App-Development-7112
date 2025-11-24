import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const {FiUsers, FiHeart, FiBookOpen, FiMusic, FiTarget, FiGift, FiHome} = FiIcons;

const Ministries = () => {
  const [ministries,setMinistries]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=> {
    fetchMinistries();
  },[]);

  const fetchMinistries=async ()=> {
    try {
      const {data: ministriesData,error: ministriesError}=await supabase
        .from('ministries_portal123')
        .select('*')
        .eq('is_active',true)
        .order('display_order',{ascending: true});

      if (ministriesError) throw ministriesError;

      const ministriesWithFeatures=await Promise.all(
        ministriesData.map(async (ministry)=> {
          const {data: features}=await supabase
            .from('ministry_features_portal123')
            .select('*')
            .eq('ministry_id',ministry.id)
            .order('display_order',{ascending: true});

          return {
            ...ministry,
            features: features || []
          };
        })
      );

      setMinistries(ministriesWithFeatures);
    } catch (error) {
      console.error('Error fetching ministries:',error);
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = () => {
    return 'bg-primary text-white';
  };

  const getIconColor = () => {
    return 'text-primary';
  };

  const getBadgeColor = () => {
    return 'bg-primary/10 text-primary';
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
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_,i)=> (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 bg-accent rounded-full"></div>
                      <div className="h-6 w-20 bg-accent rounded-full"></div>
                    </div>
                    <div className="h-6 bg-accent rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-accent rounded w-full mb-2"></div>
                    <div className="h-4 bg-accent rounded w-5/6 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-accent rounded w-full"></div>
                      <div className="h-3 bg-accent rounded w-4/5"></div>
                      <div className="h-3 bg-accent rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : ministries.length === 0 ? (
            <div className="text-center py-12">
              <SafeIcon icon={FiHeart} className="h-16 w-16 text-text-light mx-auto mb-4" />
              <h3 className="text-xl text-text-primary mb-2">No Ministries Available</h3>
              <p className="text-text-primary">Check back soon for information about our ministries.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ministries.map((ministry, index) => (
                <motion.div
                  key={ministry.id}
                  initial={{opacity: 0, y: 30}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.5, delay: index * 0.1}}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <SafeIcon icon={FiHeart} className={`h-12 w-12 ${getIconColor()}`} />
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getBadgeColor()}`}>
                        {ministry.age_group}
                      </span>
                    </div>
                    <h3 className="text-xl mb-3 text-text-primary font-bold">{ministry.title}</h3>
                    <p className="text-text-primary mb-4">{ministry.description}</p>
                    {ministry.features.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-text-primary mb-2 font-semibold">What We Offer:</h4>
                        <ul className="space-y-1">
                          {ministry.features.map((feature) => (
                            <li key={feature.id} className="flex items-center space-x-2 text-text-primary">
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                              <span className="text-sm">{feature.feature_text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(ministry.leader_name || ministry.leader_role) && (
                      <div className="mt-4 pt-4 border-t border-accent">
                        <p className="text-sm text-text-primary">
                          <span className="font-semibold">Leader:</span> {ministry.leader_name}
                          {ministry.leader_role && (
                            <span className="block text-text-light">{ministry.leader_role}</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 font-fraunces">Ready to Get Involved?</h2>
          <p className="text-xl text-text-primary mb-8 page-subtitle">
            Whether you're new to faith or have been walking with Jesus for years, there's a place for you to serve and grow.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiUsers} className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg mb-2 font-fraunces">Connect</h3>
              <p className="text-text-primary font-inter">Find your community and build meaningful relationships</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiBookOpen} className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg mb-2 font-fraunces">Grow</h3>
              <p className="text-text-primary font-inter">Deepen your faith through study and discipleship</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiHeart} className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg mb-2 font-fraunces">Serve</h3>
              <p className="text-text-primary font-inter">Use your gifts to make a difference in others' lives</p>
            </div>
          </div>
          <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors font-inter">
            Contact Us to Get Started
          </button>
        </div>
      </section>

    </div>
  );
};

export default Ministries;