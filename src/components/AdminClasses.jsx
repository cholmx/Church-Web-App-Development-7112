import React,{useState,useEffect} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import RichTextEditor from './RichTextEditor';
import {SkeletonTable,SkeletonForm,LoadingTransition} from './LoadingSkeletons';
import supabase from '../lib/supabase';

const {FiPlus,FiEdit,FiTrash2,FiSave,FiX,FiExternalLink}=FiIcons;

const AdminClasses=()=> {
  const [classes,setClasses]=useState([]);
  const [loading,setLoading]=useState(true);
  const [editingId,setEditingId]=useState(null);
  const [showForm,setShowForm]=useState(false);
  const [formData,setFormData]=useState({title: '',details: '',link: ''});

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

  const handleSubmit=async (e)=> {
    e.preventDefault();
    setLoading(true);
    try {
      const classData={
        title: formData.title,
        details: formData.details,
        link: formData.link
      };

      if (editingId) {
        const {error}=await supabase
          .from('classes_portal123')
          .update(classData)
          .eq('id',editingId);
        if (error) throw error;
      } else {
        const {error}=await supabase
          .from('classes_portal123')
          .insert([classData]);
        if (error) throw error;
      }
      handleCancel();
      fetchClasses();
    } catch (error) {
      console.error('Error saving class:',error);
      alert('Error saving class. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit=(classItem)=> {
    setFormData({
      title: classItem.title,
      details: classItem.details,
      link: classItem.link || ''
    });
    setEditingId(classItem.id);
    setShowForm(true);
  };

  const handleDelete=async (id)=> {
    if (!confirm('Are you sure you want to delete this class?')) return;
    try {
      const {error}=await supabase
        .from('classes_portal123')
        .delete()
        .eq('id',id);
      if (error) throw error;
      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:',error);
      alert('Error deleting class. Please try again.');
    }
  };

  const handleCancel=()=> {
    setFormData({title: '',details: '',link: ''});
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-text-primary">Manage Classes</h2>
        <button
          onClick={()=> setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>New Class</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <LoadingTransition isLoading={loading && editingId} skeleton={<SkeletonForm />}>
          <motion.div
            initial={{opacity: 0,y: 20}}
            animate={{opacity: 1,y: 0}}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Class Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e)=> setFormData({...formData,title: e.target.value})}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Class title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Class Details *</label>
                <RichTextEditor
                  value={formData.details}
                  onChange={(e)=> setFormData({...formData,details: e.target.value})}
                  placeholder="Enter class description,schedule,requirements,etc..."
                  rows={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Registration Link</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e)=> setFormData({...formData,link: e.target.value})}
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com/register"
                />
                <p className="text-sm text-text-light mt-1">
                  Optional: Add a link to external registration or more information
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 inline-flex items-center space-x-2"
                >
                  <SafeIcon icon={FiSave} className="h-4 w-4" />
                  <span>{editingId ? 'Update' : 'Create'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors inline-flex items-center space-x-2"
                >
                  <SafeIcon icon={FiX} className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </motion.div>
        </LoadingTransition>
      )}

      {/* Classes List */}
      <LoadingTransition isLoading={loading && !showForm} skeleton={<SkeletonTable rows={3} columns={2} />}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {classes.length===0 ? (
            <div className="p-8 text-center">
              <p className="text-text-primary">No classes yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-accent">
              {classes.map((classItem)=> (
                <div key={classItem.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg text-text-primary mb-2">{classItem.title}</h3>
                      <div
                        className="text-text-primary text-sm mb-2 prose prose-sm max-w-none rendered-content"
                        dangerouslySetInnerHTML={{__html: classItem.details}}
                      />
                      {classItem.link && (
                        <div className="mb-2">
                          <a
                            href={classItem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-primary hover:text-primary-dark text-sm underline"
                          >
                            <SafeIcon icon={FiExternalLink} className="h-3 w-3" />
                            <span>Registration Link</span>
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={()=> handleEdit(classItem)}
                        className="p-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiEdit} className="h-4 w-4" />
                      </button>
                      <button
                        onClick={()=> handleDelete(classItem.id)}
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
      </LoadingTransition>
    </div>
  );
};

export default AdminClasses;