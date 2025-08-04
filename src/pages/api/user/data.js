// pages/api/user/data.js

import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';

export default async function handler(req, res) {
  // *** IMPORTANT: In a real app, you would verify the user's session/token here. ***
  const userId = '...'; // Get this from a secure session or JWT token

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await dbConnect();

  try {
    // Populate the entire array of readingIds
    const user = await User.findById(userId).populate('readingIds');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        username: user.username,
        waterReadings: user.readingIds, // This will be the populated array of objects
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}