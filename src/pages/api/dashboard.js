// pages/api/dashboard.js

import dbConnect from '../../../lib/dbConnect';
import WaterReading from '../../../models/WaterReading';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    await dbConnect();
    console.log('Successfully connected to the database.');
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ success: false, message: 'Database connection failed.' });
  }

  const { lastName } = req.query;

  if (!lastName) {
    console.error('Dashboard API: Missing last name in query.');
    return res.status(400).json({ success: false, message: 'Last name is required to fetch dashboard data.' });
  }

  try {
    // CRITICAL FIX: Use a regex that matches any entry that starts with the lastName.
    // This will correctly return documents like "Benitez", "Benitez_1", "Benitez_2".
    const searchRegex = new RegExp(`^${lastName}`, 'i');
    console.log('Dashboard API: Searching for last_name with regex:', searchRegex);

    // Use find to get ALL documents that match the regex.
    const readings = await WaterReading.find({ last_name: searchRegex });

    console.log(`Dashboard API: Found ${readings.length} documents.`);

    return res.status(200).json({ success: true, data: readings });

  } catch (error) {
    console.error('Error during dashboard data query:', error);
    return res.status(500).json({ success: false, message: 'Server error during data query.', error: error.message });
  }
}