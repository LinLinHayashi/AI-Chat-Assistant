import express from 'express';
import {signup, signin, forgotPassword, resendEmail} from '../controllers/auth.controller.js';
import {verifyEmail, resetPassword} from '../utils/verification.js';

const router = express.Router();
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/verification/:token', verifyEmail);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:resetToken', resetPassword);
router.post('/resendemail', resendEmail);

export default router;