import express from 'express';
import Contact from '../models/contactModule.js';
import { zodValidate } from '../middleware/zodValidation.js';
import { contactSchema } from '../validators/contactValidate.js';
import { protectAdmin } from '../middleware/authware.js';

const router = express.Router();


router.post('/', zodValidate(contactSchema), async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newMessage = new Contact({ name, email, message });
        await newMessage.save();

        res.status(201).json({
            status: 'success',
            message: 'message sent successfully',
            data: newMessage
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'error sending message',
            error: err.message.toLowerCase()
        });
    }
});


router.get('/', protectAdmin, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: 'success',
            count: messages.length,
            data: messages
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'error fetching messages',
            error: err.message.toLowerCase()
        });
    }
});

export default router;