// Simple contact form handler that logs to console and shows success
export const submitContactForm = async (formData) => {
  // Log the contact form data (in a real app, this would go to an email service)
  console.log('Contact Form Submission:', formData);
  
  // Store in localStorage for demo purposes
  const contacts = JSON.parse(localStorage.getItem('contact_messages_portal123') || '[]');
  const newContact = {
    ...formData,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  contacts.push(newContact);
  localStorage.setItem('contact_messages_portal123', JSON.stringify(contacts));
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { data: newContact, error: null };
};

export const submitRealmSignup = async (formData) => {
  // Log the realm signup data
  console.log('Realm Signup Submission:', formData);
  
  // Store in localStorage for demo purposes
  const signups = JSON.parse(localStorage.getItem('realm_signups_portal123') || '[]');
  const newSignup = {
    ...formData,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  signups.push(newSignup);
  localStorage.setItem('realm_signups_portal123', JSON.stringify(signups));
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { data: newSignup, error: null };
};

export const submitTableGroupSignup = async (formData) => {
  // Log the table group signup data
  console.log('Table Group Signup Submission:', formData);
  
  // Store in localStorage for demo purposes
  const signups = JSON.parse(localStorage.getItem('table_group_signups_portal123') || '[]');
  const newSignup = {
    ...formData,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  signups.push(newSignup);
  localStorage.setItem('table_group_signups_portal123', JSON.stringify(signups));
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { data: newSignup, error: null };
};