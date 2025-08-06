/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/mail';
import { SendGridClient } from './sendgrid-client';

@Injectable()
export class EmailService {
  constructor(private readonly sendGridClient: SendGridClient) {}

  async sendTestEmail(email: string, body: string): Promise<void> {
    const mail: MailDataRequired = {
      to: email,
      from: process.env.SENDGRID_FROM,
      subject: 'Test email',
      content: [{ type: 'text/plain', value: body }],
    };
    await this.sendGridClient.send(mail);
  }

  async sendEmailWithTemplate(email: string, token: string, name: string): Promise<void> {
    const mail: MailDataRequired = {
      to: email,
      cc: 'ssksamar2000@gmail.com',
      from: process.env.SENDGRID_FROM,
      templateId: 'd-6eba12f6a34a4bd697a6e35790ecd5d7',
      dynamicTemplateData: { 
          name,
          token,
          subject: 'Send Email with template' 
      },
    };
    await this.sendGridClient.send(mail);
}

}
