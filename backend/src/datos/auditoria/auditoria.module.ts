import { Module } from '@nestjs/common';
import { AuditoriaController } from './auditoria.controller';
import { AuditoriaService } from './auditoria.service';
import { basededatos } from '../../basededatos/basededatos.provider';

@Module({
  controllers: [AuditoriaController],
  providers: [AuditoriaService, ...basededatos],
  exports: [AuditoriaService]
})
export class AuditoriaModule {}
