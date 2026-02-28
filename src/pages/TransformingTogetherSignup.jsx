import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiHome, FiCalendar, FiClock, FiUsers, FiCheckCircle } = FiIcons;

const TransformingTogetherSignup = () => {
  const [name, setName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [meetingCapacity, setMeetingCapacity] = useState({});

  const meetings = [
    { date: 'Friday, March 6', times: ['4pm', '6pm', '7pm'] },
    { date: 'Saturday, March 7', times: ['4pm', '5pm'] }
  ];

  useEffect(() => {
    fetchMeetingCapacity();
  }, []);

  const fetchMeetingCapacity = async () => {
    try {
      const { data, error } = await supabase
        .from('transforming_together_meetings')
        .select('meeting_date, meeting_time');

      if (error) throw error;

      const capacity = {};
      data.forEach(meeting => {
        const key = `${meeting.meeting_date}-${meeting.meeting_time}`;
        capacity[key] = (capacity[key] || 0) + 1;
      });
      setMeetingCapacity(capacity);
    } catch (error) {
      console.error('Error fetching meeting capacity:', error);
    }
  };

  const getMeetingCount = (date, time) => {
    const key = `${date}-${time}`;
    return meetingCapacity[key] || 0;
  };

  const isMeetingFull = (date, time) => {
    return getMeetingCount(date, time) >= 35;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (isMeetingFull(selectedDate, selectedTime)) {
      alert('Sorry, this meeting time is full. Please select another time.');
      setSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('transforming_together_meetings')
        .insert([{
          name,
          meeting_date: selectedDate,
          meeting_time: selectedTime
        }]);

      if (error) throw error;

      setSubmitSuccess(true);
      setName('');
      setSelectedDate('');
      setSelectedTime('');
      await fetchMeetingCapacity();

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting signup:', error);
      alert('Failed to submit signup. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 relative" style={{ backgroundColor: '#fcfaf2' }}>
      <div className="fixed top-6 right-6 z-50">
        <Link
          to="/growth-campaign"
          className="inline-flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          style={{ backgroundColor: '#83A682' }}
          title="Back to Growth Campaign"
        >
          <SafeIcon icon={FiHome} className="h-5 w-5 text-white" />
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl mb-4">Transforming Together Information Meeting</h1>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Join us for an informational meeting to learn more about the Growth Campaign.
            No financial commitment is required.
          </p>
        </motion.div>

        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiCheckCircle} className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-green-800 font-semibold">Registration Successful!</p>
                <p className="text-green-700">We look forward to seeing you at the meeting.</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-8 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="name" className="block text-lg font-medium mb-3">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-lg font-medium mb-4">
                <SafeIcon icon={FiCalendar} className="inline h-5 w-5 mr-2" />
                Select a Date
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meetings.map((meeting) => (
                  <button
                    key={meeting.date}
                    type="button"
                    onClick={() => {
                      setSelectedDate(meeting.date);
                      setSelectedTime('');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      selectedDate === meeting.date
                        ? 'border-primary bg-green-50'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    <p className="font-semibold text-lg">{meeting.date}</p>
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-lg font-medium mb-4">
                  <SafeIcon icon={FiClock} className="inline h-5 w-5 mr-2" />
                  Select a Time
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {meetings
                    .find(m => m.date === selectedDate)
                    ?.times.map((time) => {
                      const count = getMeetingCount(selectedDate, time);
                      const isFull = isMeetingFull(selectedDate, time);
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => !isFull && setSelectedTime(time)}
                          disabled={isFull}
                          className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                            selectedTime === time
                              ? 'border-primary bg-green-50'
                              : isFull
                              ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                              : 'border-gray-300 hover:border-primary'
                          }`}
                        >
                          <p className="font-semibold text-lg">{time}</p>
                          <div className="flex items-center justify-center mt-2 text-sm">
                            <SafeIcon icon={FiUsers} className="h-4 w-4 mr-1" />
                            <span className={isFull ? 'text-red-600 font-semibold' : 'text-text-light'}>
                              {count}/35
                            </span>
                          </div>
                          {isFull && (
                            <p className="text-xs text-red-600 mt-1 font-semibold">FULL</p>
                          )}
                        </button>
                      );
                    })}
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={submitting || !name || !selectedDate || !selectedTime}
              className="w-full py-4 rounded-lg font-semibold text-lg text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#83A682' }}
            >
              {submitting ? 'Submitting...' : 'Register for Meeting'}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Link
            to="/growth-campaign"
            className="text-primary hover:underline font-medium"
          >
            Back to Growth Campaign
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default TransformingTogetherSignup;
