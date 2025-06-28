// Podcast RSS feed utility
export class PodcastRSSService {
  constructor() {
    this.rssUrl = 'https://anchor.fm/s/34abb934/podcast/rss';
    // Try multiple CORS proxies for better reliability
    this.proxies = [
      'https://api.allorigins.win/get?url=',
      'https://cors-anywhere.herokuapp.com/',
      'https://api.codetabs.com/v1/proxy?quest='
    ];
  }

  async fetchWithProxy(proxyIndex = 0) {
    if (proxyIndex >= this.proxies.length) {
      throw new Error('All proxy services failed');
    }

    try {
      const proxy = this.proxies[proxyIndex];
      let url;
      
      if (proxy.includes('allorigins')) {
        url = `${proxy}${encodeURIComponent(this.rssUrl)}`;
      } else {
        url = `${proxy}${this.rssUrl}`;
      }

      console.log(`Trying proxy ${proxyIndex + 1}:`, url);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json, text/plain, */*',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle different proxy response formats
      const xmlContent = data.contents || data.content || data;
      
      if (!xmlContent || typeof xmlContent !== 'string') {
        throw new Error('Invalid response format from proxy');
      }

      return xmlContent;
    } catch (error) {
      console.error(`Proxy ${proxyIndex + 1} failed:`, error);
      
      // Try next proxy
      return this.fetchWithProxy(proxyIndex + 1);
    }
  }

  async fetchPodcastFeed() {
    try {
      console.log('Fetching podcast RSS feed...');
      
      // First, try direct fetch (might work in some environments)
      try {
        const directResponse = await fetch(this.rssUrl);
        if (directResponse.ok) {
          const directXml = await directResponse.text();
          console.log('Direct fetch successful');
          return this.parseRSSFeed(directXml);
        }
      } catch (directError) {
        console.log('Direct fetch failed, trying proxies...');
      }

      // Try with proxies
      const xmlContent = await this.fetchWithProxy();
      return this.parseRSSFeed(xmlContent);
      
    } catch (error) {
      console.error('All fetch methods failed:', error);
      
      // Return fallback data with sample episodes
      return this.getFallbackData();
    }
  }

  parseRSSFeed(xmlString) {
    try {
      console.log('Parsing RSS feed...');
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      // Check for parsing errors
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('XML parsing failed');
      }

      const channel = xmlDoc.querySelector('channel');
      if (!channel) {
        throw new Error('No channel element found in RSS');
      }

      const items = xmlDoc.querySelectorAll('item');
      console.log(`Found ${items.length} episodes`);

      const channelInfo = {
        title: this.getTextContent(channel, 'title') || 'Shine Podcast',
        description: this.getTextContent(channel, 'description') || 'Upper Room Fellowship Podcast',
        image: this.getImageUrl(channel) || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop',
        link: this.getTextContent(channel, 'link'),
        language: this.getTextContent(channel, 'language') || 'en',
        author: this.getTextContent(channel, 'itunes\\:author, author') || 'Upper Room Fellowship'
      };

      const episodes = Array.from(items).slice(0, 20).map((item, index) => {
        const enclosure = item.querySelector('enclosure');
        const duration = this.getTextContent(item, 'itunes\\:duration');
        const pubDate = this.getTextContent(item, 'pubDate');
        
        return {
          id: `episode-${index}`,
          title: this.getTextContent(item, 'title') || `Episode ${index + 1}`,
          description: this.getTextContent(item, 'description') || this.getTextContent(item, 'itunes\\:summary') || '',
          audioUrl: enclosure ? enclosure.getAttribute('url') : null,
          duration: this.formatDuration(duration) || '00:00',
          pubDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          link: this.getTextContent(item, 'link'),
          guid: this.getTextContent(item, 'guid') || `guid-${index}`,
          image: this.getImageUrl(item) || channelInfo.image,
          summary: this.getTextContent(item, 'itunes\\:summary') || this.getTextContent(item, 'description') || ''
        };
      }).filter(episode => episode.title && episode.title !== '');

      console.log(`Parsed ${episodes.length} valid episodes`);
      
      return { 
        channel: channelInfo, 
        episodes: episodes,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing RSS feed:', error);
      return this.getFallbackData();
    }
  }

  getFallbackData() {
    console.log('Using fallback podcast data');
    
    return {
      channel: {
        title: 'Shine Podcast',
        description: 'Welcome to the Shine Podcast from Upper Room Fellowship. Join us as we explore faith, community, and living out God\'s love in our daily lives.',
        image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop',
        link: 'https://anchor.fm/s/34abb934/podcast/rss',
        language: 'en',
        author: 'Upper Room Fellowship'
      },
      episodes: [
        {
          id: 'fallback-1',
          title: 'Welcome to Shine Podcast',
          description: 'In our inaugural episode, we introduce the Shine Podcast and share our vision for this journey together. We\'ll explore what it means to let our light shine in a world that desperately needs hope.',
          audioUrl: null,
          duration: '25:30',
          pubDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          link: 'https://anchor.fm/s/34abb934',
          guid: 'fallback-guid-1',
          image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop',
          summary: 'Welcome to our podcast journey as we explore faith and community together.'
        },
        {
          id: 'fallback-2',
          title: 'Finding Hope in Difficult Times',
          description: 'Life can be challenging, but God\'s hope is always available to us. In this episode, we discuss practical ways to find and maintain hope when facing life\'s storms.',
          audioUrl: null,
          duration: '32:15',
          pubDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          link: 'https://anchor.fm/s/34abb934',
          guid: 'fallback-guid-2',
          image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop',
          summary: 'Discovering God\'s hope in the midst of life\'s challenges and difficulties.'
        },
        {
          id: 'fallback-3',
          title: 'The Power of Community',
          description: 'We weren\'t meant to walk this journey alone. Join us as we explore the vital role of community in our faith and how we can build stronger connections with one another.',
          audioUrl: null,
          duration: '28:45',
          pubDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          link: 'https://anchor.fm/s/34abb934',
          guid: 'fallback-guid-3',
          image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop',
          summary: 'Exploring the importance of community in our spiritual journey and daily lives.'
        }
      ],
      lastUpdated: new Date().toISOString(),
      isFallback: true
    };
  }

  getTextContent(element, selector) {
    if (!element) return '';
    
    // Handle CSS selector with escaped colons for iTunes namespace
    const selectors = selector.split(', ');
    for (const sel of selectors) {
      try {
        const found = element.querySelector(sel.replace('\\:', ':'));
        if (found && found.textContent) {
          return found.textContent.trim();
        }
      } catch (e) {
        // Try without namespace
        const simpleSelector = sel.replace('itunes\\:', '').replace('itunes:', '');
        const found = element.querySelector(simpleSelector);
        if (found && found.textContent) {
          return found.textContent.trim();
        }
      }
    }
    return '';
  }

  getImageUrl(element) {
    if (!element) return '';
    
    // Try multiple image sources
    const imageSelectors = [
      'itunes\\:image',
      'itunes:image', 
      'image[href]',
      'image url',
      'image'
    ];
    
    for (const selector of imageSelectors) {
      try {
        const imageElement = element.querySelector(selector);
        if (imageElement) {
          const url = imageElement.getAttribute('href') || 
                      imageElement.getAttribute('url') || 
                      imageElement.textContent?.trim();
          if (url && url.startsWith('http')) {
            return url;
          }
        }
      } catch (e) {
        continue;
      }
    }
    
    return '';
  }

  formatDuration(duration) {
    if (!duration) return '';
    
    // Handle different duration formats
    if (duration.includes(':')) {
      return duration;
    }
    
    // Convert seconds to MM:SS or HH:MM:SS
    const seconds = parseInt(duration);
    if (isNaN(seconds)) return duration;
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  }

  // Cache episodes in localStorage
  cacheEpisodes(data) {
    try {
      const cacheData = {
        ...data,
        cached_at: new Date().toISOString()
      };
      localStorage.setItem('shine_podcast_cache', JSON.stringify(cacheData));
      console.log('Episodes cached successfully');
    } catch (error) {
      console.error('Error caching episodes:', error);
    }
  }

  getCachedEpisodes() {
    try {
      const cached = localStorage.getItem('shine_podcast_cache');
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      const cacheAge = Date.now() - new Date(data.cached_at).getTime();
      
      // Cache for 1 hour, but use fallback cache for longer if needed
      const maxAge = data.isFallback ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
      
      if (cacheAge > maxAge) {
        localStorage.removeItem('shine_podcast_cache');
        return null;
      }
      
      console.log('Using cached episodes');
      return data;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  }

  async getEpisodes() {
    // Try cache first
    const cached = this.getCachedEpisodes();
    if (cached) {
      return cached;
    }

    // Fetch fresh data
    const data = await this.fetchPodcastFeed();
    
    // Cache the data (even if it's fallback data)
    this.cacheEpisodes(data);
    
    return data;
  }
}

export default new PodcastRSSService();