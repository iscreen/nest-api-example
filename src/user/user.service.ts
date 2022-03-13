import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserEditDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  editUser = async (
    userId: number,
    dto: UserEditDto,
  ) => {
    const user = this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    delete (await user).encrypted_password;
    return user;
  };
}
