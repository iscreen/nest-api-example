import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }

  signup = async (dto: RegisterDto) => {
    const encrypted_password = await argon.hash(dto.password)

    // const user = await this.prisma.user.create({
    //   data: {
    //     email: dto.email,
    //     encrypted_password
    //   },
    //   select: {
    //     id: true,
    //     email: true,
    //     firstName: true,
    //     lastName: true,
    //     createdAt: true
    //   }
    // });
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          encrypted_password
        }
      });
      delete user.encrypted_password
      return user
    } catch(error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException("Credential token")
        }
      }
    }

  }

  login = async (dto: AuthDto) => {

    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    })

    if (!user) {
      throw new ForbiddenException(
        'Credentials incorrect'
      )
    }
    const pwMatches = await argon.verify(user.encrypted_password, dto.password)
    if (!pwMatches) {
      throw new ForbiddenException(
        'Credentials incorrect'
      )
    }

    delete user.encrypted_password

    return user
  }

}
