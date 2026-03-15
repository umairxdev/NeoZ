import { FeedSource } from '@/types';

export const RSS_FEEDS: FeedSource[] = [
  // Technology
  { url: 'https://techcrunch.com/feed/', category: 'Technology', sourceName: 'TechCrunch' },
  { url: 'https://www.theverge.com/rss/index.xml', category: 'Technology', sourceName: 'The Verge' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'Technology', sourceName: 'Ars Technica' },
  { url: 'https://www.engadget.com/rss.xml', category: 'Technology', sourceName: 'Engadget' },
  { url: 'https://www.wired.com/feed/rss', category: 'Technology', sourceName: 'Wired' },
  { url: 'https://venturebeat.com/feed/', category: 'Technology', sourceName: 'VentureBeat' },
  { url: 'https://www.technologyreview.com/feed/', category: 'Technology', sourceName: 'MIT Technology Review' },
  { url: 'https://hnrss.org/frontpage?points=100', category: 'Technology', sourceName: 'Hacker News' },

  // AI
  { url: 'https://www.artificialintelligence-news.com/feed/', category: 'AI', sourceName: 'AI News' },
  { url: 'https://towardsdatascience.com/feed', category: 'AI', sourceName: 'Towards Data Science' },
  { url: 'https://bair.berkeley.edu/blog/feed.xml', category: 'AI', sourceName: 'BAIR Blog' },
  { url: 'https://openai.com/news/rss.xml', category: 'AI', sourceName: 'OpenAI' },
  { url: 'https://research.google/blog/rss/', category: 'AI', sourceName: 'Google AI Blog' },
  { url: 'https://blogs.nvidia.com/feed/', category: 'AI', sourceName: 'NVIDIA AI' },
  { url: 'https://venturebeat.com/category/ai/feed/', category: 'AI', sourceName: 'VentureBeat AI' },
  { url: 'https://www.theguardian.com/technology/artificialintelligenceai/rss', category: 'AI', sourceName: 'Guardian AI' },
  { url: 'https://aibusiness.com/rss.xml', category: 'AI', sourceName: 'AI Business' },

  // Science
  { url: 'https://www.sciencedaily.com/rss/top/science.xml', category: 'Science', sourceName: 'Science Daily' },
  { url: 'https://www.nature.com/nature.rss', category: 'Science', sourceName: 'Nature' },
  { url: 'https://www.space.com/home/feed/site.xml', category: 'Science', sourceName: 'Space.com' },
  { url: 'https://www.quantamagazine.org/feed/', category: 'Science', sourceName: 'Quanta Magazine' },

  // Business
  { url: 'https://www.ft.com/?format=rss', category: 'Business', sourceName: 'Financial Times' },
  { url: 'https://www.cnbc.com/id/10000115/device/rss/rss.html', category: 'Business', sourceName: 'CNBC' },
  { url: 'https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml', category: 'Business', sourceName: 'Wall Street Journal' },
  { url: 'https://www.economist.com/business/rss.xml', category: 'Business', sourceName: 'The Economist' },
  { url: 'https://fortune.com/feed/', category: 'Business', sourceName: 'Fortune' },

  // World
  { url: 'http://feeds.bbci.co.uk/news/world/rss.xml', category: 'World', sourceName: 'BBC News' },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'World', sourceName: 'Al Jazeera' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', category: 'World', sourceName: 'NY Times World' },
  { url: 'https://www.theguardian.com/world/rss', category: 'World', sourceName: 'The Guardian' },
  { url: 'https://feeds.reuters.com/reuters/worldNews', category: 'World', sourceName: 'Reuters World' },

  // Sports
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml', category: 'Sports', sourceName: 'NY Times Sports' },
  { url: 'https://www.skysports.com/rss/12040', category: 'Sports', sourceName: 'Sky Sports' },
  { url: 'http://feeds.bbci.co.uk/sport/rss.xml', category: 'Sports', sourceName: 'BBC Sport' },

  // Health
  { url: 'https://www.theguardian.com/society/health/rss', category: 'Health', sourceName: 'The Guardian Health' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml', category: 'Health', sourceName: 'NY Times Health' },
  { url: 'https://tools.cdc.gov/api/v2/resources/media/403372.rss', category: 'Health', sourceName: 'CDC' },

  // Entertainment
  { url: 'https://www.theguardian.com/culture/rss', category: 'Entertainment', sourceName: 'The Guardian Culture' },
  { url: 'https://www.theguardian.com/film/rss', category: 'Entertainment', sourceName: 'The Guardian Film' },

  // Politics
  { url: 'https://www.theguardian.com/us-news/rss', category: 'Politics', sourceName: 'The Guardian US' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml', category: 'Politics', sourceName: 'NY Times Politics' },
  { url: 'https://feeds.washingtonpost.com/rss/politics', category: 'Politics', sourceName: 'Washington Post' },

  // Pakistan
  { url: 'https://www.dawn.com/feeds/home', category: 'Pakistan', sourceName: 'Dawn' },
  { url: 'https://www.dawn.com/feeds/pakistan', category: 'Pakistan', sourceName: 'Dawn Pakistan' },
  { url: 'https://www.dawn.com/feeds/business', category: 'Pakistan', sourceName: 'Dawn Business' },
  { url: 'https://www.thenews.com.pk/rss/1/1', category: 'Pakistan', sourceName: 'The News International' },
  { url: 'https://arynews.tv/feed/', category: 'Pakistan', sourceName: 'ARY News' },
  { url: 'https://samaa.tv/feed/', category: 'Pakistan', sourceName: 'Samaa News' },

  // South Asia & Region
  { url: 'http://feeds.bbci.co.uk/news/world/asia/rss.xml', category: 'South Asia', sourceName: 'BBC Asia' },
  { url: 'https://www.dawn.com/feeds/world', category: 'South Asia', sourceName: 'Dawn World' },
  { url: 'https://feeds.reuters.com/reuters/INtopNews', category: 'South Asia', sourceName: 'Reuters India' },
];