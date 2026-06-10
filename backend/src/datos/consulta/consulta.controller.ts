import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { crearConsultaDto } from './dto/consulta.dto';
import { AppGateway } from 'src/app.gateway';

@Controller('api/consultas')
export class ConsultaController {
    constructor(private readonly consultaService: ConsultaService, private readonly appGateway: AppGateway) { }

    @Get()
    async obtConsultas() {
        return this.consultaService.obtConsultas();
    }

    @Get(':idc')
    async obtConsultaPorId(@Param('idc') idc: string) {
        return this.consultaService.obtConsultaPorIdc(idc);
    }

    @Post()
    async crearConsulta(@Body() consulta: crearConsultaDto) {
        this.appGateway.emitirActualizacion();
        return this.consultaService.crearConsulta(consulta);
    }

    @Put(':idc')
    async actualizaConsulta(@Param('idc') idc: string, @Body() consulta: crearConsultaDto) {
        this.appGateway.emitirActualizacion();
        return this.consultaService.actualizaConsulta(idc, consulta);
    }

    @Delete(':idc')
    async eliminaConsulta(@Param('idc') idc: string, @Body('usuario') usuario: string) {
        this.appGateway.emitirActualizacion();
        return this.consultaService.eliminaConsulta(idc, usuario || 'admin');
    }
}
