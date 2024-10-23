import { Injectable } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/mail';

import { SendGridClient } from './sendgrid-client';

@Injectable()
export class EmailService {
  constructor(private readonly sendGridClient: SendGridClient) {}

  async sendVerificationEmail(
    recipient: string,
    verificationCode: string
  ): Promise<void> {
    const mail: MailDataRequired = {
      to: recipient,
      // cc: 'test@gmail.com', // Assuming we want to send a copy to this email
      from: process.env.EMAIL_SENDER, // Approved sender ID in Sendgrid
      templateId: process.env.EMAIL_TEMPLATE_ID,
      dynamicTemplateData: {
        verificationCode,
        subject: 'Send Email with template',
      },
    };
    await this.sendGridClient.send(mail);
  }
}
