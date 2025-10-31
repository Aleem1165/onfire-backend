import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { nodemailerPass, nodemailerUser } from '../config/env';
import { SendMailOptions } from '../types';

export const sendForgotPasswordEmail = async ({ to, subject, otp, name }: SendMailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: nodemailerUser,
        pass: nodemailerPass,
      },
    });

    const templatePath = path.join(__dirname, '../templates/forgotPassword.html');
    let html = fs.readFileSync(templatePath, 'utf-8');
    html = html.replace('{{OTP}}', otp);
    html = html.replace('{{name}}', name);

    const mailOptions = {
      from: `"On Fire" <${nodemailerUser}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${to}`, info.response);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
};
