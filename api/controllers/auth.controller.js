import User from '../models/user.model.js';
import Token from '../models/token.model.js';
import ResetToken from '../models/resetToken.js';
import {sendEmail, sendResetPasswordEmail} from '../utils/verification.js';
import {errorHandler} from '../utils/error.js';
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

export const signin = async (req, res, next) => {
  const {email, password} = req.body;
  try {
    const validUser = await User.findOne({email}); // Query the database for a User record that has a "email": "email" key-value pair. The found User record will be stored in "validUser". If not found, "validUser" will be null.
    if (!validUser) return next(errorHandler(404, 'Oops! Account not found!')); // If the User record isn't found, return an error.
    const validPassword = bcryptjs.compareSync(password, validUser.password); // Compare "password" with the hashed password of the User record.
    if (!validPassword) return next(errorHandler(401, 'Oops! Incorrect password!')); // If the password is invalid, return an error.
    if (validUser.verified === false) return next(errorHandler(403, 'Oops! Email is not verified for this account!')); // If the email is not verified, return an error.
    const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET); // Create a token using the User record's id in the MongoDB database and the JWT secret key only for our application.

    // This is how we exclude the password from the response sent to the user for security purpose.
    const {password: pass, ...rest} = validUser._doc; // "rest" stores all attributes of "validUser._doc", which is the User record's information sent through the response, except the password.

    // Create a cookie for the User record using the token of the name "access_token", and set it to expire in 90 days.
    res.cookie('access_token', token, {httpOnly: true, expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)}).status(200).json(rest); // Note that we only send "rest" through the response.

  } catch(error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const {email} = req.body;
  try{
    const validUser = await User.findOne({email});
    if (!validUser) return next(errorHandler(404, 'Oops! Account not found!'));
    const resetToken = new ResetToken({userId: validUser._id, userToken: crypto.randomBytes(16).toString('hex')});
    await resetToken.save();
    const link = `http://localhost:5173/reset-password/${resetToken.userToken}`;
    await sendResetPasswordEmail(validUser.email, link);
    res.status(201).json('Password reset token created, and password reset email sent successfully!');
  } catch(error) {
    next(error);
  }
};

export const resendEmail = async (req, res, next) => {
  const {email} = req.body;
  try {
    const validUser = await User.findOne({email});
    const token = await Token.findOne({userId: validUser._id});
    const link = `http://localhost:8000/api/auth/verification/${token.userToken}`;
    await sendEmail(validUser.email, link);
    res.status(201).json('Verification email sent successfully!');
  } catch (error) {
    next(error);
  }
};
