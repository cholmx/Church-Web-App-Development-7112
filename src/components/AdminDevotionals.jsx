import React,{useState,useEffect} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import RichTextEditor from './RichTextEditor';
import supabase from '../lib/supabase';

const {FiUpload,FiDownload,FiTrash2,FiBookOpen,FiCalendar,FiRefreshCw,FiCheckCircle,FiAlertCircle,FiPlus,FiEdit,FiSave,FiX}=FiIcons;

const AdminDevotionals=()=> {
  const [devotionals,setDevotionals]=useState([]);
  const [loading,setLoading]=useState(true);
  const [uploading,setUploading]=useState(false);
  const [success,setSuccess]=useState('');
  const [error,setError]=useState('');
  const [showForm,setShowForm]=useState(false);
  const [showBulkImport,setShowBulkImport]=useState(false);
  const [editingId,setEditingId]=useState(null);
  const [importText,setImportText]=useState('');
  const [importing,setImporting]=useState(false);
  
  const [formData,setFormData]=useState({
    devotional_date: '',
    title: '',
    subtitle: '',
    scripture_reference: '',
    content: '',
    response: '',
    prayer: ''
  });

  useEffect(()=> {
    fetchDevotionals();
  },[]);

  const fetchDevotionals=async ()=> {
    try {
      setError('');
      const {data,error}=await supabase
        .from('daily_devotionals_portal123')
        .select('*')
        .order('devotional_date',{ascending: true});
      
      if (error) throw error;
      setDevotionals(data || []);
      console.log('✅ Devotionals fetched:',data?.length || 0);
    } catch (error) {
      console.error('❌ Error fetching devotionals:',error);
      setError('Failed to fetch devotionals: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit=async (e)=> {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const devotionalData={
        devotional_date: formData.devotional_date,
        title: formData.title,
        subtitle: formData.subtitle || null,
        scripture_reference: formData.scripture_reference || null,
        content: formData.content,
        response: formData.response || null,
        prayer: formData.prayer || null
      };

      if (editingId) {
        const {error}=await supabase
          .from('daily_devotionals_portal123')
          .update(devotionalData)
          .eq('id',editingId);
        
        if (error) throw error;
        setSuccess('Devotional updated successfully!');
      } else {
        const {error}=await supabase
          .from('daily_devotionals_portal123')
          .insert([devotionalData]);
        
        if (error) throw error;
        setSuccess('Devotional created successfully!');
      }

      setFormData({
        devotional_date: '',
        title: '',
        subtitle: '',
        scripture_reference: '',
        content: '',
        response: '',
        prayer: ''
      });
      setEditingId(null);
      setShowForm(false);
      fetchDevotionals();
    } catch (error) {
      console.error('❌ Error saving devotional:',error);
      setError('Error saving devotional: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit=(devotional)=> {
    setFormData({
      devotional_date: devotional.devotional_date,
      title: devotional.title,
      subtitle: devotional.subtitle || '',
      scripture_reference: devotional.scripture_reference || '',
      content: devotional.content,
      response: devotional.response || '',
      prayer: devotional.prayer || ''
    });
    setEditingId(devotional.id);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete=async (id)=> {
    if (!confirm('Are you sure you want to delete this devotional?')) return;

    try {
      const {error}=await supabase
        .from('daily_devotionals_portal123')
        .delete()
        .eq('id',id);
      
      if (error) throw error;
      setSuccess('Devotional deleted successfully!');
      fetchDevotionals();
    } catch (error) {
      console.error('❌ Error deleting devotional:',error);
      setError('Error deleting devotional: ' + error.message);
    }
  };

  const handleCancel=()=> {
    setFormData({
      devotional_date: '',
      title: '',
      subtitle: '',
      scripture_reference: '',
      content: '',
      response: '',
      prayer: ''
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  const parseDevotionalFile=(text)=> {
    const devotionals=[];
    const sections=text.split(/\n\s*\n/).filter(section=> section.trim() !=='');
    let currentDevotional=null;

    for (const section of sections) {
      const lines=section.split('\n').map(line=> line.trim()).filter(line=> line !=='');
      if (lines.length===0) continue;

      const firstLine=lines[0];
      // Check if this is a date/title line (contains month and colon)
      const dateMatch=firstLine.match(/^(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)\s+(\d+):\s*(.+)$/i);

      if (dateMatch) {
        // Save previous devotional if it exists
        if (currentDevotional) {
          devotionals.push(currentDevotional);
        }

        const [,month,day,title]=dateMatch;
        const monthNum={'JANUARY': 1,'FEBRUARY': 2,'MARCH': 3,'APRIL': 4,'MAY': 5,'JUNE': 6,'JULY': 7,'AUGUST': 8,'SEPTEMBER': 9,'OCTOBER': 10,'NOVEMBER': 11,'DECEMBER': 12}[month.toUpperCase()];

        // Create date string (using current year)
        const currentYear=new Date().getFullYear();
        const dateStr=`${currentYear}-${monthNum.toString().padStart(2,'0')}-${day.padStart(2,'0')}`;

        currentDevotional={
          devotional_date: dateStr,
          title: title.trim(),
          subtitle: '',
          scripture_reference: '',
          content: '',
          response: '',
          prayer: ''
        };
      } else if (currentDevotional) {
        // This is content for the current devotional
        const content=lines.join('\n');

        if (content.toLowerCase().startsWith('response:')) {
          currentDevotional.response=content.substring(9).trim();
        } else if (content.toLowerCase().startsWith('prayer:')) {
          currentDevotional.prayer=content.substring(7).trim();
        } else if (!currentDevotional.subtitle && lines.length===1) {
          // Single line after title is likely the subtitle
          currentDevotional.subtitle=content;
        } else if (!currentDevotional.scripture_reference && lines.length===1 && content.includes(':')) {
          // Line with colons is likely scripture reference
          currentDevotional.scripture_reference=content;
        } else {
          // Everything else goes into content
          if (currentDevotional.content) {
            currentDevotional.content +='\n\n' + content;
          } else {
            currentDevotional.content=content;
          }
        }
      }
    }

    // Don't forget the last devotional
    if (currentDevotional) {
      devotionals.push(currentDevotional);
    }

    return devotionals;
  };

  const handleBulkImport=async ()=> {
    if (!importText.trim()) {
      alert('Please paste your devotional text first.');
      return;
    }

    setImporting(true);
    try {
      const parsedEntries=parseDevotionalFile(importText);
      
      if (parsedEntries.length===0) {
        throw new Error('No valid devotionals found in the file. Please check the format.');
      }

      // Show preview and confirm
      const confirmMessage=`Found ${parsedEntries.length} devotional entries. Import them all?`;
      if (!confirm(confirmMessage)) {
        setImporting(false);
        return;
      }

      // Clear existing devotionals first
      const {error: deleteError}=await supabase
        .from('daily_devotionals_portal123')
        .delete()
        .neq('id','00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteError) {
        console.warn('Warning clearing existing devotionals:',deleteError);
      }

      // Insert new devotionals
      const {error: insertError}=await supabase
        .from('daily_devotionals_portal123')
        .insert(parsedEntries);

      if (insertError) throw insertError;

      setSuccess(`Successfully uploaded ${parsedEntries.length} devotionals!`);
      setImportText('');
      setShowBulkImport(false);
      fetchDevotionals();
    } catch (error) {
      console.error('❌ Error importing devotionals:',error);
      setError('Error importing devotionals: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  const handleFileUpload=(event)=> {
    const file=event.target.files[0];
    if (!file) return;

    const reader=new FileReader();
    reader.onload=(e)=> {
      setImportText(e.target.result);
    };
    reader.readAsText(file);
  };

  const exportDevotionals=()=> {
    if (devotionals.length===0) {
      alert('No devotionals to export.');
      return;
    }

    let exportText='';
    devotionals.forEach((devotional,index)=> {
      const date=new Date(devotional.devotional_date);
      const monthName=date.toLocaleDateString('en-US',{month: 'long'}).toUpperCase();
      const day=date.getDate();

      exportText +=`${monthName} ${day}: ${devotional.title}\n\n`;
      
      if (devotional.subtitle) {
        exportText +=`${devotional.subtitle}\n\n`;
      }
      
      if (devotional.scripture_reference) {
        exportText +=`${devotional.scripture_reference}\n\n`;
      }
      
      if (devotional.content) {
        exportText +=`${devotional.content}\n\n`;
      }
      
      if (devotional.response) {
        exportText +=`Response: ${devotional.response}\n\n`;
      }
      
      if (devotional.prayer) {
        exportText +=`Prayer: ${devotional.prayer}\n\n`;
      }

      if (index < devotionals.length - 1) {
        exportText +='\n';
      }
    });

    const blob=new Blob([exportText],{type: 'text/plain'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download='devotionals.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAllDevotionals=async ()=> {
    if (!confirm('Are you sure you want to delete ALL devotionals? This cannot be undone.')) return;

    try {
      const {error}=await supabase
        .from('daily_devotionals_portal123')
        .delete()
        .neq('id','00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;
      setSuccess('All devotionals deleted successfully!');
      fetchDevotionals();
    } catch (error) {
      console.error('❌ Error deleting devotionals:',error);
      setError('Error deleting devotionals: ' + error.message);
    }
  };

  const getDevotionalsByMonth=()=> {
    const months={};
    devotionals.forEach(devotional=> {
      const date=new Date(devotional.devotional_date);
      const monthKey=date.toLocaleDateString('en-US',{month: 'long',year: 'numeric'});
      if (!months[monthKey]) {
        months[monthKey]=[];
      }
      months[monthKey].push(devotional);
    });
    return months;
  };

  const formatDate=(dateString)=> {
    return new Date(dateString).toLocaleDateString('en-US',{
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <motion.div
          initial={{opacity: 0,y: -20}}
          animate={{opacity: 1,y: 0}}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiCheckCircle} className="h-5 w-5 text-green-600" />
            <p className="text-green-700 font-inter">{success}</p>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{opacity: 0,y: -20}}
          animate={{opacity: 1,y: 0}}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiAlertCircle} className="h-5 w-5 text-red-600" />
            <p className="text-red-700 font-inter">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary font-inter">
          Manage Daily Devotionals
        </h2>
        <div className="space-x-2">
          <button
            onClick={fetchDevotionals}
            className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary-dark transition-colors inline-flex items-center space-x-2 font-inter"
          >
            <SafeIcon icon={FiRefreshCw} className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={()=> setShowBulkImport(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors inline-flex items-center space-x-2 font-inter"
          >
            <SafeIcon icon={FiUpload} className="h-4 w-4" />
            <span>Bulk Import</span>
          </button>
          <button
            onClick={()=> setShowForm(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors inline-flex items-center space-x-2 font-inter"
          >
            <SafeIcon icon={FiPlus} className="h-4 w-4" />
            <span>New Devotional</span>
          </button>
          {devotionals.length > 0 && (
            <>
              <button
                onClick={exportDevotionals}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center space-x-2 font-inter"
              >
                <SafeIcon icon={FiDownload} className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button
                onClick={clearAllDevotionals}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-flex items-center space-x-2 font-inter"
              >
                <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Individual Devotional Form */}
      {showForm && (
        <motion.div
          initial={{opacity: 0,y: 20}}
          animate={{opacity: 1,y: 0}}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4 font-inter">
            {editingId ? 'Edit Devotional' : 'New Devotional'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2 font-inter">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.devotional_date}
                  onChange={(e)=> setFormData({...formData,devotional_date: e.target.value})}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2 font-inter">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e)=> setFormData({...formData,title: e.target.value})}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                  placeholder="Devotional title"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2 font-inter">
                Subtitle
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e)=> setFormData({...formData,subtitle: e.target.value})}
                className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                placeholder="Optional subtitle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2 font-inter">
                Scripture Reference
              </label>
              <input
                type="text"
                value={formData.scripture_reference}
                onChange={(e)=> setFormData({...formData,scripture_reference: e.target.value})}
                className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
                placeholder="e.g., John 1:14; Ephesians 4:15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2 font-inter">
                Content *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(e)=> setFormData({...formData,content: e.target.value})}
                placeholder="Main devotional content..."
                rows={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2 font-inter">
                Response
              </label>
              <RichTextEditor
                value={formData.response}
                onChange={(e)=> setFormData({...formData,response: e.target.value})}
                placeholder="Response section..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2 font-inter">
                Prayer
              </label>
              <RichTextEditor
                value={formData.prayer}
                onChange={(e)=> setFormData({...formData,prayer: e.target.value})}
                placeholder="Prayer section..."
                rows={4}
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 inline-flex items-center space-x-2 font-inter"
              >
                <SafeIcon icon={FiSave} className="h-4 w-4" />
                <span>{editingId ? 'Update' : 'Create'}</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors inline-flex items-center space-x-2 font-inter"
              >
                <SafeIcon icon={FiX} className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <motion.div
          initial={{opacity: 0,y: 20}}
          animate={{opacity: 1,y: 0}}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4 font-inter">
            Bulk Import Devotionals
          </h3>
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2 font-inter">Expected Format</h4>
            <p className="text-blue-700 text-sm font-inter mb-3">
              Upload a .txt file with devotionals in this format:
            </p>
            <pre className="text-xs text-blue-800 bg-blue-100 p-3 rounded font-mono overflow-x-auto">
{`JANUARY 4: PURSUING HEALTHY RELATIONSHIPS

Truth and Grace Together

John 1:14; Ephesians 4:15

Jesus embodied both grace and truth perfectly...

Response: Identify one conversation where you need...

Prayer: Jesus, give me Your heart to speak truth...`}
            </pre>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2 font-inter">
                Upload Text File (.txt)
              </label>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                disabled={importing}
                className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2 font-inter">
                Or Paste Text Here
              </label>
              <textarea
                value={importText}
                onChange={(e)=> setImportText(e.target.value)}
                rows={10}
                className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-inter"
                placeholder="Paste your devotionals here using the format shown above..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleBulkImport}
                disabled={importing || !importText.trim()}
                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 inline-flex items-center space-x-2 font-inter"
              >
                <SafeIcon icon={FiUpload} className="h-4 w-4" />
                <span>{importing ? 'Importing...' : 'Import All'}</span>
              </button>
              <button
                onClick={()=> {setShowBulkImport(false); setImportText('');}}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors inline-flex items-center space-x-2 font-inter"
              >
                <SafeIcon icon={FiX} className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Statistics */}
      {devotionals.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 font-inter">
            Devotionals Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary font-inter">{devotionals.length}</div>
              <div className="text-sm text-text-light font-inter">Total Devotionals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-text-primary font-inter">
                {Object.keys(getDevotionalsByMonth()).length}
              </div>
              <div className="text-sm text-text-light font-inter">Months Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 font-inter">
                {Math.round((devotionals.length / 365) * 100)}%
              </div>
              <div className="text-sm text-text-light font-inter">Year Coverage</div>
            </div>
          </div>
        </div>
      )}

      {/* Devotionals List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-primary font-inter">Loading devotionals...</p>
          </div>
        ) : devotionals.length===0 ? (
          <div className="p-8 text-center">
            <SafeIcon icon={FiBookOpen} className="h-16 w-16 text-text-light mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2 font-inter">No Devotionals Yet</h3>
            <p className="text-text-light font-inter">
              Create your first devotional or upload a file to get started!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-accent">
            {devotionals.map((devotional,index)=> (
              <div key={devotional.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-text-primary font-inter">
                        {devotional.title}
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-white font-inter">
                        {formatDate(devotional.devotional_date)}
                      </span>
                    </div>
                    
                    {devotional.subtitle && (
                      <p className="text-primary font-medium mb-2 font-inter">
                        {devotional.subtitle}
                      </p>
                    )}
                    
                    {devotional.scripture_reference && (
                      <p className="text-sm text-text-light mb-2 font-inter italic">
                        {devotional.scripture_reference}
                      </p>
                    )}
                    
                    <div className="text-text-primary text-sm mb-2 font-inter">
                      {devotional.content.substring(0,150)}...
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-text-light">
                      {devotional.response && <span>✓ Response</span>}
                      {devotional.prayer && <span>✓ Prayer</span>}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={()=> handleEdit(devotional)}
                      className="p-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiEdit} className="h-4 w-4" />
                    </button>
                    <button
                      onClick={()=> handleDelete(devotional.id)}
                      className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDevotionals;