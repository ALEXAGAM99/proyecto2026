import { Module } from '@nestjs/common';
import { ConsultaController } from './consulta.controller';
import { ConsultaService } from './consulta.service';
import { basededatos } from '../../basededatos/basededatos.provider';

@Module({
  controllers: [ConsultaController],
  providers: [ConsultaService, ...basededatos]
})
export class ConsultaModule {}
