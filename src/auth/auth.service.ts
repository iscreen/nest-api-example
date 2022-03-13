import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  signup = async (dto: RegisterDto) => {
    const encrypted_password = await argon.hash(
      dto.password,
    );

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
          encrypted_password,
        },
      });
      this.signToken(user.id, user.email);
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credential token',
          );
        }
      }
    }
  };

  login = async (dto: AuthDto) => {
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    if (!user) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }
    const pwMatches = await argon.verify(
      user.encrypted_password,
      dto.password,
    );
    if (!pwMatches) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }

    return this.signToken(user.id, user.email);
  };

  signToken = async (
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> => {
    const payload = {
      sub: userId,
      email,
    };

    const jwttoken = await this.jwt.signAsync(
      payload,
      {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get(
          'JWT_TOKEN_EXPIRESIN',
        ),
      },
    );

    return {
      access_token: jwttoken,
    };
  };
}
