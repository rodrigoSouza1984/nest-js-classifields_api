import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); 
  
  const config = new DocumentBuilder()
    .setTitle('Documentation made with Swagger - Classifields API')
    .setDescription(
      'Backend of aplication about sales anuncies',
    )
    .setVersion('1.0')
    .addTag('user')    
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(parseInt(process.env.PORT) || 3000);
}
bootstrap();
