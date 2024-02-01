import express from 'express';
import {signup, signin} from '../controllers/auth.controller.js';
import {verifyEmail} from '../utils/verification.js';

const router = express.Router();
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/verification/:token', verifyEmail);

export default router;