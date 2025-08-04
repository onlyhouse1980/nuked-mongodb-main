// pages/api/auth/signup.js

import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';
import WaterReading from '../../../../models/WaterReading';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  const { lastName, password } = req.body;

  if (!lastName || !password) {
    return res.status(400).json({ message: 'Last name and password are required' });
  }

  try {
    // 1. Cross-reference with the water_readings collection and find all matches
    const waterReadings = await WaterReading.find({ last_name: lastName });

    if (waterReadings.length === 0) {
      return res.status(404).json({ message: 'No existing customer found with that last name' });
    }

    // 2. Check if a user with this last name already exists
    const existingUser = await User.findOne({ username: lastName });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this last name already exists' });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the new user and link to ALL matching water reading documents
    const newUser = await User.create({
      username: lastName,
      password: hashedPassword,
      readingIds: waterReadings.map(reading => reading._id), // Map to an array of IDs
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: newUser._id,
        username: newUser.username,
        readingIds: newUser.readingIds,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}