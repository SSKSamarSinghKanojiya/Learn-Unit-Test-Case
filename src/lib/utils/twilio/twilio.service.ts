// import {
//   Injectable,
//   BadRequestException,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { Twilio } from 'twilio';

// import { config } from 'dotenv';
// // import { Twilio } from 'twilio';

// config(); // load .env

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioNumber = process.env.TWILIO_FROM;
// @Injectable()
// export class TwilioService {
//   private client: Twilio;

//   constructor() {
//     if (!accountSid || !authToken || !twilioNumber) {
//       throw new Error('Twilio environment variables are not properly set.');
//     }
//     this.client = new Twilio(accountSid, authToken);
//   }

//   async sendSMSService(phone: string, message: string): Promise<any> {
//     if (!phone || !message) {
//       throw new BadRequestException(
//         'Phone number and message are required to send SMS.',
//       );
//     }
//     try {
//       return await this.client.messages.create({
//         from: twilioNumber,
//         to: phone,
//         body: message,
//       });
//     } catch (e) {
//       throw new InternalServerErrorException(
//         `Failed to send SMS: ${e.message}`,
//       );
//     }
//   }

//   async makeCallService(phone: string, message: string): Promise<any> {
//     if (!phone) {
//       throw new BadRequestException('Phone number is required to make a call.');
//     }

//     try {
//       return await this.client.calls.create({
//         twiml: `<Response><Say>${message}</Say></Response>`,
//         to: phone,
//         from: twilioNumber,
//       });
//     } catch (e) {
//       throw new InternalServerErrorException(
//         `Failed to make call: ${e.message}`,
//       );
//     }
//   }

//   async checkPhoneService(number: string): Promise<boolean> {
//     if (!number) {
//       throw new BadRequestException('Phone number is required to check.');
//     }

//     try {
//       const phoneNumber = await this.client.lookups.v2
//         .phoneNumbers(number)
//         .fetch({ fields: 'sim_swap,call_forwarding' });
//       return phoneNumber.valid;
//     } catch (e) {
//       throw new InternalServerErrorException(
//         `Failed to check phone number: ${e.message}`,
//       );
//     }
//   }
// }


// src/twilio/twilio.service.ts
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private client: Twilio;


  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials are not set in environment variables');
    }

    this.client = new Twilio(accountSid, authToken);
  }

  async sendSMS(phone: string, message: string) {
    if (!phone || !message) {
      throw new BadRequestException('Phone number and message are required');
    }

    try {
      return await this.client.messages.create({
        from: process.env.TWILIO_FROM,
        to: phone,
        body: message,
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to send SMS: ${error.message}`);
    }
  }

  async makeCall(phone: string, message: string) {
    if (!phone) {
      throw new BadRequestException('Phone number is required');
    }

    try {
      return await this.client.calls.create({
        twiml: `<Response><Say>${message}</Say></Response>`,
        to: phone,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to make call: ${error.message}`);
    }
  }
}
