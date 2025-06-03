import express from 'express';
import { createCallRequest, getLastRequestTime } from '../Controllers/CallRequestController.js';

const router = express.Router();

// POST: Create a new call request
router.post('/', createCallRequest);

// GET: Get last request time for a number (for timer)
router.get('/last', getLastRequestTime);

export default router; 