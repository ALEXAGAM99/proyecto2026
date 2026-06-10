import { Module } from '@nestjs/common';
import { MedicamentoexternoController } from './medicamentoexterno.controller';
import { MedicamentoexternoService } from './medicamentoexterno.service';
import { basededatos } from '../../basededatos/basededatos.provider';

@Module({
  controllers: [MedicamentoexternoController],
  providers: [MedicamentoexternoService, ...basededatos]
})
export class MedicamentoexternoModule {}
