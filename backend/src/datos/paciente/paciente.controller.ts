import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { AppGateway } from 'src/app.gateway';

@Controller('api/pacientes')
export class PacienteController {
    constructor(private readonly pacienteService: PacienteService, private readonly appGateway: AppGateway) {}

    @Get()
    async obtPacientes() {
        return this.pacienteService.obtPacientes();
    }

    @Get(':ci')
    async obtPacientePorCi(@Param('ci') ci: string) {
        return this.pacienteService.obtPacientePorCi(ci);
    }

    @Post()
    async crearPaciente(@Body() paciente: any) {
        this.appGateway.emitirActualizacion();
        return this.pacienteService.crearPaciente(paciente);
    }

    @Put(':ci')
    async actualizaPaciente(@Param('ci') ci: string, @Body() paciente: any) {
        this.appGateway.emitirActualizacion();
        return this.pacienteService.actualizaPaciente(ci, paciente);
    }

    @Delete(':ci')
    async eliminaPaciente(@Param('ci') ci: string, @Body('usuario') usuario: string) {
        this.appGateway.emitirActualizacion();
        return this.pacienteService.eliminaPaciente(ci, usuario || 'admin');
    }
}
