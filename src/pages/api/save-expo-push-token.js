import { connectDB } from '../../db';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { token } = req.query;

      // Save the token to MongoDB
      connectDB(); // Connect to the MongoDB database
      const TokenModel = require('../../models/token'); // Replace with your token model schema
      await TokenModel.create({ token });

      res.status(200).json({ message: 'Token saved successfully' });
    } catch (error) {
      console.log('***************',error)
      res.status(500).json({ error: 'Failed to save token' });
    }
  } else {
    res.status(400).json({ error: 'Invalid request method' });
  }
};

export default handler;
