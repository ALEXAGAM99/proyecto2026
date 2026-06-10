import { Controller, Get, Post, Put, Delete, Param, Body, Patch, Req } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { AppGateway } from '../../app.gateway';
import { crearDoctorDto } from './dto/doctor.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';

@Controller('api/medicos')
export class DoctorController {
    constructor(
        private readonly doctorService: DoctorService,
        private readonly appGateway: AppGateway,
        private readonly auditoriaService: AuditoriaService,
    ) { }

    @Get()
    obtDoctor() {
        return this.doctorService.obtDoctor();
    }

    @Get(':mat')
    obtDoctorPorMat(@Param('mat') mat: string) {
        return this.doctorService.obtDoctorPorMat(mat);
    }

    @Post()
    async crearDoctor(@Body() doctor: crearDoctorDto) {
        const result = await this.doctorService.crearDoctor(doctor);
        this.appGateway.emitirActualizacion();
        return result;
    }

    @Put(':mat')
    async actualizarDoctor(@Param('mat') mat: string, @Body() doctor: crearDoctorDto) {
        const result = await this.doctorService.actualizaDoctor(mat, doctor);
        this.appGateway.emitirActualizacion();
        return result;
    }

    @Delete(':mat')
    async eliminarDoctor(@Param('mat') mat: string, @Body('usuario') usuario: string) {
        const result = await this.doctorService.eliminaDoctor(mat, usuario || 'admin');
        this.appGateway.emitirActualizacion();
        return result;
    }

    @Post('login')
    async login(@Body() credentials: { mat: string; contra: string; ipCliente?: string; navegador?: string }, @Req() req: any) {
        const result = await this.doctorService.login(credentials.mat, credentials.contra);

        const ipReal = credentials.ipCliente || req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'] || '';
        const isFlutter = !userAgent || userAgent.toLowerCase().includes('dart') || userAgent.toLowerCase().includes('flutter');
        const navegadorReal = isFlutter
            ? 'Flutter App (Mobile)'
            : (credentials.navegador || userAgent);
        const location = isFlutter ? 'Mobile Access' : (req.headers['origin'] || 'Web');

        if (result.success) {
            const auditRecord = await this.auditoriaService.registrarAcceso({
                usuario: result.user.mat,
                ip: ipReal,
                evento: 'Ingreso',
                navegador: navegadorReal,
                location,
            });

            this.appGateway.emitirActualizacion();

            const sessionId = auditRecord?.session_id ?? null;
            return { ...result, session_id: sessionId };
        }

        await this.auditoriaService.registrarAcceso({
            usuario: credentials.mat,
            ip: ipReal,
            evento: 'Intento Fallido',
            navegador: navegadorReal,
            location,
        });

        return result;
    }

    @Patch(':mat/cambiar-contrasena')
    cambiarContrasena(
        @Param('mat') mat: string,
        @Body() body: { contraActual: string; contraNueva: string },
    ) {
        return this.doctorService.cambiarContrasena(mat, body.contraActual, body.contraNueva);
    }
}
