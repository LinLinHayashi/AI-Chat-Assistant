import User from '../models/user.model.js';
import Token from '../models/token.model.js';
import {sendEmail} from '../utils/verification.js';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const {email, password} = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({email, password: hashedPassword});
  try {
    await newUser.save(); // Store "newUser" in the database.
    const token = new Token({userId: newUser._id, userToken: crypto.randomBytes(16).toString('hex')});
    await token.save();
    const link = `http://localhost:8000/api/auth/verification/${token.userToken}`;
    await sendEmail(newUser.email, link);
    res.status(201).json('User and verification token created, and verification email sent successfully!');
  } catch (error) {
    next(error);
  }
};