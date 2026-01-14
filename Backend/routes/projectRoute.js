import express from 'express';
import Project from '../models/projectModel.js';
import handleImage from '../utils/cloudinaryUtil.js';
import { zodValidate } from '../middleware/zodValidation.js';
import { projectSchema } from '../validators/projectValidate.js';
import { protectAdmin } from '../middleware/authware.js';

const router = express.Router();


router.post('/', protectAdmin, zodValidate(projectSchema), async (req, res) => {
  try {
    let imageUploadResult = {
      url: 'https://abhibhrt.vercel.app/intro.webp',
      publicId: ''
    };

    if (req.body.images) {
      imageUploadResult = await handleImage('add', { imagePath: req.body.images });
    }

    const project = new Project({
      ...req.body,
      tags: req.body.tags?.split(',').map(t => t.trim()) || [],
      images: [imageUploadResult]
    });

    const saved = await project.save();
    res.status(201).json({
      status: 'success',
      message: 'project created successfully',
      data: saved
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'error creating project',
      error: err.message.toLowerCase()
    });
  }
});


router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      count: projects.length,
      data: projects
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'error fetching projects',
      error: err.message.toLowerCase()
    });
  }
});


router.put('/:id', protectAdmin, zodValidate(projectSchema.partial()), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'project not found'
      });
    }

    let imageUploadResult = project.images?.[0] || {
      url: 'https://abhibhrt.netlify.app/intro.webp',
      publicId: ''
    };

    if (req.file) {
      if (project.images?.[0]?.publicId) {
        await handleImage('delete', { publicId: project.images[0].publicId });
      }
      imageUploadResult = await handleImage('add', { imagePath: req.file.path });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        tags: req.body.tags?.split(',').map(t => t.trim()) || [],
        images: [imageUploadResult]
      },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'project updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'error updating project',
      error: err.message.toLowerCase()
    });
  }
});


router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'project not found'
      });
    }

    if (project.images?.[0]?.publicId) {
      await handleImage('delete', { publicId: project.images[0].publicId });
    }

    await project.deleteOne();
    res.status(200).json({
      status: 'success',
      message: 'project deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'error deleting project',
      error: err.message.toLowerCase()
    });
  }
});

export default router;