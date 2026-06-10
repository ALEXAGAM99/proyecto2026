import { Module } from '@nestjs/common';
import { BasededatosController } from './basededatos.controller';
import { BasededatosService } from './basededatos.service';

@Module({
  controllers: [BasededatosController],
  providers: [BasededatosService]
})
export class BasededatosModule {}
