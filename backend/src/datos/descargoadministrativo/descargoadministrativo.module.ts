import { Module } from '@nestjs/common';
import { DescargoadministrativoService } from './descargoadministrativo.service';
import { DescargoadministrativoController } from './descargoadministrativo.controller';
import { basededatos } from '../../basededatos/basededatos.provider';

@Module({
  controllers: [DescargoadministrativoController],
  providers: [DescargoadministrativoService, ...basededatos],
})
export class DescargoadministrativoModule {}
