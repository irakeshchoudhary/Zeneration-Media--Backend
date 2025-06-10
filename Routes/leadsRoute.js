import express from 'express';
import { createLead, testConnection } from '../Controllers/LeadCollection.js';

const router = express.Router();

router.post('/form-filling', createLead);
router.get('/test-connection', testConnection);

export default router; 