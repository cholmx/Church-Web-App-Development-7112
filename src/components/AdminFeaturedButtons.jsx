import React,{useState,useEffect} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {SkeletonTable,SkeletonForm,LoadingTransition} from './LoadingSkeletons';
import supabase from '../lib/supabase';

const {FiPlus,FiEdit,FiTrash2,FiSave,FiX,FiToggleLeft,FiToggleRight}=FiIcons;

const AdminFeaturedButtons=()=> {
  const [buttons,setButtons]=useState([]);
  const [loading,setLoading]=useState(true);
  const [editingId,setEditingId]=useState(null);
  const [showForm,setShowForm]=useState(false);
  const [formData,setFormData]=useState({
    title: '',
    description: '',
    path: '',
    is_active: false
  });

  useEffect(()=> {
    fetchButtons();
  },[]);

  const fetchButtons=async ()=> {
    try {
      const {data,error}=await supabase
        .from('featured_buttons_portal123')
        .select('*')
        .order('display_order',{ascending: true});
      if (error) throw error;
      setButtons(data || []);
    } catch (error) {
      console.error('Error fetching featured buttons:',error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit=async (e)=> {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        const buttonData={
          title: formData.title,
          description: formData.description,
          path: formData.path,
          icon_name: 'FiCheck',
          is_active: formData.is_active
        };
        const {error}=await supabase
          .from('featured_buttons_portal123')
          .update(buttonData)
          .eq('id',editingId);
        if (error) throw error;
      } else {
        const autoType=formData.title.toLowerCase().replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'');
        const nextOrder=buttons.length + 1;
        const buttonData={
          button_type: autoType,
          title: formData.title,
          description: formData.description,
          path: formData.path,
          icon_name: 'FiCheck',
          display_order: nextOrder,
          is_active: formData.is_active
        };
        const {error}=await supabase
          .from('featured_buttons_portal123')
          .insert([buttonData]);
        if (error) throw error;
      }
      handleCancel();
      fetchButtons();
    } catch (error) {
      console.error('Error saving button:',error);
      alert('Error saving button. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit=(button)=> {
    setFormData({
      title: button.title,
      description: button.description || '',
      path: button.path,
      is_active: button.is_active
    });
    setEditingId(button.id);
    setShowForm(true);
  };

  const handleDelete=async (id)=> {
    if (!confirm('Are you sure you want to delete this featured button?')) return;
    try {
      const {error}=await supabase
        .from('featured_buttons_portal123')
        .delete()
        .eq('id',id);
      if (error) throw error;
      fetchButtons();
    } catch (error) {
      console.error('Error deleting button:',error);
      alert('Error deleting button. Please try again.');
    }
  };

  const handleToggleActive=async (button)=> {
    try {
      const {error}=await supabase
        .from('featured_buttons_portal123')
        .update({is_active: !button.is_active})
        .eq('id',button.id);
      if (error) throw error;
      fetchButtons();
    } catch (error) {
      console.error('Error toggling button:',error);
      alert('Error updating button status. Please try again.');
    }
  };

  const handleCancel=()=> {
    setFormData({
      title: '',
      description: '',
      path: '',
      is_active: false
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-text-primary">Manage Featured Buttons</h2>
        <button
          onClick={()=> setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>New Button</span>
        </button>
      </div>

      {showForm && (
        <LoadingTransition isLoading={loading && editingId} skeleton={<SkeletonForm />}>
          <motion.div
            initial={{opacity: 0,y: 20}}
            animate={{opacity: 1,y: 0}}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e)=> setFormData({...formData,title: e.target.value})}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Overflow Signup"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Description <span className="text-text-light font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e)=> setFormData({...formData,description: e.target.value})}
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Monthly service commitment"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Link *</label>
                <input
                  type="text"
                  value={formData.path}
                  onChange={(e)=> setFormData({...formData,path: e.target.value})}
                  required
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="/overflow-signup or https://example.com"
                />
                <p className="text-xs text-text-light mt-1">Use a path like /page-name for internal pages, or a full URL for external links</p>
              </div>
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e)=> setFormData({...formData,is_active: e.target.checked})}
                    className="w-4 h-4 text-primary focus:ring-primary border-accent-dark rounded"
                  />
                  <span className="text-sm font-medium text-text-primary">Active (show on homepage)</span>
                </label>
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

      <LoadingTransition isLoading={loading && !showForm} skeleton={<SkeletonTable rows={3} columns={3} />}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {buttons.length===0 ? (
            <div className="p-8 text-center">
              <p className="text-text-primary">No featured buttons yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-accent">
              {buttons.map((button)=> (
                <div key={button.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg text-text-primary">{button.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${button.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {button.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {button.description && <p className="text-sm text-text-light mb-2">{button.description}</p>}
                      <div className="text-xs text-text-light">
                        <div><strong>Link:</strong> {button.path}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={()=> handleToggleActive(button)}
                        className={`p-2 rounded-lg transition-colors ${button.is_active ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'}`}
                        title={button.is_active ? 'Deactivate' : 'Activate'}
                      >
                        <SafeIcon icon={button.is_active ? FiToggleRight : FiToggleLeft} className="h-5 w-5" />
                      </button>
                      <button
                        onClick={()=> handleEdit(button)}
                        className="p-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiEdit} className="h-4 w-4" />
                      </button>
                      <button
                        onClick={()=> handleDelete(button.id)}
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

export default AdminFeaturedButtons;
