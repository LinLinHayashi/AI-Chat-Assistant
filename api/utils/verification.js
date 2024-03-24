import nodemailer from 'nodemailer';
import Token from '../models/token.model.js';
import User from '../models/user.model.js';
import ResetToken from '../models/resetToken.js';
import bcryptjs from 'bcryptjs';

export const sendEmail =  async (email, link) => {
  try {

    // The email sender.
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD // The App password of the Google account, not the normal password.
      }
    });

    // Email content.
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Account Verification - LinGPT',
      text: 'Thank you for using LinGPT.',
      html: `
        <div>
          <p>Thank you for using LinGPT.</p>
          <a href=${link}>Click here to activate your account.</a>
        </div>
      `
    });
    console.log('Mail sent successfully!');
  } catch (error) {
    console.error(error);
  }
};

export const verifyEmail = async (req, res) => { // Note that this request doesn't have a body.
  try {
    const token = await Token.findOne({userToken: req.params.token});
    await User.updateOne({_id: token.userId}, {$set: {verified: true}}); // "$set" specifies which properties to update.
    await Token.findByIdAndDelete(token._id);
    res.send('Email verified successfully. You may sign in now.');
  } catch (error) {
    res.send('Email verification failed.');
  }
};

export const sendResetPasswordEmail =  async (email, link) => {
  try {

    // The email sender.
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD // The App password of the Google account, not the normal password.
      }
    });

    // Email content.
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - LinGPT',
      text: 'Thank you for using LinGPT.',
      html: `
        <div>
          <p>Thank you for using LinGPT.</p>
          <a href=${link}>Click here to reset your password.</a>
        </div>
      `
    });
    console.log('Mail sent successfully!');
  } catch (error) {
    console.error(error);
  }
};

export const resetPassword = async (req, res) => {
  const {password} = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  try {
    const resetToken = await ResetToken.findOne({userToken: req.params.resetToken});
    if (!resetToken) return next(errorHandler(404, 'Oops! Password reset link expired!'));
    const updateUser = await User.findByIdAndUpdate(resetToken.userId, {password: hashedPassword}, {new: true});
    if (!updateUser) return next(errorHandler(404, 'Oops! Account not found!'));

    // This is how we exclude the password from the response sent to the user for security purpose.
    const {password, ...rest} = updateUser._doc; // "rest" stores all attributes of "validUser._doc", which is the User record's information sent through the response, except the password.

    res.status(200).json(rest);
  } catch(error) {
    next(error);
  }
};