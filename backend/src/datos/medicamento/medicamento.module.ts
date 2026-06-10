import { Module } from '@nestjs/common';
import { MedicamentoController } from './medicamento.controller';
import { MedicamentoService } from './medicamento.service';
import { basededatos } from '../../basededatos/basededatos.provider';

@Module({
  controllers: [MedicamentoController],
  providers: [MedicamentoService, ...basededatos]
})
export class MedicamentoModule {}
