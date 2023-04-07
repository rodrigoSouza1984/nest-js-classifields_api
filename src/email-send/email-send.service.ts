import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailSendService {

    constructor(private readonly mailerService: MailerService) {}

    async sendEmail(email: string, data: any): Promise<void> {

        try{

            const sendEmail = await this.mailerService.sendMail({
                from: 'apks_vini_ars@hotmail.com',
                to: email,
                subject: data.subject,
                text: data.text,
            })   

            console.log(sendEmail)

            return sendEmail

        }catch(err) {
            console.log(err, 'error')
            return err
        }
            
    }     
}

