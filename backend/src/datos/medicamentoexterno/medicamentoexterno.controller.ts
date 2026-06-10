import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MedicamentoexternoService } from './medicamentoexterno.service';
import { AppGateway } from '../../app.gateway';
import { actualizarMedicamentoExternoDto, crearMedicamentoExternoDto } from './dto/medicamentoexterno.dto';

@Controller('api/medicamentosExternos')
export class MedicamentoexternoController {
    constructor(
        private readonly medicamentoexternoService: MedicamentoexternoService,
        private readonly appGateway: AppGateway,
    ) {}

    @Get()
    obtMedicamentoExterno() {
        return this.medicamentoexternoService.obtMedicamentoExterno();
    }

    @Get(':idme')
    obtMedicamentoExternoPorIdme(@Param('idme') idme: string) {
        return this.medicamentoexternoService.obtMedicamentoExternoPorIdme(idme);
    }

    @Post()
    crearMedicamentoExterno(@Body() medicamentoexterno: crearMedicamentoExternoDto) {
        this.appGateway.emitirActualizacion();
        return this.medicamentoexternoService.crearMedicamentoExterno(medicamentoexterno);
    }

    @Put(':idme')
    actualizarMedicamentoExterno(@Param('idme') idme: string, @Body() medicamentoexterno: actualizarMedicamentoExternoDto) {
        this.appGateway.emitirActualizacion();
        return this.medicamentoexternoService.actualizaMedicamentoExterno(idme, medicamentoexterno);
    }

    @Delete(':idme')
    eliminarMedicamentoExterno(@Param('idme') idme: string, @Body('usuario') usuario: string) {
        this.appGateway.emitirActualizacion();
        return this.medicamentoexternoService.eliminaMedicamentoExterno(idme, usuario || 'admin');
    }
}
