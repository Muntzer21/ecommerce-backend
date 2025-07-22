import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private readonly config: ConfigService) {}
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: this.config.get<string>('EMAIL_USER'),
      pass: this.config.get<string>('EMAIL_PASSWORD'), // Use an app password or secure credentials
    },
  });

  async sendEmail(email: string) {
    await this.transporter.sendMail({
      from:
        '"E-Commerce Store" <' + this.config.get<string>('EMAIL_USER') + '>',
      to: email,
      subject: 'Your Order Has Been Delivered!',
      text: 'for more products visit us stie to getsweet products ',
    });
  }
}
