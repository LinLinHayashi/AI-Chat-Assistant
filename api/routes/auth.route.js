import express from 'express';
import {signup, signin, forgotPassword} from '../controllers/auth.controller.js';
import {verifyEmail, resetPassword} from '../utils/verification.js';

const router = express.Router();
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/verification/:token', verifyEmail);
router.post('/forgotpassword', forgotPassword);
router.get('/resetpassword/:resetToken', resetPassword);

export default router;