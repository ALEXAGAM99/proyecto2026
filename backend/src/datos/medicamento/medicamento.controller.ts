import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MedicamentoService } from './medicamento.service';
import { ActualizarMedicamentoDto, CrearMedicamentoDto } from './dto/medicamento.dto';
import { AppGateway } from 'src/app.gateway';

@Controller('api/medicamentos')
export class MedicamentoController {
    constructor(
        private readonly medicamentoService: MedicamentoService,
        private readonly appGateway: AppGateway,
    ) { }

    @Get()
    obtMedicamento() {
        return this.medicamentoService.obtMedicamento();
    }

    @Get(':codm')
    obtMedicamentoPorCodm(@Param('codm') codm: string) {
        return this.medicamentoService.obtMedicamentoPorCodm(codm);
    }

    @Post()
    crearMedicamento(@Body() medicamento: CrearMedicamentoDto) {
        this.appGateway.emitirActualizacion();
        return this.medicamentoService.crearMedicamento(medicamento);
    }

    @Put(':codm')
    actualizarMedicamento(@Param('codm') codm: string, @Body() medicamento: ActualizarMedicamentoDto) {
        this.appGateway.emitirActualizacion();
        return this.medicamentoService.actualizaMedicamento(codm, medicamento);
    }

    @Delete(':codm')
    eliminarMedicamento(@Param('codm') codm: string, @Body('usuario') usuario: string) {
        this.appGateway.emitirActualizacion();
        return this.medicamentoService.eliminaMedicamento(codm, usuario || 'admin');
    }
}
