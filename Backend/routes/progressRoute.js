import express from 'express';
import Progress from '../models/progressModule.js';
import { zodValidate } from '../middleware/zodValidation.js';
import { progressSchema } from '../validators/progressValidate.js';
import { protectAdmin } from '../middleware/authware.js';

const router = express.Router();


router.post('/', protectAdmin, zodValidate(progressSchema), async (req, res) => {
  try {
    const { category, status, note, record } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const newProgress = new Progress({ category, status, note, record, date: today });
    await newProgress.save();

    console.log('progress updated successfully');
    res.status(201).json({
      status: 'success',
      message: 'progress updated successfully',
      data: newProgress
    });
  } catch (err) {
    console.error('error updating progress:', err);
    res.status(500).json({
      status: 'error',
      message: 'error updating progress',
      error: err.message.toLowerCase()
    });
  }
});


router.get('/', async (req, res) => {
  try {
    const progress = await Progress.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      count: progress.length,
      data: progress
    });
  } catch (err) {
    console.error('error fetching progress:', err);
    res.status(500).json({
      status: 'error',
      message: 'error fetching progress',
      error: err.message.toLowerCase()
    });
  }
});

export default router;