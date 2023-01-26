import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

// Responsible for handling business logic

// @Injectable() is a decorator that marks a class as available to be injected as a dependency.
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);
    // create the user
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      delete user.hash;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find the user
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if the user doesn't exist, throw an error
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    // compare the password
    const valid = await argon.verify(user.hash, dto.password);
    // if the password is invalid, throw an error
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    // return the user
    return this.signToken(user);
  }

  // we aren't using async/await here because we don't need to wait for the token to be signed
  // we can just return the promise
  async signToken(user: User): Promise<{ access_token: string }> {
    // this function will sign a JWT token and return it
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
