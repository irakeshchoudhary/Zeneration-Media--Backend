import express from 'express';
import { subscribeUser } from '../Controllers/subscribeController.js';

const router = express.Router();

router.post('/subscribe', subscribeUser);

export default router; 