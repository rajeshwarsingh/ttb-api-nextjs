import mongoose from 'mongoose';
import axios from 'axios';
import { connectDB } from '../../db';

// Define the schema for the cached response
const cacheSchema = new mongoose.Schema({
  cacheKey: { type: String, required: true, unique: true },
  data: Object,
  timestamp: Number,
});

// Define the model for the cache
const Cache = mongoose.models.Cache || mongoose.model('Cache', cacheSchema);

// Connect to MongoDB
connectDB();

// Handler for the /api/news route
export default async function handler(req, res) {
  const cacheKey = 'news'; // Key to identify the cached response
  const cacheExpiration = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

  try {
    // Check if the response is already cached and not expired
    const cachedData = await Cache.findOne({ cacheKey });
    if (cachedData && Date.now() - cachedData.timestamp < cacheExpiration) {
      console.log('Returning cached response');
      return res.json(cachedData.data);
    }
    console.log("request send****************")
    // Make a request to the NewsAPI
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        apiKey: '6c08c057e51646d4b3c14313b53b05ce',
        country: 'us',
      },
    });

    // Update or create the cache with the new response
    await Cache.updateOne(
      { cacheKey },
      { data: response.data, timestamp: Date.now() },
      { upsert: true }
    );

    // Return the response
    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error);
    return res.status(500).json({ error: 'Error fetching news' });
  }
}
