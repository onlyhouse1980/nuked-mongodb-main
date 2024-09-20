// pages/api/people/[meter_serialNum].js
import clientPromise from '../../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('mydatabase');

  const { meter_serialNum } = req.query;

  if (req.method === 'GET') {
    try {
      const user = await db.collection('users').findOne({ meter_serialNum: meter_serialNum });
      if (user) {
        res.status(200).json({ status: 200, data: user });
      } else {
        res.status(404).json({ status: 404, message: 'Serial not found' });
      }
    } catch (error) {
      res.status(500).json({ status: 500, message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
