import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EMAIL_CONFIGURATION } from '../configuration';

@Injectable()
export class EmailService {
  async sendEmail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: EMAIL_CONFIGURATION.email,
        pass: EMAIL_CONFIGURATION.emailPassword,
      },
    });

    const mailOptions = {
      from: 'Your Name <your_email@gmail.com>',
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
  }
}
