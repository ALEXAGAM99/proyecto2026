import { Controller } from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';
import { registrarAccesoDto, registrarSalidaDto } from './dto/auditoria.dto';
import { Body, Get, Post } from '@nestjs/common';
import { AppGateway } from '../../app.gateway';

@Controller('api/auditoria')
export class AuditoriaController {
    constructor(
        private readonly auditoriaService: AuditoriaService,
        private readonly appGateway: AppGateway,
    ) { }

    @Get()
    obtAuditoria() {
        return this.auditoriaService.obtAuditoria();
    }

    @Post('acceso')
    registrarAcceso(@Body() acceso: registrarAccesoDto) {
        return this.auditoriaService.registrarAcceso(acceso);
    }

    @Post('salida')
    async registrarSalida(@Body() salida: registrarSalidaDto) {
        const result = await this.auditoriaService.registrarSalida(salida);

        this.appGateway.forzarLogout(salida.session_id);

        this.appGateway.server.emit('logout_global', {
            session_id: salida.session_id
        });

        return result;
    }
}

