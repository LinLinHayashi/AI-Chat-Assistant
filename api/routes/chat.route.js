import express from 'express';
import {completeChat} from '../controllers/chat.controller.js';

// This is how we create an API router.
const router = express.Router();
router.post('/completions', completeChat);

export default router;