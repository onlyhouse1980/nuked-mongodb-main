// pages/api/spreadsheet/fetch.js
import clientPromise from '../../../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('mydatabase');
    const collection = db.collection('users');
    
    const data = await collection.find({}).sort({ _id: 1 }).toArray();
    console.log('Data fetched:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to fetch data', error: error.message });
  }
}
