import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { basededatos } from '../../basededatos/basededatos.provider';
import { AuditoriaModule } from '../auditoria/auditoria.module';

@Module({
  imports: [AuditoriaModule],
  controllers: [DoctorController],
  providers: [DoctorService, ...basededatos]
})
export class DoctorModule {}
