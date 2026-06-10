import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { basededatos } from '../../basededatos/basededatos.provider';

@Module({
  controllers: [LoginController],
  providers: [LoginService, ...basededatos]
})
export class LoginModule {}
