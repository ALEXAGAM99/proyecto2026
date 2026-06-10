import { Module } from '@nestjs/common';
import { PacienteController } from './paciente.controller';
import { PacienteService } from './paciente.service';
import { basededatos } from '../../basededatos/basededatos.provider';

@Module({
  controllers: [PacienteController],
  providers: [PacienteService, ...basededatos]
})
export class PacienteModule {}
