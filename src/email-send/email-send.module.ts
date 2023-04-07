import { Module } from '@nestjs/common';
import { EmailSendService } from './email-send.service';
import { EmailSendController } from './email-send.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'hotmail',        
        auth: {
          user: 'apks_vini_ars@hotmail.com',
          pass: 'v/inicius02',
        },
      },
    }),
  ],
  controllers: [EmailSendController],
  providers: [EmailSendService]
})
export class EmailSendModule { }
