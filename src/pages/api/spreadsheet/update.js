// pages/api/spreadsheet/update.js
import clientPromise from '../../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db('fullstack');
      const collection = db.collection('meterreads');
      
      const { data } = req.body;

      // Validate data format
      if (!Array.isArray(data)) {
        return res.status(400).json({ message: 'Invalid data format' });
      }

      // Replace the entire collection content with new data
      await collection.deleteMany({});
      await collection.insertMany(data);

      res.status(200).json({ message: 'Data updated successfully' });
    } catch (error) {
      console.error('Failed to update data:', error);
      res.status(500).json({ message: 'Failed to update data' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
