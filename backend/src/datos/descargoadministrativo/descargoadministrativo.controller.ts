import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DescargoadministrativoService } from './descargoadministrativo.service';
import { CrearDescargoadministrativoDto } from './dto/descargoadministrativo.dto';
import { AppGateway } from 'src/app.gateway';

@Controller('api/descargosAdministrativos')
export class DescargoadministrativoController {
  constructor(
    private readonly descargoadministrativoService: DescargoadministrativoService,
    private readonly appGateway: AppGateway,
  ) {}

  @Get()
  obtDescargoadministrativo() {
    return this.descargoadministrativoService.obtDescargoadministrativo();
  }

  @Get(':idd')
  obtDescargoadministrativoPorId(@Param('idd') idd: string) {
    return this.descargoadministrativoService.obtDescargoadministrativoPorIdd(idd);
  }

  @Post()
  crearDescargoadministrativo(@Body() descargoadministrativo: CrearDescargoadministrativoDto) {
    this.appGateway.emitirActualizacion();
    return this.descargoadministrativoService.crearDescargoadministrativo(descargoadministrativo);
  }

  @Put(':idd')
  actualizarDescargoadministrativo(@Param('idd') idd: string, @Body() descargoadministrativo: CrearDescargoadministrativoDto) {
    this.appGateway.emitirActualizacion();
    return this.descargoadministrativoService.actualizarDescargoadministrativo(idd, descargoadministrativo);
  }

  @Delete(':idd')
  eliminarDescargoadministrativo(@Param('idd') idd: string, @Body('usuario') usuario: string) {
    this.appGateway.emitirActualizacion();
    return this.descargoadministrativoService.eliminarDescargoadministrativo(idd, usuario || 'admin');
  }
}
