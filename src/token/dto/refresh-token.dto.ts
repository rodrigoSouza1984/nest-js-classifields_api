import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto {
    @ApiProperty({
        description: 'REQUIRED - old token that user recive with login and save in the data base',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODI2NDIzMjMsImV4cCI6MTY4MjY3MjMyM30.9qxFgMHM3Q4nUxi67uWWtK1TcJ5UeUWkB7thby9GC8M'
    })
    oldToken: string;    
}