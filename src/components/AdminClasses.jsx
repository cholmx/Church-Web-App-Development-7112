import React,{useState} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import RichTextEditor from './RichTextEditor';
import {SkeletonTable,SkeletonForm,LoadingTransition} from './LoadingSkeletons';
import { toTitleCase } from '../utils/textFormat';
import { useSupabaseCrud } from '../hooks/useSupabaseCrud';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import { useToast } from '../hooks/useToast';
import { useConfirm } from '../hooks/useConfirm';
import AddToCalendarButton from './AddToCalendarButton';
import { formatDate, formatTime } from '../utils/dateFormat';

const {FiPlus,FiEdit,FiTrash2,FiSave,FiX,FiExternalLink}=FiIcons;

const emptyForm={title: '',details: '',link: '',start_date: '',start_time: '',end_time: '',location: ''};

const AdminClasses=()=> {
  const toast=useToast();
  const confirm=useConfirm();
  const {items: classes,loading,insertItem,updateItem,deleteItem}=useSupabaseCrud(
    'classes_portal123',
    {orderBy: 'created_at',ascending: false}
  );
  const [saving,setSaving]=useState(false);
  const [editingId,setEditingId]=useState(null);
  const [showForm,setShowForm]=useState(false);
  const [formData,setFormData]=useState(emptyForm);

  const handleSubmit=async (e)=> {
    e.preventDefault();
    setSaving(true);
    try {
      const classData={
        title: toTitleCase(formData.title),
        details: formData.details,
        link: formData.link,
        start_date: formData.start_date || null,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        location: formData.location || null
      };

      if (editingId) {
        await updateItem(editingId,classData);
      } else {
        await insertItem(classData);
      }
      handleCancel();
    } catch (error) {
      console.error('Error saving class:',error);
      toast.error('Error saving class. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit=(classItem)=> {
    setFormData({
      title: classItem.title,
      details: classItem.details,
      link: classItem.link || '',
      start_date: classItem.start_date || '',
      start_time: classItem.start_time ? classItem.start_time.slice(0,5) : '',
      end_time: classItem.end_time ? classItem.end_time.slice(0,5) : '',
      location: classItem.location || ''
    });
    setEditingId(classItem.id);
    setShowForm(true);
  };

  const handleDelete=async (id)=> {
    if (!(await confirm('Are you sure you want to delete this class?'))) return;
    try {
      await deleteItem(id);
    } catch (error) {
      console.error('Error deleting class:',error);
      toast.error('Error deleting class. Please try again.');
    }
  };

  const handleCancel=()=> {
    setFormData(emptyForm);
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
          className="admin-btn-primary"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>New Class</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <LoadingTransition isLoading={saving && editingId} skeleton={<SkeletonForm />}>
          <motion.div
            initial={{opacity: 0,y: 20}}
            animate={{opacity: 1,y: 0}}
            className="admin-card"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="admin-label">Class Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e)=> setFormData({...formData,title: e.target.value})}
                  required
                  className="admin-input"
                  placeholder="Class title"
                />
              </div>
              <div>
                <label className="admin-label">Class Details *</label>
                <RichTextEditor
                  value={formData.details}
                  onChange={(e)=> setFormData({...formData,details: e.target.value})}
                  placeholder="Enter class description,schedule,requirements,etc..."
                  rows={8}
                />
              </div>
              <div>
                <label className="admin-label">Registration Link</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e)=> setFormData({...formData,link: e.target.value})}
                  className="admin-input"
                  placeholder="https://example.com/register"
                />
                <p className="text-sm text-text-light mt-1">
                  Optional: Add a link to external registration or more information
                </p>
              </div>
              <div className="border-t border-accent pt-4">
                <p className="text-sm text-text-light mb-3">
                  Optional: fill in a date to show a structured date on the page and let visitors add this class to their calendar.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="admin-label">Date</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e)=> setFormData({...formData,start_date: e.target.value})}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Start Time</label>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e)=> setFormData({...formData,start_time: e.target.value})}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label">End Time</label>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e)=> setFormData({...formData,end_time: e.target.value})}
                      className="admin-input"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="admin-label">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e)=> setFormData({...formData,location: e.target.value})}
                    className="admin-input"
                    placeholder="e.g. Room 101"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-btn-primary"
                >
                  <SafeIcon icon={FiSave} className="h-4 w-4" />
                  <span>{editingId ? 'Update' : 'Create'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="admin-btn-secondary"
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
        <div className="bg-white rounded-2xl shadow-modern overflow-hidden">
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
                      {classItem.start_date && (
                        <p className="text-sm text-text-light mb-2">
                          {formatDate(classItem.start_date)}
                          {classItem.start_time && ` at ${formatTime(classItem.start_time)}`}
                          {classItem.location && ` · ${classItem.location}`}
                        </p>
                      )}
                      <div
                        className="text-text-primary text-sm mb-2 prose prose-sm max-w-none rendered-content"
                        dangerouslySetInnerHTML={{__html: sanitizeHtml(classItem.details)}}
                      />
                      <div className="flex flex-wrap items-center gap-4 mb-2">
                        {classItem.link && (
                          <a
                            href={classItem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-primary hover:text-primary-dark text-sm underline"
                          >
                            <SafeIcon icon={FiExternalLink} className="h-3 w-3" />
                            <span>Registration Link</span>
                          </a>
                        )}
                        <AddToCalendarButton
                          title={classItem.title}
                          description={classItem.details}
                          date={classItem.start_date}
                          startTime={classItem.start_time}
                          endTime={classItem.end_time}
                          location={classItem.location}
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={()=> handleEdit(classItem)}
                        className="admin-btn-edit"
                      >
                        <SafeIcon icon={FiEdit} className="h-4 w-4" />
                      </button>
                      <button
                        onClick={()=> handleDelete(classItem.id)}
                        className="admin-btn-danger"
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
