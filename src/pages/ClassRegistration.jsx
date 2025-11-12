import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import StandardButton from '../components/StandardButton';

const {FiBookOpen,FiHome,FiExternalLink}=FiIcons;

const ClassRegistration=()=> {
  const [classes,setClasses]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=> {
    fetchClasses();
  },[]);

  const fetchClasses=async ()=> {
    try {
      const {data,error}=await supabase
        .from('classes_portal123')
        .select('*')
        .order('created_at',{ascending: false});

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:',error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-accent py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-primary font-inter">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent py-12 relative">
      {/* Back to Home Button - Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105" style={{backgroundColor: '#83A682'}} title="Back to Home">
          <SafeIcon icon={FiHome} className="h-5 w-5 text-white" />
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{opacity: 0,y: 30}}
            animate={{opacity: 1,y: 0}}
            transition={{duration: 0.8}}
            className="flex items-center justify-center space-x-4 mb-1"
          >
            <SafeIcon icon={FiBookOpen} className="h-8 w-8 text-primary" />
            <Link to="/" className="hover:text-primary transition-colors">
              <h1 className="text-3xl md:text-4xl">
                Classes
              </h1>
            </Link>
          </motion.div>
          <motion.p
            initial={{opacity: 0,y: 30}}
            animate={{opacity: 1,y: 0}}
            transition={{duration: 0.8,delay: 0.2}}
            className="text-base page-subtitle"
          >
            Available church classes and programs
          </motion.p>
        </div>

        {/* Classes List */}
        {classes.length===0 ? (
          <motion.div
            initial={{opacity: 0,y: 30}}
            animate={{opacity: 1,y: 0}}
            className="bg-white rounded-lg shadow-md p-12 text-center"
          >
            <SafeIcon icon={FiBookOpen} className="h-16 w-16 text-text-light mx-auto mb-4" />
            <h2 className="text-2xl mb-2">
              No Classes Available
            </h2>
            <p className="text-text-light">
              Check back soon for upcoming classes!
            </p>
          </motion.div>
        ) : (
          <div className={classes.length===1 ? "max-w-2xl mx-auto" : "grid grid-cols-1 md:grid-cols-2 gap-8"}>
            {classes.map((classItem,index)=> (
              <motion.div
                key={classItem.id}
                initial={{opacity: 0,y: 30}}
                animate={{opacity: 1,y: 0}}
                transition={{duration: 0.5,delay: index * 0.1}}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-text-primary mb-4">
                  {classItem.title}
                </h3>
                <div
                  className="text-text-primary mb-6 prose prose-sm max-w-none rendered-content"
                  dangerouslySetInnerHTML={{__html: classItem.details}}
                />
                {classItem.link && (
                  <div className="flex justify-start">
                    <StandardButton
                      onClick={() => window.open(classItem.link, '_blank', 'noopener,noreferrer')}
                      icon={FiExternalLink}
                    >
                      Register Here
                    </StandardButton>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassRegistration;