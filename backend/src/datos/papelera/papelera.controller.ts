import { Controller, Get, Post, Delete, Param, Body, Put } from '@nestjs/common';
import { PapeleraService } from './papelera.service';
import { AppGateway } from '../../app.gateway';

@Controller('api/papelera/medicos')
export class PapeleraMedicosController {
  constructor(
    private readonly papeleraService: PapeleraService,
  ) {}

  @Get()
  obtenerDoctoresPapelera() {
    return this.papeleraService.obtenerDoctoresPapelera();
  }
}

@Controller('api/papelera/medicos/restaurar')
export class PapeleraMedicosRestaurarController {
  constructor(
    private readonly papeleraService: PapeleraService,
  ) {}

  @Put(':mat')
  restaurarMedico(@Param('mat') mat: string) {
    return this.papeleraService.restaurarMedico(mat);
  }
}

@Controller('api/papelera/medicos/definitivo')
export class PapeleraMedicosDefinitivoController {
  constructor(
    private readonly papeleraService: PapeleraService,
  ) {}

  @Delete(':mat')
  eliminarDefinitivo(@Param('mat') mat: string) {
    return this.papeleraService.eliminarDefinitivoMedico(mat);
  }
}




@Controller('api/papelera/consultas')
export class PapeleraConsultasController {
  constructor(private readonly papeleraService: PapeleraService) {}

  @Get()
  obtenerConsultas() {
    return this.papeleraService.obtenerConsultasPapelera();
  }
}

@Controller('api/papelera/consultas/restaurar')
export class PapeleraConsultasRestaurarController {
  constructor(private readonly papeleraService: PapeleraService) {}

  @Put(':id')
  restaurar(@Param('id') id: number) {
    return this.papeleraService.restaurarConsulta(+id);
  }
}

@Controller('api/papelera/consultas/definitivo')
export class PapeleraConsultasDefinitivoController {
  constructor(private readonly papeleraService: PapeleraService) {}

  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.papeleraService.eliminarDefinitivoConsulta(+id);
  }
}





@Controller('api/papelera/descargosAdministrativos')
export class PapeleraDescargosController {
  constructor(private readonly papeleraService: PapeleraService) {}

  @Get()
  obtenerDescargos() {
    return this.papeleraService.obtenerDescargosPapelera();
  }
}

@Controller('api/papelera/descargosAdministrativos/restaurar')
export class PapeleraDescargosRestaurarController {
  constructor(private readonly papeleraService: PapeleraService) {}

  @Put(':idd')
  restaurar(@Param('idd') idd: number) {
    return this.papeleraService.restaurarDescargo(+idd);
  }
}

@Controller('api/papelera/descargosAdministrativos/definitivo')
export class PapeleraDescargosDefinitivoController {
  constructor(private readonly papeleraService: PapeleraService) {}

  @Delete(':idd')
  eliminar(@Param('idd') idd: number) {
    return this.papeleraService.eliminarDefinitivoDescargo(+idd);
  }
}




@Controller('api/papelera/medicamentos')
export class PapeleraMedicamentosController {
  constructor(private readonly papeleraService: PapeleraService) {}

  @Get()
  obtenerMedicamentos() {
    return this.papeleraService.obtenerMedicamentosPapelera();
  }
}

@Controller('api/papelera/medicamentos/restaurar')
export class PapeleraMedicamentosRestaurarController {
  constructor(private readonly papeleraService: PapeleraService) {}

  @Put(':codm')
  restaurar(@Param('codm') codm: string) {
    return this.papeleraService.restaurarMedicamento(codm);
  }
}

@Controller('api/papelera/medicamentos/definitivo')
export class PapeleraMedicamentosDefinitivoController {
  constructor(private readonly papeleraService: PapeleraService) {}

  @Delete(':codm')
  eliminar(@Param('codm') codm: string) {
    return this.papeleraService.eliminarDefinitivoMedicamento(codm);
  }
}





@Controller('api/papelera/medicamentosExternos')
export class PapeleraMedicamentosExternosController {
  constructor(private readonly papeleraService: PapeleraService) {}

  @Get()
  obtenerMedicamentosExternos() {
    return this.papeleraService.obtenerMedicamentosExternosPapelera();
  }
}

@Controller('api/papelera/medicamentosExternos/restaurar')
export class PapeleraMedicamentosExternosRestaurarController {
  constructor(private readonly papeleraService: PapeleraService) {}

  @Put(':idme')
  restaurar(@Param('idme') idme: number) {
    return this.papeleraService.restaurarMedicamentoExterno(+idme);
  }
}

@Controller('api/papelera/medicamentosExternos/definitivo')
export class PapeleraMedicamentosExternosDefinitivoController {
  constructor(private readonly papeleraService: PapeleraService) {}

  @Delete(':idme')
  eliminar(@Param('idme') idme: number) {
    return this.papeleraService.eliminarDefinitivoMedicamentoExterno(+idme);
  }
}





@Controller('api/papelera/pacientes')
export class PapeleraPacientesController {
  constructor(private readonly papeleraService: PapeleraService) {}

  @Get()
  obtenerPacientes() {
    return this.papeleraService.obtenerPacientesPapelera();
  }
}

@Controller('api/papelera/pacientes/restaurar')
export class PapeleraPacientesRestaurarController {
  constructor(private readonly papeleraService: PapeleraService) {}

  @Put(':ci')
  restaurar(@Param('ci') ci: string) {
    return this.papeleraService.restaurarPaciente(ci);
  }
}

@Controller('api/papelera/pacientes/definitivo')
export class PapeleraPacientesDefinitivoController {
  constructor(private readonly papeleraService: PapeleraService) {}

  @Delete(':ci')
  eliminar(@Param('ci') ci: string) {
    return this.papeleraService.eliminarDefinitivoPaciente(ci);
  }
}




