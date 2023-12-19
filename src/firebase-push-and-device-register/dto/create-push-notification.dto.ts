import { ApiProperty } from "@nestjs/swagger"

export class CreatePushNotificationDto {

    @ApiProperty({
        description: 'REQUIRED - array of tokens to send push cause send all send []',
        example: `tokens: ['asasasas', 'asasasas'] or token: []` ,
    })
    tokens: string[]
        
    notification: NotificationDto

    @ApiProperty({
        description: 'REQUIRED - proprety type DataDto',
        example: `data: [key: string]: string,  or {} example in insominia "data": {
            "key1": "value1",
            "key2": "value2",
            "key3": "value3"
          }, obs: send this field convert in stringfy, "data": JSON.stringify({
            "key1": "value1",
            "key2": "value2",
            "key3": "value3"
          })` ,
    })
    data?: DataDto | {}

    @ApiProperty({
        description: 'optional - name icon that use in front to show message',
        example: `icon: 'telephone'` ,
    })
    icon?: string
}

export class NotificationDto{

    @ApiProperty({
        description: 'OPTIONAL Title msg notification',
        example: `title?: string` ,
    })
    title?: string

    @ApiProperty({
        description: 'OPTIONAL BODY msg notification',
        example: `body?: string` ,
    })
    body?: string

    @ApiProperty({
        description: 'OPTIONAL Image to msg notification',
        example: `imageUrl?: string` ,
    })
    imageUrl?: string
}

export class DataDto {    
    [key: string]: string
}






