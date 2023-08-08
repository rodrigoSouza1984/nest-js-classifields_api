import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailSendService {

    constructor(private readonly mailerService: MailerService) { }

    async sendEmail(email: string, data: any): Promise<any> {

        try {

            const sendEmail = await this.mailerService.sendMail({
                from: 'apks_vini_ars@hotmail.com',
                to: email,
                subject: data.subject,
                text: data.text,
            })

            console.log(sendEmail)

            return sendEmail

        } catch (err) {
            if (err.driverError) {
                throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
              } else {
                if (err.status >= 300 && err.status < 500) {
                  throw err
                } else if (err.message) {
                  throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
                } else {
                  throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
                }
              }
        }

    }
}

