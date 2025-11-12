import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {submitRealmSignup} from '../lib/contactStorage';

const {FiUserPlus,FiCheck,FiUser,FiMail,FiPhone,FiMapPin,FiCalendar,FiHeart,FiHome}=FiIcons;

const JoinRealm=()=> {
  const [formData,setFormData]=useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    birthday: '',
    maritalStatus: '',
    anniversary: ''
  });
  const [isSubmitting,setIsSubmitting]=useState(false);
  const [isSubmitted,setIsSubmitted]=useState(false);

  const maritalStatusOptions=[
    {value: '',label: 'Select...'},
    {value: 'married',label: 'Married'},
    {value: 'separated',label: 'Separated'},
    {value: 'unmarried',label: 'Unmarried'},
    {value: 'widowed',label: 'Widowed'}
  ];

  const handleInputChange=(e)=> {
    const {name,value}=e.target;
    setFormData((prev)=> ({...prev,[name]: value}));
  };

  const handleSubmit=async (e)=> {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const {error}=await submitRealmSignup({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address_line1: formData.addressLine1,
        address_line2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        country: formData.country,
        birthday: formData.birthday || null,
        marital_status: formData.maritalStatus,
        anniversary: formData.anniversary || null
      });
      if (error) throw error;
      setIsSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        birthday: '',
        maritalStatus: '',
        anniversary: ''
      });
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
        {/* Back to Home Button - Top Right */}
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
          <h2 className="text-2xl mb-4">
            Welcome to Realm!
          </h2>
          <p className="text-secondary mb-6">
            Your registration has been submitted successfully. We'll process
            your information and send you access details soon.
          </p>
          <div className="space-y-3">
            <button
              onClick={()=> setIsSubmitted(false)}
              className="w-full bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Submit Another
            </button>
          </div>
        </motion.div>
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{opacity: 0,y: 30}}
            animate={{opacity: 1,y: 0}}
            transition={{duration: 0.8}}
            className="flex items-center justify-center space-x-4 mb-1"
          >
            <SafeIcon icon={FiUserPlus} className="h-8 w-8 text-primary" />
            <Link to="/" className="hover:text-primary transition-colors">
              <h1 className="text-3xl md:text-4xl">
                Join Realm
              </h1>
            </Link>
          </motion.div>
          <motion.p
            initial={{opacity: 0,y: 30}}
            animate={{opacity: 1,y: 0}}
            transition={{duration: 0.8,delay: 0.2}}
            className="text-base page-subtitle"
          >
            Connect with our church community through Realm
          </motion.p>
        </div>

        {/* Form */}
        <motion.div
          initial={{opacity: 0,y: 30}}
          animate={{opacity: 1,y: 0}}
          transition={{duration: 0.8,delay: 0.4}}
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
                  <SafeIcon
                    icon={FiUser}
                    className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                  />
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
                  <SafeIcon
                    icon={FiUser}
                    className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                  />
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
                <SafeIcon
                  icon={FiMail}
                  className="absolute left-3 top-3 h-5 w-5 text-gray-400"
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

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiPhone}
                  className="absolute left-3 top-3 h-5 w-5 text-gray-400"
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

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Address *
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <SafeIcon
                    icon={FiMapPin}
                    className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                  />
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    required
                    className="pl-10 w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Line 1"
                  />
                </div>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Line 2 (optional)"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="State"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Zip Code"
                  />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            {/* Birthday */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Birthday
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiCalendar}
                  className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                />
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Marital Status
              </label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleInputChange}
                className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {maritalStatusOptions.map((option)=> (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Anniversary */}
            {formData.maritalStatus==='married' && (
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Anniversary
                </label>
                <div className="relative">
                  <SafeIcon
                    icon={FiHeart}
                    className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                  />
                  <input
                    type="date"
                    name="anniversary"
                    value={formData.anniversary}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Join Realm'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinRealm;