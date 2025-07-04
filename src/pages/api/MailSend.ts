import clientPromise from '@/Lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://curatehealthservices.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // Preflight response
  }

  if (req.method === 'POST') {
    try {
      const {
        companyName,
        representative,
        location,
        industry,
        requestedService,
        description,
        contact,
        email,
      } = req.body;

      if (!companyName || !email) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }

      const db = (await clientPromise).db('CurateInformation');
      const result = await db.collection('Contacts').insertOne({
        companyName,
        representative,
        location,
        industry,
        requestedService,
        description,
        contact,
        email,
        createdAt: new Date(),
      });

      return res.status(201).json({ success: true, id: result.insertedId });
    } catch (error:any) {
      console.error('Contact API error:', error);
      return res.status(500).json({ success: false, error: error.message || 'Internal error' });
    }
  }

  // If method not allowed
  res.setHeader('Allow', ['POST', 'OPTIONS']);
  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}