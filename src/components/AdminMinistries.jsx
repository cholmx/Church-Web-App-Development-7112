import React,{useState,useEffect} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {SkeletonTable,SkeletonForm,LoadingTransition} from './LoadingSkeletons';
import supabase from '../lib/supabase';

const {FiPlus,FiEdit,FiTrash2,FiSave,FiX,FiChevronUp,FiChevronDown,FiHeart}=FiIcons;

const AdminMinistries=()=> {
  const [ministries,setMinistries]=useState([]);
  const [loading,setLoading]=useState(true);
  const [editingId,setEditingId]=useState(null);
  const [showForm,setShowForm]=useState(false);
  const [formData,setFormData]=useState({
    title: '',
    description: '',
    leader_name: '',
    leader_role: '',
    age_group: 'All Ages',
    is_active: true
  });
  const [features,setFeatures]=useState([]);
  const [newFeature,setNewFeature]=useState('');

  useEffect(()=> {
    fetchMinistries();
  },[]);

  const fetchMinistries=async ()=> {
    try {
      const {data,error}=await supabase
        .from('ministries_portal123')
        .select('*')
        .order('display_order',{ascending: true});
      if (error) throw error;
      setMinistries(data || []);
    } catch (error) {
      console.error('Error fetching ministries:',error);
    } finally {
      setTimeout(()=> setLoading(false),600);
    }
  };

  const fetchFeatures=async (ministryId)=> {
    try {
      const {data,error}=await supabase
        .from('ministry_features_portal123')
        .select('*')
        .eq('ministry_id',ministryId)
        .order('display_order',{ascending: true});
      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error('Error fetching features:',error);
    }
  };

  const handleSubmit=async (e)=> {
    e.preventDefault();
    setLoading(true);
    try {
      const ministryData={
        title: formData.title,
        description: formData.description,
        leader_name: formData.leader_name || null,
        leader_role: formData.leader_role || null,
        age_group: formData.age_group,
        is_active: formData.is_active,
        display_order: editingId ? undefined : ministries.length
      };

      let ministryId=editingId;

      if (editingId) {
        const {error}=await supabase
          .from('ministries_portal123')
          .update(ministryData)
          .eq('id',editingId);
        if (error) throw error;
      } else {
        const {data,error}=await supabase
          .from('ministries_portal123')
          .insert([ministryData])
          .select();
        if (error) throw error;
        ministryId=data[0].id;
      }

      if (features.length > 0) {
        await supabase
          .from('ministry_features_portal123')
          .delete()
          .eq('ministry_id',ministryId);

        const featureData=features.map((feature,index)=> ({
          ministry_id: ministryId,
          feature_text: feature.feature_text || feature,
          display_order: index
        }));

        const {error: featuresError}=await supabase
          .from('ministry_features_portal123')
          .insert(featureData);
        if (featuresError) throw featuresError;
      }

      handleCancel();
      fetchMinistries();
    } catch (error) {
      console.error('Error saving ministry:',error);
      alert(`Error saving ministry: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit=async (ministry)=> {
    setFormData({
      title: ministry.title,
      description: ministry.description,
      leader_name: ministry.leader_name || '',
      leader_role: ministry.leader_role || '',
      age_group: ministry.age_group || 'All Ages',
      is_active: ministry.is_active
    });
    setEditingId(ministry.id);
    await fetchFeatures(ministry.id);
    setShowForm(true);
  };

  const handleDelete=async (id)=> {
    if (!confirm('Are you sure you want to delete this ministry? This will also delete all associated features.')) return;
    try {
      const {error}=await supabase
        .from('ministries_portal123')
        .delete()
        .eq('id',id);
      if (error) throw error;
      fetchMinistries();
    } catch (error) {
      console.error('Error deleting ministry:',error);
      alert('Error deleting ministry. Please try again.');
    }
  };

  const handleCancel=()=> {
    setFormData({
      title: '',
      description: '',
      leader_name: '',
      leader_role: '',
      age_group: 'All Ages',
      is_active: true
    });
    setFeatures([]);
    setNewFeature('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddFeature=()=> {
    if (newFeature.trim()) {
      setFeatures([...features,{feature_text: newFeature.trim(),display_order: features.length}]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature=(index)=> {
    setFeatures(features.filter((_,i)=> i !==index));
  };

  const handleMoveFeature=(index,direction)=> {
    const newFeatures=[...features];
    const targetIndex=direction==='up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= features.length) return;
    [newFeatures[index],newFeatures[targetIndex]]=[newFeatures[targetIndex],newFeatures[index]];
    setFeatures(newFeatures);
  };

  const handleMoveMinistry=async (id,direction)=> {
    const index=ministries.findIndex(m=> m.id===id);
    const targetIndex=direction==='up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= ministries.length) return;

    try {
      const ministry1=ministries[index];
      const ministry2=ministries[targetIndex];

      await supabase
        .from('ministries_portal123')
        .update({display_order: ministry2.display_order})
        .eq('id',ministry1.id);

      await supabase
        .from('ministries_portal123')
        .update({display_order: ministry1.display_order})
        .eq('id',ministry2.id);

      fetchMinistries();
    } catch (error) {
      console.error('Error reordering ministries:',error);
      alert('Error reordering ministries. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-text-primary">Manage Opportunities</h2>
        <button
          onClick={()=> setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>New Opportunity</span>
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
                  placeholder="Opportunity name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Opportunities *</label>
                <textarea
                  value={formData.description}
                  onChange={(e)=> setFormData({...formData,description: e.target.value})}
                  required
                  rows={8}
                  className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter opportunities details..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e)=> setFormData({...formData,is_active: e.target.checked})}
                  className="w-4 h-4 text-primary focus:ring-primary border-accent-dark rounded"
                />
                <label htmlFor="is_active" className="text-sm text-text-primary">Active (visible to public)</label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-accent-dark rounded-lg text-text-primary hover:bg-accent transition-colors inline-flex items-center space-x-2"
                >
                  <SafeIcon icon={FiX} className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center space-x-2 disabled:opacity-50"
                >
                  <SafeIcon icon={FiSave} className="h-4 w-4" />
                  <span>{editingId ? 'Update' : 'Create'} Opportunity</span>
                </button>
              </div>
            </form>
          </motion.div>
        </LoadingTransition>
      )}

      <LoadingTransition isLoading={loading} skeleton={<SkeletonTable />}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {ministries.length===0 ? (
            <div className="p-12 text-center">
              <SafeIcon icon={FiHeart} className="h-12 w-12 text-text-light mx-auto mb-3" />
              <p className="text-text-light">No opportunities yet. Create your first one!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">Leader</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">Age Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-accent">
                  {ministries.map((ministry,index)=> (
                    <tr key={ministry.id} className="hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-1">
                          <button
                            onClick={()=> handleMoveMinistry(ministry.id,'up')}
                            disabled={index===0}
                            className="p-1 text-text-light hover:text-text-primary disabled:opacity-30"
                            title="Move up"
                          >
                            <SafeIcon icon={FiChevronUp} className="h-4 w-4" />
                          </button>
                          <button
                            onClick={()=> handleMoveMinistry(ministry.id,'down')}
                            disabled={index===ministries.length - 1}
                            className="p-1 text-text-light hover:text-text-primary disabled:opacity-30"
                            title="Move down"
                          >
                            <SafeIcon icon={FiChevronDown} className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-text-primary">{ministry.title}</div>
                        <div className="text-sm text-text-light truncate max-w-xs">{ministry.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-text-primary">{ministry.leader_name || '-'}</div>
                        {ministry.leader_role && (
                          <div className="text-xs text-text-light">{ministry.leader_role}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-text-primary">{ministry.age_group}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ministry.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {ministry.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={()=> handleEdit(ministry)}
                          className="text-primary hover:text-primary-dark"
                        >
                          <SafeIcon icon={FiEdit} className="h-4 w-4" />
                        </button>
                        <button
                          onClick={()=> handleDelete(ministry.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </LoadingTransition>
    </div>
  );
};

export default AdminMinistries;
