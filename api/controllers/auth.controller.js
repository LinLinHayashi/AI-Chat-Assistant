import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const {email, password} = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({email, password: hashedPassword});
  try {
    await newUser.save(); // Store "newUser" in the database.
    res.status(201).json('User created successfully!');
  } catch (error) {
    next(error);
  }
};