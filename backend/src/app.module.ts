import { Module } from '@nestjs/common';
import { BasededatosModule } from './basededatos/basededatos.module';
import { GatewayModule } from './gateway.module';
import { DeviceModule } from './device/device.module';
import { DoctorModule } from './datos/doctor/doctor.module';
import { PacienteModule } from './datos/paciente/paciente.module';
import { ConsultaModule } from './datos/consulta/consulta.module';
import { DescargoadministrativoModule } from './datos/descargoadministrativo/descargoadministrativo.module';
import { MedicamentoModule } from './datos/medicamento/medicamento.module';
import { MedicamentoexternoModule } from './datos/medicamentoexterno/medicamentoexterno.module';
import { AuditoriaModule } from './datos/auditoria/auditoria.module';
import { LoginModule } from './datos/login/login.module';
import { PapeleraModule } from './datos/papelera/papelera.module';

@Module({
  imports: [
    DoctorModule,
    PacienteModule,
    ConsultaModule,
    DescargoadministrativoModule,
    MedicamentoModule,
    MedicamentoexternoModule,
    AuditoriaModule,
    LoginModule,
    PapeleraModule,

    BasededatosModule,
    GatewayModule,
    DeviceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
