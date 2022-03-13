import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuart } from 'src/auth/guard';

@Controller('users')
export class UserController {

  @UseGuards(JwtGuart)
  @Get('me')
  getUser(@GetUser() user: User) {
    return user
  }
}
