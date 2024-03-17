import nodemailer from 'nodemailer';
import Token from '../models/token.model.js';
import User from '../models/user.model.js';

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

export const resetPassword = async (req, res) => {};