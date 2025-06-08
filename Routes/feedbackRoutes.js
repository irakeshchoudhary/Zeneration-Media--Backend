import express from 'express';
import { submitFeedback } from '../Controllers/feedbackController.js';

const router = express.Router();

router.post('/submit', submitFeedback);

export default router; 