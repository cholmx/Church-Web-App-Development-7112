import React,{useState,useEffect} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {SkeletonTable,SkeletonForm,LoadingTransition} from './LoadingSkeletons';
import supabase from '../lib/supabase';

const {FiPlus,FiEdit,FiTrash2,FiSave,FiX,FiToggleLeft,FiToggleRight,FiExternalLink}=FiIcons;

const AdminLeadershipLinks=()=> {
  const [links,setLinks]=useState([]);
  const [loading,setLoading]=useState(true);
  const [editingId,setEditingId]=useState(null);
  const [showForm,setShowForm]=useState(false);
  const [formData,setFormData]=useState({
    title: '',
    url: '',
    description: '',
    category: '',
    sort_order: 0,
    is_active: true
  });

  useEffect(()=> {
    fetchLinks();
  },[]);

  const fetchLinks=async ()=> {
    try {
      const {data,error}=await supabase
        .from('leadership_links')
        .select('*')
        .order('sort_order',{ascending: true});
      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error fetching leadership links:',error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit=async (e)=> {
    e.preventDefault();
    setLoading(true);
    try {
      const linkData={
        title: formData.title,
        url: formData.url,
        description: formData.description,
        category: formData.category,
        sort_order: Number(formData.sort_order) || 0,
        is_active: formData.is_active,
        updated_at: new Date().toISOString()
      };
      if (editingId) {
        const {error}=await supabase
          .from('leadership_links')
          .update(linkData)
          .eq('id',editingId);
        if (error) throw error;
      } else {
        const {error}=await supabase
          .from('leadership_links')
          .insert([{...linkData}]);
        if (error) throw error;
      }
      handleCancel();
      fetchLinks();
    } catch (error) {
      console.error('Error saving link:',error);
      alert('Error saving link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit=(link)=> {
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description || '',
      category: link.category || '',
      sort_order: link.sort_order || 0,
      is_active: link.is_active
    });
    setEditingId(link.id);
    setShowForm(true);
  };

  const handleDelete=async (id)=> {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
      const {error}=await supabase
        .from('leadership_links')
        .delete()
        .eq('id',id);
      if (error) throw error;
      fetchLinks();
    } catch (error) {
      console.error('Error deleting link:',error);
      alert('Error deleting link. Please try again.');
    }
  };

  const handleToggleActive=async (link)=> {
    try {
      const {error}=await supabase
        .from('leadership_links')
        .update({is_active: !link.is_active,updated_at: new Date().toISOString()})
        .eq('id',link.id);
      if (error) throw error;
      fetchLinks();
    } catch (error) {
      console.error('Error toggling link:',error);
      alert('Error updating link status. Please try again.');
    }
  };

  const handleCancel=()=> {
    setFormData({title: '',url: '',description: '',category: '',sort_order: 0,is_active: true});
    setEditingId(null);
    setShowForm(false);
  };

  const grouped=links.reduce((acc,link)=> {
    const cat=link.category || 'General';
    if (!acc[cat]) acc[cat]=[];
    acc[cat].push(link);
    return acc;
  },{});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-text-primary">Leadership Links</h2>
        <button
          onClick={()=> setShowForm(true)}
          className="admin-btn-primary"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>Add Link</span>
        </button>
      </div>

      {showForm && (
        <LoadingTransition isLoading={loading && !!editingId} skeleton={<SkeletonForm />}>
          <motion.div
            initial={{opacity: 0,y: 20}}
            animate={{opacity: 1,y: 0}}
            className="admin-card"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e)=> setFormData({...formData,title: e.target.value})}
                    required
                    className="admin-input"
                    placeholder="Planning Center"
                  />
                </div>
                <div>
                  <label className="admin-label">Category <span className="text-text-light font-normal">(optional)</span></label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e)=> setFormData({...formData,category: e.target.value})}
                    className="admin-input"
                    placeholder="e.g. Church Management"
                  />
                </div>
              </div>
              <div>
                <label className="admin-label">URL *</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e)=> setFormData({...formData,url: e.target.value})}
                  required
                  className="admin-input"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="admin-label">Description <span className="text-text-light font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e)=> setFormData({...formData,description: e.target.value})}
                  className="admin-input"
                  placeholder="Brief note about this site"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e)=> setFormData({...formData,sort_order: e.target.value})}
                    className="admin-input"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e)=> setFormData({...formData,is_active: e.target.checked})}
                      className="w-4 h-4 text-primary focus:ring-primary border-accent-dark rounded"
                    />
                    <span className="text-sm font-medium text-text-primary">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex space-x-4">
                <button type="submit" disabled={loading} className="admin-btn-primary">
                  <SafeIcon icon={FiSave} className="h-4 w-4" />
                  <span>{editingId ? 'Update' : 'Save'}</span>
                </button>
                <button type="button" onClick={handleCancel} className="admin-btn-secondary">
                  <SafeIcon icon={FiX} className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </motion.div>
        </LoadingTransition>
      )}

      <LoadingTransition isLoading={loading && !showForm} skeleton={<SkeletonTable rows={4} columns={3} />}>
        {links.length===0 ? (
          <div className="bg-white rounded-2xl shadow-modern p-8 text-center">
            <p className="text-text-primary">No links yet. Add your first leadership link above.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([category,categoryLinks])=> (
              <div key={category} className="bg-white rounded-2xl shadow-modern overflow-hidden">
                <div className="px-6 py-3 bg-accent border-b border-accent-dark">
                  <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">{category}</h3>
                </div>
                <div className="divide-y divide-accent">
                  {categoryLinks.map((link)=> (
                    <div key={link.id} className="p-5">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <h4 className="text-base font-semibold text-text-primary">{link.title}</h4>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${link.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {link.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          {link.description && (
                            <p className="text-sm text-text-light mb-1">{link.description}</p>
                          )}
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-xs text-primary hover:underline truncate max-w-xs"
                          >
                            <SafeIcon icon={FiExternalLink} className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{link.url}</span>
                          </a>
                        </div>
                        <div className="flex space-x-2 ml-4 flex-shrink-0">
                          <button
                            onClick={()=> handleToggleActive(link)}
                            className={`p-2 rounded-lg transition-colors ${link.is_active ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'}`}
                            title={link.is_active ? 'Deactivate' : 'Activate'}
                          >
                            <SafeIcon icon={link.is_active ? FiToggleRight : FiToggleLeft} className="h-5 w-5" />
                          </button>
                          <button onClick={()=> handleEdit(link)} className="admin-btn-edit">
                            <SafeIcon icon={FiEdit} className="h-4 w-4" />
                          </button>
                          <button onClick={()=> handleDelete(link.id)} className="admin-btn-danger">
                            <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </LoadingTransition>
    </div>
  );
};

export default AdminLeadershipLinks;
