/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/mail';
import * as SendGrid from '@sendgrid/mail';
// import { ConstantConfig } from '../../constant/constant.config';

@Injectable()
export class SendGridClient {
  constructor() {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  }
  async send(mail: MailDataRequired): Promise<void> {
    try {
      await SendGrid.send(mail);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
