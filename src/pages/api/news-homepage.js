import mongoose from 'mongoose';
import { connectDB } from '../../db';
import config from '../../../config';

// Define the schema for the cached response
const cacheSchema = new mongoose.Schema({
  cacheKey: { type: String, required: true, unique: true },
  data: Object,
  timestamp: Number,
});

// Define the model for the cache
const CacheNewsHomepag = mongoose.models.cachenewshomepags || mongoose.model('cachenewshomepags', cacheSchema);

// Connect to MongoDB
connectDB();

// Handler for the /api/news route
export default async function handler(req, res) {
  const cacheKey = 'news'; // Key to identify the cached response
  const cacheExpiration = config.cacheExpiration; // 4 hours in milliseconds

  try {
    // Check if the response is already cached and not expired
    const cachedData = await CacheNewsHomepag.findOne({ cacheKey });
    if (cachedData && Date.now() - cachedData.timestamp < cacheExpiration) {
      console.log('Returning cached response');
      return res.json({data : cachedData.data});
    }
    console.log("New Request Send");

    const response = await getHomepageNews()

    // Update or create the cache with the new response
    await CacheNewsHomepag.updateOne(
      { cacheKey },
      { data: response, timestamp: Date.now() },
      { upsert: true }
    );

    // Return the response
    return res.json({ data: response });

  } catch (error) {
    console.error('Error fetching news:', error);
    return res.status(500).json({ error: 'Error fetching news' });
  }
}


async function getHomepageNews() {
  let newsPromises = [
    fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${config.newsAPIKey}&pageSize=5`),
    fetch(`https://newsapi.org/v2/top-headlines?category=health&apiKey=${config.newsAPIKey}&pageSize=5`),
    fetch(`https://newsapi.org/v2/top-headlines?category=entertainment&apiKey=${config.newsAPIKey}&pageSize=5`),
    fetch(`https://newsapi.org/v2/top-headlines?category=technology&apiKey=${config.newsAPIKey}&pageSize=5`),
    fetch(`https://newsapi.org/v2/top-headlines?category=business&apiKey=${config.newsAPIKey}&pageSize=5`)
  ];
  let promiseData = await Promise.all(newsPromises);
  const data = {
    breaking: formatData(await promiseData[0].json()),
    health: formatData(await promiseData[1].json()),
    entertainment: formatData(await promiseData[2].json()),
    technology: formatData(await promiseData[3].json()),
    business: formatData(await promiseData[4].json()),
  }
  return data
}

function formatData(data) {
  const resData = (data?.articles || []).map((news, i) => {
    return {
      key: i + 1,
      author: news.author,
      title: news.title,
      description: news.description,
      content: news.content,
      url: news.url,
      urlToImage: news.urlToImage,
      video: false,
      time: (news?.publishedAt?(new Date(news?.publishedAt)).toLocaleDateString():''),
      sourceLink:news.url,
      logo: news.urlToImage
    }
  });

  return resData;
}
