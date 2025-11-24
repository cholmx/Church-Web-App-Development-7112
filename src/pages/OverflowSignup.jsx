import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {sendEmail} from '../lib/emailService';
import StandardButton from '../components/StandardButton';

const {FiCalendar,FiCheck,FiUser,FiMail,FiPhone,FiHome,FiUsers}=FiIcons;

const OverflowSignup=()=> {
  const [formData,setFormData]=useState({
    name: '',
    phone: '',
    email: '',
    partySize: '1',
    selectedSundays: []
  });
  const [isSubmitting,setIsSubmitting]=useState(false);
  const [isSubmitted,setIsSubmitted]=useState(false);

  const sundays=[
    '1st Sunday of each month',
    '2nd Sunday of each month',
    '3rd Sunday of each month',
    '4th Sunday of each month',
    '5th Sunday (when applicable)'
  ];

  const handleInputChange=(e)=> {
    const {name,value}=e.target;
    setFormData(prev=> ({...prev,[name]: value}));
  };

  const handleSundayToggle=(sunday)=> {
    setFormData(prev=> ({
      ...prev,
      selectedSundays: prev.selectedSundays.includes(sunday)
        ? prev.selectedSundays.filter(s=> s !==sunday)
        : [...prev.selectedSundays,sunday]
    }));
  };

  const handleSubmit=async (e)=> {
    e.preventDefault();

    if (formData.selectedSundays.length===0) {
      alert('Please select at least one Sunday commitment.');
      return;
    }

    setIsSubmitting(true);
    try {
      const {success,error}=await sendEmail({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        party_size: formData.partySize,
        selected_sundays: formData.selectedSundays
      },'overflow');

      if (!success) throw new Error(error);

      setIsSubmitted(true);
      setFormData({name: '',phone: '',email: '',partySize: '1',selectedSundays: []});
    } catch (error) {
      console.error('Error submitting form:',error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-accent py-12 flex items-center justify-center relative">
        <div className="fixed top-6 right-6 z-50">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105" style={{backgroundColor: '#83A682'}} title="Back to Home">
            <SafeIcon icon={FiHome} className="h-5 w-5 text-white" />
          </Link>
        </div>
        <motion.div
          initial={{opacity: 0,scale: 0.9}}
          animate={{opacity: 1,scale: 1}}
          transition={{duration: 0.5}}
          className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiCheck} className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Thank You!
          </h2>
          <p className="text-text-primary mb-6">
            Your overflow signup has been submitted successfully. We'll be in touch soon!
          </p>
          <div className="space-y-3">
            <StandardButton
              onClick={()=> setIsSubmitted(false)}
              icon={FiCalendar}
              fullWidth
            >
              Submit Another
            </StandardButton>
            <Link to="/">
              <StandardButton
                icon={FiHome}
                fullWidth
              >
                Back to Home
              </StandardButton>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent py-12 relative">
      <div className="fixed top-6 right-6 z-50">
        <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105" style={{backgroundColor: '#83A682'}} title="Back to Home">
          <SafeIcon icon={FiHome} className="h-5 w-5 text-white" />
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{opacity: 0,y: 30}}
            animate={{opacity: 1,y: 0}}
            transition={{duration: 0.8}}
            className="flex items-center justify-center space-x-4 mb-1"
          >
            <SafeIcon icon={FiCalendar} className="h-8 w-8 text-primary" />
            <Link to="/" className="hover:text-primary transition-colors">
              <h1 className="text-3xl md:text-4xl">
                Overflow Signup
              </h1>
            </Link>
          </motion.div>
          <motion.p
            initial={{opacity: 0,y: 30}}
            animate={{opacity: 1,y: 0}}
            transition={{duration: 0.8,delay: 0.2}}
            className="text-base page-subtitle"
          >
            Sign up for monthly overflow service commitment
          </motion.p>
        </div>

        <motion.div
          initial={{opacity: 0,y: 30}}
          animate={{opacity: 1,y: 0}}
          transition={{duration: 0.8,delay: 0.4}}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Name *
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiUser}
                  className="absolute left-3 top-3 h-5 w-5 text-text-light"
                />
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

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Phone *
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiPhone}
                  className="absolute left-3 top-3 h-5 w-5 text-text-light"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="pl-10 w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email *
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiMail}
                  className="absolute left-3 top-3 h-5 w-5 text-text-light"
                />
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

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Number in party *
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiUsers}
                  className="absolute left-3 top-3 h-5 w-5 text-text-light"
                />
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

            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Which Sunday(s) will you commit to? (check all that apply) *
              </label>
              <div className="space-y-3">
                {sundays.map(sunday=> (
                  <label key={sunday} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-accent transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.selectedSundays.includes(sunday)}
                      onChange={()=> handleSundayToggle(sunday)}
                      className="w-5 h-5 mt-0.5 text-primary focus:ring-primary border-accent-dark rounded flex-shrink-0"
                    />
                    <span className="text-sm text-text-primary">{sunday}</span>
                  </label>
                ))}
              </div>
            </div>

            <StandardButton
              type="submit"
              disabled={isSubmitting}
              icon={FiCalendar}
              fullWidth
            >
              {isSubmitting ? 'Submitting...' : 'Submit Signup'}
            </StandardButton>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default OverflowSignup;
