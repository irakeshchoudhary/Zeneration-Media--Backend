import express from 'express';
import { createLead } from '../Controllers/LeadCollection.js';

const router = express.Router();

router.post('/form-filling', createLead);

export default router; 