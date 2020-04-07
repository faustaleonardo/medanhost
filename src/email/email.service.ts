import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as htmlToText from 'html-to-text';
import * as pug from 'pug';

interface Credentials {
  [key: string]: string;
}

@Injectable()
export class EmailService {
  private _firstName: string;
  private _to: string;
  private _otpCode: number;
  private _from = 'no-reply@medanhost.xyz';

  setUp(credentials: Credentials, otpCode: number) {
    this._firstName = credentials.firstName;
    this._to = credentials.email;
    this._otpCode = otpCode;
  }

  newTransport(): any {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template: string, subject: string): Promise<void> {
    const html = pug.renderFile(`../views/${template}.pug`, {
      firstName: this._firstName,
      otpCode: this._otpCode,
      subject,
    });

    const mailOptions = {
      from: this._from,
      to: this._to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendOtpCode(): Promise<void> {
    await this.send('otpCode', 'Medanhost OTP Code');
  }
}
