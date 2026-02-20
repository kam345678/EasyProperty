// src/auth/auth.controller.ts

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import type { Request } from 'express';

import { AuthService } from './auth.service';

import { AuthDto } from './dto/auth.dto';

import { AccessTokenGuard } from './guards/access-token.guard';

import { RefreshTokenGuard } from './guards/refresh-token.guard';

import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('createAccount')
  createAccount(@Body() dto: AuthDto) {
    return this.authService.createAccount(dto);
  }

  // จำกัดการยิง signin เพื่อลด brute force
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(
    @Req()
    req: Request & {
      user: { sub: string; email: string; role: string };
    },
  ) {
    return req.user;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refresh(
    @Req()
    req: Request & {
      user: { sub: string; email: string; role: string; refreshToken: string };
    },
  ) {
    const { sub: userId, email, role, refreshToken } = req.user;

    return this.authService.refreshTokens(userId, email, role, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  logout(@Req() req: Request & { user: { userId: string } }) {
    return this.authService.logout(req.user.userId);
  }
}
