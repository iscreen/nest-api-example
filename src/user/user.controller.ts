import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuart } from '../auth/guard';
import { UserEditDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuart)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getUser(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: UserEditDto,
  ) {
    return this.userService.editUser(userId, dto);
  }
}
