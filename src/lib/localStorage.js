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
          announcement_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Christmas Eve Service',
          content: '<p>Join us for our special Christmas Eve candlelight service at 6:00 PM.</p><p>This will be a beautiful time of worship and celebration of Jesus\' birth.</p><p>What to expect:</p><ul><li>Traditional Christmas carols</li><li>Candlelight ceremony</li><li>Special message</li><li>Fellowship time after service</li></ul><p>Invite your friends and family to this special celebration!</p>',
          author: 'Church Office',
          announcement_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
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
      localStorage.setItem('events_portal123', JSON.stringify([]));
    }

    if (!localStorage.getItem('classes_portal123')) {
      localStorage.setItem('classes_portal123', JSON.stringify([]));
    }

    // Initialize resources if not exists
    if (!localStorage.getItem('resources_portal123')) {
      const sampleResources = {
        id: '1',
        title: 'Recommended Books',
        amazon_link: 'https://www.amazon.com/shop/upperroomfellowship',
        description: 'Discover books that will help you grow in your faith journey.',
        updated_at: new Date().toISOString()
      };
      localStorage.setItem('resources_portal123', JSON.stringify([sampleResources]));
    }

    // Initialize daily scriptures if not exists
    if (!localStorage.getItem('daily_scriptures_portal123')) {
      const sampleScriptures = [
        {
          id: '1',
          verse_text: '<p>"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future."</p>',
          reference: 'Jeremiah 29:11',
          notes: '<p>This verse reminds us that God has good plans for our lives, even when we can\'t see the full picture.</p>',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          verse_text: '<p>"Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight."</p>',
          reference: 'Proverbs 3:5-6',
          notes: '<p>When we trust God completely, He guides our steps and makes our path clear.</p>',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          verse_text: '<p>"And we know that in all things God works for the good of those who love him, who have been called according to his purpose."</p>',
          reference: 'Romans 8:28',
          notes: '<p>Even in difficult circumstances, God can work things together for our good.</p>',
          created_at: new Date().toISOString()
        }
      ];
      localStorage.setItem('daily_scriptures_portal123', JSON.stringify(sampleScriptures));
    }
  }

  // Generic CRUD operations
  async select(table) {
    const data = JSON.parse(localStorage.getItem(table) || '[]');
    let result = Array.isArray(data) ? data : [data];
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
      select: () => ({
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