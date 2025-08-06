import { Module } from '@nestjs/common';
import { EmailService } from './sendgrid/email.service';
import { SendGridClient } from './sendgrid/sendgrid-client';
import { TwilioService } from './twilio/twilio.service';


@Module({
  imports: [],
  controllers: [],
  providers: [EmailService,SendGridClient,TwilioService],
  exports: [EmailService,TwilioService],
})
export class LibsModule {}
