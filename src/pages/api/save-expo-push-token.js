import { connectDB } from '../../db';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { token } = req.query;

      // Save the token to MongoDB
      connectDB(); // Connect to the MongoDB database
      const TokenModel = require('../../models/token'); // Replace with your token model schema
      // Check if the token already exists
      const existingToken = await TokenModel.findOne({ token });

      if (existingToken) {
        // Token already exists, update it
        existingToken.token = token;
        await existingToken.save();
      } else {
        // Token does not exist, create a new document
        await TokenModel.create({ token });
      }

      res.status(200).json({ message: 'Token saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save token' });
    }
  } else {
    res.status(400).json({ error: 'Invalid request method' });
  }
};

export default handler;
