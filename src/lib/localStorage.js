// Local storage utility for church portal data
class LocalStorageDB {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    // Initialize with sample data if not exists
    if (!localStorage.getItem('announcements_portal123')) {
      const sampleAnnouncements = [
        {
          id: '1',
          title: 'Welcome to Upper Room Fellowship Portal',
          content: 'We are excited to launch our new church portal! Here you can stay updated with announcements, listen to sermons, and connect with our community.',
          author: 'Pastor John Smith',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Christmas Eve Service',
          content: 'Join us for our special Christmas Eve candlelight service at 6:00 PM. This will be a beautiful time of worship and celebration of Jesus\' birth.',
          author: 'Church Office',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      localStorage.setItem('announcements_portal123', JSON.stringify(sampleAnnouncements));
    }

    if (!localStorage.getItem('sermons_portal123')) {
      const sampleSermons = [
        {
          id: '1',
          title: 'The Light of Hope',
          speaker: 'Pastor John Smith',
          sermon_date: '2024-12-15',
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          summary: '<p>In this powerful message, we explore how Jesus is the light that shines in our darkest moments. No matter what challenges we face, His light guides us forward.</p><p>Key points covered:</p><ul><li>Jesus as the Light of the World</li><li>Finding hope in difficult times</li><li>Sharing His light with others</li></ul>',
          discussion_questions: '<p>Use these questions for your Table Group discussions:</p><ol><li>How has Jesus been a light in your life during dark times?</li><li>What are some practical ways we can share His light with others?</li><li>How can we maintain hope when facing challenges?</li></ol>',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Walking in Faith',
          speaker: 'Pastor Sarah Johnson',
          sermon_date: '2024-12-08',
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          summary: '<p>Faith is not just believing - it\'s acting on what we believe. This message challenges us to take steps of faith in our daily lives.</p>',
          discussion_questions: '<p>Discussion questions:</p><ol><li>What does "walking in faith" mean to you?</li><li>Share about a time when you had to step out in faith.</li><li>How can our group support each other in faith?</li></ol>',
          created_at: new Date(Date.now() - 604800000).toISOString()
        }
      ];
      localStorage.setItem('sermons_portal123', JSON.stringify(sampleSermons));
    }

    if (!localStorage.getItem('podcast_portal123')) {
      const samplePodcast = {
        id: '1',
        title: 'Shine Podcast - Episode 15: Finding Joy in Every Season',
        spotify_embed_url: 'https://open.spotify.com/embed/episode/4rOoJ6Egrf8K2IrywzwOMk',
        description: '<p>In this episode, we dive deep into finding joy regardless of the season of life you\'re in. Whether you\'re in a season of celebration or difficulty, God has joy available for us.</p><p>Topics covered:</p><ul><li>The difference between happiness and joy</li><li>Biblical foundations for joy</li><li>Practical steps to cultivate joy</li></ul>',
        updated_at: new Date().toISOString()
      };
      localStorage.setItem('podcast_portal123', JSON.stringify([samplePodcast]));
    }

    if (!localStorage.getItem('events_portal123')) {
      const sampleEvents = [
        {
          id: '1',
          title: 'Christmas Eve Candlelight Service',
          description: 'Join us for a beautiful candlelight service celebrating the birth of Jesus Christ.',
          date: '2024-12-24',
          time: '6:00 PM',
          location: 'Main Sanctuary',
          cost: 'Free',
          max_attendees: 300,
          current_registrations: 85,
          image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=250&fit=crop',
          link: 'https://example.com/christmas-eve-info',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'New Year Prayer & Fasting',
          description: 'Start the new year with prayer and seeking God\'s guidance for the year ahead.',
          date: '2025-01-01',
          time: '12:00 AM',
          location: 'Prayer Room',
          cost: 'Free',
          max_attendees: 50,
          current_registrations: 23,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
          link: '',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Youth Winter Retreat',
          description: 'A weekend retreat for our youth to grow in faith and build friendships.',
          date: '2025-01-15',
          time: '9:00 AM',
          location: 'Mountain View Camp',
          cost: '$75',
          max_attendees: 40,
          current_registrations: 28,
          image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=250&fit=crop',
          link: 'https://example.com/youth-retreat-details',
          created_at: new Date().toISOString()
        }
      ];
      localStorage.setItem('events_portal123', JSON.stringify(sampleEvents));
    }
  }

  // Generic CRUD operations
  async select(table, options = {}) {
    const data = JSON.parse(localStorage.getItem(table) || '[]');
    let result = Array.isArray(data) ? data : [data];

    // Apply ordering
    if (options.order) {
      const { column, ascending = true } = options.order;
      result.sort((a, b) => {
        const aVal = new Date(a[column]);
        const bVal = new Date(b[column]);
        return ascending ? aVal - bVal : bVal - aVal;
      });
    }

    // Apply limit
    if (options.limit) {
      result = result.slice(0, options.limit);
    }

    return { data: result, error: null };
  }

  async insert(table, records) {
    const existingData = JSON.parse(localStorage.getItem(table) || '[]');
    const dataArray = Array.isArray(existingData) ? existingData : [];
    
    const newRecords = records.map(record => ({
      ...record,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      created_at: record.created_at || new Date().toISOString()
    }));

    dataArray.push(...newRecords);
    localStorage.setItem(table, JSON.stringify(dataArray));
    return { data: newRecords, error: null };
  }

  async update(table, updates, condition) {
    const data = JSON.parse(localStorage.getItem(table) || '[]');
    const dataArray = Array.isArray(data) ? data : [data];

    const updatedData = dataArray.map(item => {
      if (condition.eq && item.id === condition.value) {
        return { ...item, ...updates, updated_at: new Date().toISOString() };
      }
      return item;
    });

    localStorage.setItem(table, JSON.stringify(updatedData));
    return { data: updatedData, error: null };
  }

  async delete(table, condition) {
    const data = JSON.parse(localStorage.getItem(table) || '[]');
    const dataArray = Array.isArray(data) ? data : [data];

    const filteredData = dataArray.filter(item => {
      if (condition.eq) {
        return item.id !== condition.value;
      }
      return true;
    });

    localStorage.setItem(table, JSON.stringify(filteredData));
    return { data: filteredData, error: null };
  }
}

// Create a mock supabase-like interface
class MockSupabase {
  constructor() {
    this.db = new LocalStorageDB();
  }

  from(table) {
    return {
      select: (columns = '*', options = {}) => ({
        order: (column, orderOptions = {}) => ({
          limit: (limitCount) => this.db.select(table, { 
            order: { column, ascending: orderOptions.ascending !== false }, 
            limit: limitCount 
          }),
          then: (callback) => this.db.select(table, { 
            order: { column, ascending: orderOptions.ascending !== false } 
          }).then(callback)
        }),
        limit: (limitCount) => this.db.select(table, { limit: limitCount }),
        then: (callback) => this.db.select(table).then(callback)
      }),
      insert: (records) => this.db.insert(table, records),
      update: (updates) => ({
        eq: (column, value) => this.db.update(table, updates, { eq: true, column, value })
      }),
      delete: () => ({
        eq: (column, value) => this.db.delete(table, { eq: true, column, value })
      })
    };
  }
}

export default new MockSupabase();