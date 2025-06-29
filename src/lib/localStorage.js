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
          content: '<p>We are excited to launch our new church portal! Here you can stay updated with announcements, listen to sermons, and connect with our community.</p><p>This portal includes:</p><ul><li>Weekly announcements and updates</li><li>Sermon blog with discussion questions</li><li>Event registration</li><li>Podcast episodes</li></ul><p>We look forward to connecting with you through this new platform!</p>',
          author: 'Pastor John Smith',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Christmas Eve Service',
          content: '<p>Join us for our special Christmas Eve candlelight service at 6:00 PM.</p><p>This will be a beautiful time of worship and celebration of Jesus\' birth.</p><p>What to expect:</p><ul><li>Traditional Christmas carols</li><li>Candlelight ceremony</li><li>Special message</li><li>Fellowship time after service</li></ul><p>Invite your friends and family to this special celebration!</p>',
          author: 'Church Office',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      localStorage.setItem('announcements_portal123', JSON.stringify(sampleAnnouncements));
    }

    if (!localStorage.getItem('sermon_series_portal123')) {
      const sampleSeries = [
        {
          id: '1',
          name: 'Faith in Action',
          description: 'A series exploring how we can live out our faith in practical ways in our daily lives.',
          start_date: '2024-12-01',
          end_date: '2024-12-29',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'New Year, New Hope',
          description: 'Starting the year with renewed hope and purpose in Christ.',
          start_date: '2025-01-05',
          end_date: '',
          created_at: new Date().toISOString()
        }
      ];
      localStorage.setItem('sermon_series_portal123', JSON.stringify(sampleSeries));
    }

    if (!localStorage.getItem('sermons_portal123')) {
      const sampleSermons = [
        {
          id: '1',
          title: 'The Light of Hope',
          speaker: 'Pastor John Smith',
          sermon_date: '2024-12-15',
          sermon_series_id: '1',
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          summary: '<p>In this powerful message, we explore how Jesus is the light that shines in our darkest moments. No matter what challenges we face, His light guides us forward.</p><p>Key points covered:</p><ul><li>Jesus as the Light of the World</li><li>Finding hope in difficult times</li><li>Sharing His light with others</li></ul><p>This message reminds us that even in our darkest hours, God\'s light never fails to shine through.</p>',
          discussion_questions: '<p>Use these questions for your Table Group discussions:</p><ol><li>How has Jesus been a light in your life during dark times?</li><li>What are some practical ways we can share His light with others?</li><li>How can we maintain hope when facing challenges?</li><li>Share about a time when God\'s light helped you through difficulty.</li></ol>',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Walking in Faith',
          speaker: 'Pastor Sarah Johnson',
          sermon_date: '2024-12-08',
          sermon_series_id: '1',
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          summary: '<p>Faith is not just believing - it\'s acting on what we believe. This message challenges us to take steps of faith in our daily lives.</p><p>We explored:</p><ul><li>The difference between belief and faith</li><li>Biblical examples of faith in action</li><li>Overcoming fear to step out in faith</li></ul>',
          discussion_questions: '<p>Discussion questions:</p><ol><li>What does "walking in faith" mean to you?</li><li>Share about a time when you had to step out in faith.</li><li>How can our group support each other in faith?</li><li>What fears hold you back from acting in faith?</li></ol>',
          created_at: new Date(Date.now() - 604800000).toISOString()
        },
        {
          id: '3',
          title: 'A Fresh Start',
          speaker: 'Pastor John Smith',
          sermon_date: '2025-01-05',
          sermon_series_id: '2',
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          summary: '<p>God offers us a fresh start every day. This message explores how we can embrace new beginnings and leave the past behind.</p><p>Topics covered:</p><ul><li>God\'s mercy is new every morning</li><li>Letting go of past mistakes</li><li>Stepping into God\'s promises</li></ul>',
          discussion_questions: '<p>Discussion questions:</p><ol><li>What does a "fresh start" mean to you?</li><li>What from the past do you need to let go of?</li><li>How can we support each other in new beginnings?</li><li>What is one area where you want to see change this year?</li></ol>',
          created_at: new Date(Date.now() - 1209600000).toISOString()
        },
        {
          id: '4',
          title: 'Finding Peace in Chaos',
          speaker: 'Pastor Sarah Johnson',
          sermon_date: '2024-11-24',
          sermon_series_id: null,
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          summary: '<p>In a world full of chaos and uncertainty, God offers us His perfect peace. This standalone message explores how we can find rest in Him.</p><p>Key points:</p><ul><li>The source of true peace</li><li>Practical steps to find calm</li><li>Trusting God in difficult times</li></ul>',
          discussion_questions: '<p>Discussion questions:</p><ol><li>Where do you typically turn when life feels chaotic?</li><li>How has God brought peace to your life?</li><li>What practical steps help you find calm?</li><li>How can we help others find peace?</li></ol>',
          created_at: new Date(Date.now() - 1814400000).toISOString()
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
    
    // Ensure content is preserved exactly as provided
    localStorage.setItem(table, JSON.stringify(dataArray, null, 2));
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

    // Ensure content is preserved exactly as provided
    localStorage.setItem(table, JSON.stringify(updatedData, null, 2));
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

    localStorage.setItem(table, JSON.stringify(filteredData, null, 2));
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