import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiCalendar, FiUsers, FiTrash2, FiDownload } = FiIcons;

const AdminTransformingTogether = () => {
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSignups();
  }, []);

  const fetchSignups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transforming_together_meetings')
        .select('*')
        .order('meeting_date', { ascending: true })
        .order('meeting_time', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setSignups(data || []);
    } catch (error) {
      console.error('Error fetching signups:', error);
      alert('Failed to load signups: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSignup = async (id) => {
    if (!window.confirm('Are you sure you want to delete this signup?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('transforming_together_meetings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSignups(signups.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting signup:', error);
      alert('Failed to delete signup: ' + error.message);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Meeting Date', 'Meeting Time', 'Signed Up At'];
    const csvContent = [
      headers.join(','),
      ...signups.map(signup => [
        `"${signup.name}"`,
        `"${signup.meeting_date}"`,
        `"${signup.meeting_time}"`,
        `"${new Date(signup.created_at).toLocaleString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transforming-together-signups.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getFilteredSignups = () => {
    if (filter === 'all') return signups;
    return signups.filter(s => s.meeting_date === filter);
  };

  const getStatsByMeeting = () => {
    const stats = {};
    signups.forEach(signup => {
      const key = `${signup.meeting_date} - ${signup.meeting_time}`;
      stats[key] = (stats[key] || 0) + 1;
    });
    return stats;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = getStatsByMeeting();
  const filteredSignups = getFilteredSignups();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          <SafeIcon icon={FiCalendar} className="h-6 w-6 text-primary" />
          <span>Transforming Together Meetings</span>
        </h2>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-text-light">
            Total: {signups.length} signups
          </span>
          <button
            onClick={exportToCSV}
            disabled={signups.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <SafeIcon icon={FiDownload} className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(stats).map(([meeting, count]) => (
          <div
            key={meeting}
            className={`p-4 rounded-lg border-2 ${
              count >= 35 ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">{meeting}</p>
              <div className="flex items-center space-x-1">
                <SafeIcon icon={FiUsers} className="h-4 w-4" />
                <span className={`font-bold ${count >= 35 ? 'text-red-600' : ''}`}>
                  {count}/35
                </span>
              </div>
            </div>
            {count >= 35 && (
              <p className="text-xs text-red-600 mt-1 font-semibold">FULL</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          All Meetings
        </button>
        <button
          onClick={() => setFilter('Friday, March 6')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'Friday, March 6'
              ? 'bg-primary text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Friday
        </button>
        <button
          onClick={() => setFilter('Saturday, March 7')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'Saturday, March 7'
              ? 'bg-primary text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Saturday
        </button>
      </div>

      {filteredSignups.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <SafeIcon icon={FiCalendar} className="h-16 w-16 text-text-light mx-auto mb-4" />
          <p className="text-xl">No signups yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meeting Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Signed Up
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSignups.map((signup, index) => (
                  <motion.tr
                    key={signup.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {signup.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{signup.meeting_date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{signup.meeting_time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(signup.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => deleteSignup(signup.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Signup"
                      >
                        <SafeIcon icon={FiTrash2} className="h-5 w-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransformingTogether;
