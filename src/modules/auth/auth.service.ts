import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthRepository } from './auth.repository';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthService {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser =
      await this.authRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.authRepository.create({
      ...dto,
      password: hashedPassword,
    });

    await this.usersRepository.create({
      userId: user._id.toString(),
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    return {
      message: 'Registration successful',
      user,
    };
  }

  async login(dto: LoginDto) {
    const user =
      await this.authRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return { accessToken, refreshToken, user };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user =
        await this.authRepository.findByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = {
        sub: user._id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
      });

      const refreshToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      });

      return { accessToken, refreshToken };

    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}