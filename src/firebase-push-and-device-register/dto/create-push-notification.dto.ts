export class CreatePushNotificationDto {
    tokens: string[]
    notification: NotificationDto
    data?: DataDto | {}
}

export class NotificationDto{
    title?: string
    body?: string
    imageUrl?: string
}

export class DataDto {
    [key: string]: string
}






