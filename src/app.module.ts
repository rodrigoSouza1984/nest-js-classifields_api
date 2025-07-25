import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmailSendModule } from './email-send/email-send.module';
import { MediaAvatarModule } from './user-media-avatar/media-avatar.module';
import { TokenModule } from './token/token.module';
import { ProductModule } from './product/product.module';
import { ProductMediaModule } from './product-media/product-media.module';
import { MercadoPagoModule } from './mercado-pago/mercado-pago.module';
import { FirebasePushAndDeviceRegisterModule } from './firebase-push-and-device-register/firebase-push-and-device-register.module';
import { PushNotificationDataBaseModule } from './push-notification-data-base/push-notification-data-base.module';
import { PurchaseModule } from './purchase/purchase.module';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
  TypeOrmModule.forRootAsync({
    useFactory: () => ({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      // type: 'mysql',
      // host: process.env.DB_HOST,
      // port: parseInt(process.env.DB_PORT) || 3306,
      // username: process.env.DB_USER,
      // password: process.env.DB_PASSWORD,
      // database: process.env.DB_NAME,
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // authPlugins: {
      //   mysql_native_password: () => require('mysql2-aurora-data-api-plugin')
      // },      
      autoLoadEntities: true,
      synchronize: true,
      logging: false,      
    }),
  }),
    UserModule,
    AuthModule,
    EmailSendModule,
    MediaAvatarModule,
    TokenModule,
    ProductModule,
    ProductMediaModule,
    MercadoPagoModule, 
    FirebasePushAndDeviceRegisterModule, PushNotificationDataBaseModule, PurchaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
