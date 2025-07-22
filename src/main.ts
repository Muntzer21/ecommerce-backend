import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // <--- THIS IS CRUCIAL
      transformOptions: {
        enableImplicitConversion: true, // Good to have for converting strings to numbers
      },
    }),
  );
   const config = new DocumentBuilder()
     .setTitle('store')
     .setDescription('The Store API description')
     .setVersion('1.0')
     .build();
   const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);
  
  app.use(passport.initialize());
  // app.use(passport.session());
  await app.listen(3000);
}
bootstrap();
