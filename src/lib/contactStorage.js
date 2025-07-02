import { sendEmail } from './emailService';

// Contact form handler that sends email and stores locally
export const submitContactForm = async (formData) => {
  try {
    // Send email
    const emailResult = await sendEmail(formData, 'contact');
    
    if (!emailResult.success) {
      throw new Error(emailResult.error);
    }

    // Store in localStorage for demo purposes
    const contacts = JSON.parse(localStorage.getItem('contact_messages_portal123') || '[]');
    const newContact = {
      ...formData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    contacts.push(newContact);
    localStorage.setItem('contact_messages_portal123', JSON.stringify(contacts));

    return { data: newContact, error: null };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { data: null, error: error.message };
  }
};

export const submitRealmSignup = async (formData) => {
  try {
    // Send email
    const emailResult = await sendEmail(formData, 'realm');
    
    if (!emailResult.success) {
      throw new Error(emailResult.error);
    }

    // Store in localStorage for demo purposes
    const signups = JSON.parse(localStorage.getItem('realm_signups_portal123') || '[]');
    const newSignup = {
      ...formData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    signups.push(newSignup);
    localStorage.setItem('realm_signups_portal123', JSON.stringify(signups));

    return { data: newSignup, error: null };
  } catch (error) {
    console.error('Error submitting realm signup:', error);
    return { data: null, error: error.message };
  }
};

export const submitTableGroupSignup = async (formData) => {
  try {
    // Send email
    const emailResult = await sendEmail(formData, 'table_group');
    
    if (!emailResult.success) {
      throw new Error(emailResult.error);
    }

    // Store in localStorage for demo purposes
    const signups = JSON.parse(localStorage.getItem('table_group_signups_portal123') || '[]');
    const newSignup = {
      ...formData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    signups.push(newSignup);
    localStorage.setItem('table_group_signups_portal123', JSON.stringify(signups));

    return { data: newSignup, error: null };
  } catch (error) {
    console.error('Error submitting table group signup:', error);
    return { data: null, error: error.message };
  }
};