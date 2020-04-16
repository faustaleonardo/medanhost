import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as htmlToText from 'html-to-text';
import emailTemplateOtpCode from './emailTemplateOtpCode';
import emailTemplatePaymentReminder from './emailTemplatePaymentReminder';

interface Credentials {
  [key: string]: string;
}

@Injectable()
export class EmailService {
  private _firstName: string;
  private _to: string;
  private _otpCode: number;
  private _from = 'no-reply@medanhost.xyz';
  private _;

  _newTransport(): any {
    // for development
    // return nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: Number(process.env.EMAIL_PORT),
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });

    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
  }

  async _send(subject: string, option: string): Promise<void> {
    let html: any;
    if (option === 'otp-code') {
      html = emailTemplateOtpCode(this._firstName, this._otpCode);
    } else {
      html = emailTemplatePaymentReminder(process.env.URL);
    }

    const mailOptions = {
      from: this._from,
      to: this._to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    await this._newTransport().sendMail(mailOptions);
  }

  async sendOtpCode(credentials: Credentials, otpCode: number): Promise<void> {
    this._firstName = credentials.firstName;
    this._to = credentials.email;
    this._otpCode = otpCode;

    await this._send('Medanhost OTP Code', 'otp-code');
  }

  async sendPaymentReminder(credentials: Credentials): Promise<void> {
    this._firstName = credentials.firstName;
    this._to = credentials.email;

    await this._send('Medanhost Booking', 'payment reminder');
  }
}
