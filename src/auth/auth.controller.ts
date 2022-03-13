import { Body, Controller, HttpCode, HttpStatus, ParseIntPipe, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.service.login(dto)
  }

  @Post('signup')
  signup(@Body() dto: RegisterDto) {
    return this.service.signup(dto)
  }
}
