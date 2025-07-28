import React,{useState,useEffect} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const {FiPlus,FiEdit,FiTrash2,FiSave,FiX,FiBookOpen,FiTag,FiLink,FiAlertCircle,FiCheckCircle,FiUpload,FiDownload,FiRefreshCw}=FiIcons;

const AdminResources=()=> {
const [resources,setResources]=useState([]);
const [categories,setCategories]=useState([]);
const [loading,setLoading]=useState(true);
const [editingId,setEditingId]=useState(null);
const [showForm,setShowForm]=useState(false);
const [showCategoryForm,setShowCategoryForm]=useState(false);
const [showBulkImport,setShowBulkImport]=useState(false);
const [importText,setImportText]=useState('');
const [importing,setImporting]=useState(false);
const [cleaning,setCleaning]=useState(false);
const [error,setError]=useState(null);
const [success,setSuccess]=useState('');
const [formData,setFormData]=useState({
title: '',
author: '',
description: '',
amazon_link: '',
category_id: '',
image_url: ''
});
const [categoryFormData,setCategoryFormData]=useState({
name: '',
description: '',
is_link_group: false
});

useEffect(()=> {
fetchResources();
fetchCategories();
},[]);

const fetchResources=async ()=> {
try {
setError(null);
const {data,error}=await supabase
.from('resources_portal123')
.select('*')
.order('created_at',{ascending: false});

if (error) throw error;
setResources(data || []);
console.log('✅ Resources fetched:',data?.length || 0);
} catch (error) {
console.error('❌ Error fetching resources:',error);
setError('Failed to fetch resources: ' + error.message);
} finally {
setLoading(false);
}
};

const fetchCategories=async ()=> {
try {
const {data,error}=await supabase
.from('resource_categories_portal123')
.select('*')
.order('name',{ascending: true});

if (error) throw error;
setCategories(data || []);
console.log('✅ Categories fetched:',data?.length || 0);
} catch (error) {
console.error('❌ Error fetching categories:',error);
setError('Failed to fetch categories: ' + error.message);
}
};

// Clean up existing descriptions that contain "Available from multiple sources"
const cleanExistingDescriptions=async ()=> {
setCleaning(true);
setError(null);
setSuccess('');

try {
const {data: allResources,error: fetchError}=await supabase
.from('resources_portal123')
.select('*');

if (fetchError) throw fetchError;

const textToRemove=[
'Available from multiple sources',
'Available from multiple sources.',
'available from multiple sources',
'available from multiple sources.',
'AVAILABLE FROM MULTIPLE SOURCES',
'AVAILABLE FROM MULTIPLE SOURCES.'
];

let cleanedCount=0;

for (const resource of allResources) {
if (resource.description) {
let cleanDescription=resource.description.trim();
let wasModified=false;

textToRemove.forEach(text=> {
if (cleanDescription.includes(text)) {
cleanDescription=cleanDescription.replace(text,'').trim();
wasModified=true;
}
});

// If the description is now empty or just punctuation, set to empty string (not null)
if (!cleanDescription || cleanDescription.match(/^[.,!?;:\s]*$/)) {
cleanDescription=''; // Use empty string instead of null
}

if (wasModified) {
const {error: updateError}=await supabase
.from('resources_portal123')
.update({description: cleanDescription})
.eq('id',resource.id);

if (updateError) {
console.error(`Error updating resource ${resource.id}:`,updateError);
} else {
cleanedCount++;
}
}
}
}

setSuccess(`Successfully cleaned ${cleanedCount} resource descriptions!`);
fetchResources(); // Refresh the list
} catch (error) {
console.error('❌ Error cleaning descriptions:',error);
setError('Error cleaning descriptions: ' + error.message);
} finally {
setCleaning(false);
}
};

const parseResourcesFile=(text)=> {
const resources=[];
const entries=text.split(/\n\s*\n\s*\n/).filter(entry=> entry.trim() !=='');

for (const entry of entries) {
const lines=entry.split('\n').map(line=> line.trim()).filter(line=> line !=='');
let currentResource={
category: '',
title: '',
author: '',
links: []
};

let collectingLinks=false;

for (const line of lines) {
if (line.startsWith('Category:')) {
currentResource.category=line.replace('Category:','').trim();
} else if (line.startsWith('Title:')) {
currentResource.title=line.replace('Title:','').trim();
} else if (line.startsWith('Author:')) {
currentResource.author=line.replace('Author:','').trim();
} else if (line==='Links to Books:') {
collectingLinks=true;
} else if (collectingLinks && line.startsWith('http')) {
currentResource.links.push(line.trim());
}
}

if (currentResource.title && currentResource.links.length > 0) {
resources.push(currentResource);
}
}

return resources;
};

const handleBulkImport=async ()=> {
if (!importText.trim()) {
alert('Please paste your book recommendations text first.');
return;
}

setImporting(true);
try {
const parsedResources=parseResourcesFile(importText);

if (parsedResources.length===0) {
throw new Error('No valid book recommendations found in the file. Please check the format.');
}

// Show preview and confirm
const confirmMessage=`Found ${parsedResources.length} book recommendations. Import them all?`;
if (!confirm(confirmMessage)) {
setImporting(false);
return;
}

// Process each resource - create ONE resource per book with ALL links combined
for (const resource of parsedResources) {
// Find or create category
let categoryId=null;
if (resource.category) {
let category=categories.find(c=> 
c.name.toLowerCase()===resource.category.toLowerCase()
);

if (!category) {
// Create new category
const {data: newCategory,error: categoryError}=await supabase
.from('resource_categories_portal123')
.insert([{
name: resource.category,
description: `Books about ${resource.category.toLowerCase()}`,
is_link_group: false
}])
.select()
.single();

if (categoryError) {
console.warn('Error creating category:',categoryError);
} else {
category=newCategory;
categories.push(newCategory); // Add to local categories
}
}

categoryId=category?.id || null;
}

// Check if this resource already exists (by title and author)
const existingResource=resources.find(r=> 
r.title.toLowerCase()===resource.title.toLowerCase() && 
(r.author || '').toLowerCase()===(resource.author || '').toLowerCase()
);

if (existingResource) {
// Update existing resource by adding new links
const existingLinks=existingResource.amazon_link.split('\n').filter(link=> link.trim());
const newLinks=resource.links.filter(link=> !existingLinks.includes(link));

if (newLinks.length > 0) {
const allLinks=[...existingLinks,...newLinks].join('\n');

const {error: updateError}=await supabase
.from('resources_portal123')
.update({amazon_link: allLinks})
.eq('id',existingResource.id);

if (updateError) {
console.warn(`Error updating resource "${resource.title}":`,updateError);
}
}
} else {
// Create new resource with ALL links combined into one field
const allLinks=resource.links.join('\n'); // Store all links separated by newlines

const resourceData={
title: resource.title,
author: resource.author,
description: '', // Use empty string instead of null
amazon_link: allLinks, // Store all links in this field
category_id: categoryId
};

const {error: insertError}=await supabase
.from('resources_portal123')
.insert([resourceData]);

if (insertError) {
console.warn(`Error inserting resource "${resource.title}":`,insertError);
}
}
}

setSuccess(`Successfully imported ${parsedResources.length} book recommendations!`);
setImportText('');
setShowBulkImport(false);
fetchResources();
fetchCategories(); // Refresh categories too
} catch (error) {
console.error('❌ Error importing resources:',error);
setError('Error importing resources: ' + error.message);
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

const exportResources=()=> {
if (resources.length===0) {
alert('No resources to export.');
return;
}

let exportText='';

resources.forEach((resource,index)=> {
const categoryName=getCategoryName(resource.category_id);

exportText +=`Category: ${categoryName}\n`;
exportText +=`Title: ${resource.title}\n`;
if (resource.author) {
exportText +=`Author: ${resource.author}\n`;
}
exportText +=`Links to Books:\n\n`;

// Handle multiple links
const links=resource.amazon_link.split('\n').filter(link=> link.trim());
links.forEach(link=> {
exportText +=`${link.trim()}\n`;
});

if (index < resources.length - 1) {
exportText +='\n\n\n';
}
});

const blob=new Blob([exportText],{type: 'text/plain'});
const url=URL.createObjectURL(blob);
const a=document.createElement('a');
a.href=url;
a.download='book-recommendations.txt';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
};

const getWebsiteName=(url)=> {
try {
const domain=new URL(url).hostname.toLowerCase();
if (domain.includes('amazon')) return 'Amazon';
if (domain.includes('barnesandnoble')) return 'Barnes & Noble';
if (domain.includes('christianbook')) return 'Christian Book';
if (domain.includes('goodreads')) return 'Goodreads';
if (domain.includes('bookdepository')) return 'Book Depository';
if (domain.includes('target')) return 'Target';
if (domain.includes('walmart')) return 'Walmart';
return 'Website';
} catch {
return 'Website';
}
};

const handleSubmit=async (e)=> {
e.preventDefault();
setLoading(true);
setError(null);
setSuccess('');

try {
const resourceData={
title: formData.title,
author: formData.author,
description: formData.description.trim() || '', // Ensure empty string instead of null
amazon_link: formData.amazon_link,
category_id: formData.category_id || null,
image_url: formData.image_url
};

if (editingId) {
const {error}=await supabase
.from('resources_portal123')
.update(resourceData)
.eq('id',editingId);

if (error) throw error;
setSuccess('Resource updated successfully!');
} else {
const {error}=await supabase
.from('resources_portal123')
.insert([resourceData]);

if (error) throw error;
setSuccess('Resource created successfully!');
}

setFormData({
title: '',
author: '',
description: '',
amazon_link: '',
category_id: '',
image_url: ''
});
setEditingId(null);
setShowForm(false);
fetchResources();
} catch (error) {
console.error('❌ Error saving resource:',error);
setError('Error saving resource: ' + error.message);
} finally {
setLoading(false);
}
};

const handleCategorySubmit=async (e)=> {
e.preventDefault();
setLoading(true);
setError(null);
setSuccess('');

try {
const {error}=await supabase
.from('resource_categories_portal123')
.insert([categoryFormData]);

if (error) throw error;

setSuccess('Category created successfully!');
setCategoryFormData({
name: '',
description: '',
is_link_group: false
});
setShowCategoryForm(false);
fetchCategories();
} catch (error) {
console.error('❌ Error saving category:',error);
setError('Error saving category: ' + error.message);
} finally {
setLoading(false);
}
};

const handleEdit=(resource)=> {
setFormData({
title: resource.title,
author: resource.author || '',
description: resource.description || '', // Ensure empty string instead of null
amazon_link: resource.amazon_link,
category_id: resource.category_id || '',
image_url: resource.image_url || ''
});
setEditingId(resource.id);
setShowForm(true);
setError(null);
setSuccess('');
};

const handleDelete=async (id)=> {
if (!confirm('Are you sure you want to delete this resource?')) return;

try {
const {error}=await supabase
.from('resources_portal123')
.delete()
.eq('id',id);

if (error) throw error;
setSuccess('Resource deleted successfully!');
fetchResources();
} catch (error) {
console.error('❌ Error deleting resource:',error);
setError('Error deleting resource: ' + error.message);
}
};

const handleDeleteCategory=async (id)=> {
if (!confirm('Are you sure you want to delete this category? Resources in this category will become uncategorized.')) return;

try {
const {error}=await supabase
.from('resource_categories_portal123')
.delete()
.eq('id',id);

if (error) throw error;
setSuccess('Category deleted successfully!');
fetchCategories();
fetchResources(); // Refresh resources to update display
} catch (error) {
console.error('❌ Error deleting category:',error);
setError('Error deleting category: ' + error.message);
}
};

const handleCancel=()=> {
setFormData({
title: '',
author: '',
description: '',
amazon_link: '',
category_id: '',
image_url: ''
});
setEditingId(null);
setShowForm(false);
setError(null);
setSuccess('');
};

const getCategoryName=(categoryId)=> {
const category=categories.find(c=> c.id===categoryId);
return category ? category.name : 'Uncategorized';
};

const getCategoryType=(categoryId)=> {
const category=categories.find(c=> c.id===categoryId);
return category ? (category.is_link_group ? 'Link Group' : 'Book Category') : 'Book Category';
};

const getCleanDescription=(description)=> {
if (!description) return '';

const cleanDesc=description.trim();

const textToRemove=[
'Available from multiple sources',
'Available from multiple sources.',
'available from multiple sources',
'available from multiple sources.',
'AVAILABLE FROM MULTIPLE SOURCES',
'AVAILABLE FROM MULTIPLE SOURCES.'
];

let cleanDescription=cleanDesc;
textToRemove.forEach(text=> {
cleanDescription=cleanDescription.replace(text,'').trim();
});

// If the description is now empty or just punctuation, return empty string
if (!cleanDescription || cleanDescription.match(/^[.,!?;:\s]*$/)) {
return '';
}

return cleanDescription;
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
<h2 className="text-2xl font-bold text-secondary font-inter">
Manage Resources
</h2>
<div className="space-x-2">
<button
onClick={cleanExistingDescriptions}
disabled={cleaning}
className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors inline-flex items-center space-x-2 font-inter disabled:opacity-50"
>
<SafeIcon icon={FiRefreshCw} className="h-4 w-4" />
<span>{cleaning ? 'Cleaning...' : 'Clean Descriptions'}</span>
</button>
<button
onClick={()=> setShowBulkImport(true)}
className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors inline-flex items-center space-x-2 font-inter"
>
<SafeIcon icon={FiUpload} className="h-4 w-4" />
<span>Bulk Import</span>
</button>
{resources.length > 0 && (
<button
onClick={exportResources}
className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center space-x-2 font-inter"
>
<SafeIcon icon={FiDownload} className="h-4 w-4" />
<span>Export</span>
</button>
)}
<button
onClick={()=> setShowCategoryForm(true)}
className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary-dark transition-colors inline-flex items-center space-x-2 font-inter"
>
<SafeIcon icon={FiTag} className="h-4 w-4" />
<span>New Category</span>
</button>
<button
onClick={()=> setShowForm(true)}
className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors inline-flex items-center space-x-2 font-inter"
>
<SafeIcon icon={FiPlus} className="h-4 w-4" />
<span>New Resource</span>
</button>
</div>
</div>

{/* Bulk Import Modal */}
{showBulkImport && (
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
className="bg-white rounded-lg shadow-md p-6"
>
<h3 className="text-lg font-semibold text-secondary mb-4 font-inter">
Bulk Import Book Recommendations
</h3>

<div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
<h4 className="font-semibold text-blue-800 mb-2 font-inter">Expected Format</h4>
<p className="text-blue-700 text-sm font-inter mb-3">
Upload a .txt file with book recommendations in this format:
</p>
<pre className="text-xs text-blue-800 bg-blue-100 p-3 rounded font-mono overflow-x-auto">
{`Category: SUFFERING & HEALING
Title: The Problem of Pain
Author: C.S. Lewis
Links to Books:

https://www.amazon.com/Problem-Pain-C-S-Lewis/dp/0060652969
https://www.barnesandnoble.com/w/the-problem-of-pain-c-s-lewis/1100421588
https://www.christianbook.com/problem-pain-s-lewis/s-lewis/9780060652968


Category: CHRISTIAN LIVING
Title: Mere Christianity
Author: C.S. Lewis
Links to Books:

https://www.amazon.com/Mere-Christianity-C-S-Lewis/dp/0060652926`}
</pre>
</div>

<div className="space-y-4">
<div>
<label className="block text-sm font-medium text-secondary mb-2 font-inter">
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
<label className="block text-sm font-medium text-secondary mb-2 font-inter">
Or Paste Text Here
</label>
<textarea
value={importText}
onChange={(e)=> setImportText(e.target.value)}
rows={10}
className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-inter"
placeholder="Paste your book recommendations here using the format shown above..."
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
onClick={()=> {
setShowBulkImport(false);
setImportText('');
}}
className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors inline-flex items-center space-x-2 font-inter"
>
<SafeIcon icon={FiX} className="h-4 w-4" />
<span>Cancel</span>
</button>
</div>
</div>
</motion.div>
)}

{/* Info Box */}
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
<div className="flex items-start space-x-3">
<SafeIcon icon={FiBookOpen} className="h-5 w-5 text-blue-600 mt-0.5" />
<div>
<h4 className="font-semibold text-blue-800 mb-1 font-inter">
Resource Categories
</h4>
<p className="text-blue-700 text-sm font-inter">
<strong>Book Categories:</strong> For individual books with multiple purchase links<br />
<strong>Link Groups:</strong> For collections of website links and online resources
</p>
</div>
</div>
</div>

{/* Categories Management */}
{categories.length > 0 && (
<div className="bg-white rounded-lg shadow-md p-6">
<h3 className="text-lg font-semibold text-secondary mb-4 font-inter">
Categories ({categories.length})
</h3>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{categories.map((category)=> (
<div
key={category.id}
className="border border-accent-dark rounded-lg p-4"
>
<div className="flex justify-between items-start mb-2">
<div className="flex-1">
<div className="flex items-center space-x-2 mb-1">
<h4 className="font-semibold text-secondary font-inter">{category.name}</h4>
<SafeIcon
icon={category.is_link_group ? FiLink : FiBookOpen}
className="h-4 w-4 text-primary"
/>
</div>
<span
className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
category.is_link_group
? 'bg-blue-100 text-blue-800'
: 'bg-green-100 text-green-800'
} font-inter`}
>
{category.is_link_group ? 'Link Group' : 'Book Category'}
</span>
</div>
<button
onClick={()=> handleDeleteCategory(category.id)}
className="text-red-500 hover:text-red-700 ml-2"
>
<SafeIcon icon={FiTrash2} className="h-4 w-4" />
</button>
</div>
{category.description && (
<p className="text-sm text-secondary-light font-inter mt-2">{category.description}</p>
)}
</div>
))}
</div>
</div>
)}

{/* Category Form */}
{showCategoryForm && (
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
className="bg-white rounded-lg shadow-md p-6"
>
<h3 className="text-lg font-semibold text-secondary mb-4 font-inter">
Create New Category
</h3>
<form onSubmit={handleCategorySubmit} className="space-y-4">
<div>
<label className="block text-sm font-medium text-secondary mb-2 font-inter">
Category Name *
</label>
<input
type="text"
value={categoryFormData.name}
onChange={(e)=> setCategoryFormData({...categoryFormData,name: e.target.value})}
required
className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
placeholder="e.g., Biblical Studies, Useful Links"
/>
</div>

<div>
<label className="block text-sm font-medium text-secondary mb-2 font-inter">
Category Type *
</label>
<div className="space-y-2">
<label className="flex items-center space-x-3 cursor-pointer">
<input
type="radio"
name="category_type"
checked={!categoryFormData.is_link_group}
onChange={()=> setCategoryFormData({...categoryFormData,is_link_group: false})}
className="w-4 h-4 text-primary focus:ring-primary"
/>
<div className="flex items-center space-x-2">
<SafeIcon icon={FiBookOpen} className="h-4 w-4 text-green-600" />
<span className="text-sm text-secondary font-inter">Book Category (for individual books)</span>
</div>
</label>
<label className="flex items-center space-x-3 cursor-pointer">
<input
type="radio"
name="category_type"
checked={categoryFormData.is_link_group}
onChange={()=> setCategoryFormData({...categoryFormData,is_link_group: true})}
className="w-4 h-4 text-primary focus:ring-primary"
/>
<div className="flex items-center space-x-2">
<SafeIcon icon={FiLink} className="h-4 w-4 text-blue-600" />
<span className="text-sm text-secondary font-inter">Link Group (for website collections)</span>
</div>
</label>
</div>
</div>

<div>
<label className="block text-sm font-medium text-secondary mb-2 font-inter">
Description
</label>
<textarea
value={categoryFormData.description}
onChange={(e)=> setCategoryFormData({...categoryFormData,description: e.target.value})}
rows={3}
className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-inter"
placeholder="Brief description of this category"
/>
</div>

<div className="flex space-x-4">
<button
type="submit"
disabled={loading}
className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 inline-flex items-center space-x-2 font-inter"
>
<SafeIcon icon={FiSave} className="h-4 w-4" />
<span>Create Category</span>
</button>
<button
type="button"
onClick={()=> setShowCategoryForm(false)}
className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors inline-flex items-center space-x-2 font-inter"
>
<SafeIcon icon={FiX} className="h-4 w-4" />
<span>Cancel</span>
</button>
</div>
</form>
</motion.div>
)}

{/* Resource Form */}
{showForm && (
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
className="bg-white rounded-lg shadow-md p-6"
>
<form onSubmit={handleSubmit} className="space-y-4">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label className="block text-sm font-medium text-secondary mb-2 font-inter">
Title *
</label>
<input
type="text"
value={formData.title}
onChange={(e)=> setFormData({...formData,title: e.target.value})}
required
className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
placeholder="Book title or link name"
/>
</div>
<div>
<label className="block text-sm font-medium text-secondary mb-2 font-inter">
Author
</label>
<input
type="text"
value={formData.author}
onChange={(e)=> setFormData({...formData,author: e.target.value})}
className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
placeholder="Author name (for books)"
/>
</div>
</div>

<div>
<label className="block text-sm font-medium text-secondary mb-2 font-inter">
Category
</label>
<select
value={formData.category_id}
onChange={(e)=> setFormData({...formData,category_id: e.target.value})}
className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
>
<option value="">Uncategorized</option>
{categories.map((category)=> (
<option key={category.id} value={category.id}>
{category.name} {category.is_link_group ? '(Link Group)' : '(Books)'}
</option>
))}
</select>
</div>

<div>
<label className="block text-sm font-medium text-secondary mb-2 font-inter">
Description
</label>
<textarea
value={formData.description}
onChange={(e)=> setFormData({...formData,description: e.target.value})}
rows={4}
className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-inter"
placeholder="Brief description (optional)"
/>
</div>

<div>
<label className="block text-sm font-medium text-secondary mb-2 font-inter">
Links * <span className="text-sm text-gray-500">(one per line for multiple links)</span>
</label>
<textarea
value={formData.amazon_link}
onChange={(e)=> setFormData({...formData,amazon_link: e.target.value})}
required
rows={4}
className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-inter"
placeholder={`https://www.amazon.com/dp/...
https://www.barnesandnoble.com/...
https://www.christianbook.com/...`}
/>
</div>

<div>
<label className="block text-sm font-medium text-secondary mb-2 font-inter">
Image URL
</label>
<input
type="url"
value={formData.image_url}
onChange={(e)=> setFormData({...formData,image_url: e.target.value})}
className="w-full p-3 border border-accent-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-inter"
placeholder="https://example.com/image.jpg (optional)"
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

{/* Resources List */}
<div className="bg-white rounded-lg shadow-md overflow-hidden">
{loading ? (
<div className="p-8 text-center">
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
<p className="text-secondary font-inter">Loading...</p>
</div>
) : resources.length===0 ? (
<div className="p-8 text-center">
<SafeIcon icon={FiBookOpen} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
<p className="text-secondary font-inter">No resources yet. Create your first resource above!</p>
</div>
) : (
<div className="divide-y divide-accent">
{resources.map((resource)=> {
// Parse multiple links
const links=resource.amazon_link.split('\n').filter(link=> link.trim());
const cleanDescription=getCleanDescription(resource.description);

return (
<div key={resource.id} className="p-6">
<div className="flex justify-between items-start">
<div className="flex-1">
<div className="flex items-center space-x-3 mb-2">
<h3 className="text-lg font-semibold text-secondary font-inter">
{resource.title}
</h3>
{resource.category_id && (
<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-white font-inter">
<SafeIcon icon={FiTag} className="h-3 w-3 mr-1" />
{getCategoryName(resource.category_id)}
</span>
)}
<span
className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
categories.find(c=> c.id===resource.category_id)?.is_link_group
? 'bg-blue-100 text-blue-800'
: 'bg-green-100 text-green-800'
} font-inter`}
>
{getCategoryType(resource.category_id)}
</span>
</div>

{resource.author && (
<p className="text-sm text-secondary-light font-inter mb-2">
by {resource.author}
</p>
)}

{cleanDescription && (
<p className="text-secondary font-inter text-sm mb-3">
{cleanDescription}
</p>
)}

{/* Multiple Link Buttons - Small and Green */}
<div className="flex flex-wrap gap-1 mb-3">
{links.map((link,index)=> {
const websiteName=getWebsiteName(link);
return (
<a
key={index}
href={link}
target="_blank"
rel="noopener noreferrer"
className="bg-[#83A682] hover:bg-[#6d8a6b] text-white px-2 py-1 rounded text-xs font-medium transition-colors font-inter"
>
{websiteName}
</a>
);
})}
</div>

{resource.image_url && (
<span className="text-green-600 text-sm font-inter">
✓ Has image
</span>
)}
</div>

<div className="flex space-x-2 ml-4">
<button
onClick={()=> handleEdit(resource)}
className="p-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
>
<SafeIcon icon={FiEdit} className="h-4 w-4" />
</button>
<button
onClick={()=> handleDelete(resource.id)}
className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
>
<SafeIcon icon={FiTrash2} className="h-4 w-4" />
</button>
</div>
</div>
</div>
);
})}
</div>
)}
</div>
</div>
);
};

export default AdminResources;