import { Body, Controller, Post, Res, Req } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const user = await this.userService.register(dto);
    return { success: true, data: user };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.userService.login(dto);
    return { success: true, data: user };
  }

  // Stateless logout endpoint (no server session). Frontend can clear client storage.
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // Try to decode refresh token to find user id (non-critical). If present, revoke.
    const rt = req.cookies?.['refresh_token'] as string | undefined;
    try {
      if (rt) {
        const payload = await this.jwtService.verifyAsync(rt, { secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret' });
        if (payload?.sub) await this.userService.logout(payload.sub);
      }
    } catch {}
    res.clearCookie('refresh_token', this.cookieOptions());
    return { success: true, data: 'Logged out' };
  }

  @Post('login-jwt')
  async loginJwt(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.userService.loginJwt(dto);
    res.cookie('refresh_token', result.refreshToken, this.cookieOptions());
    return { success: true, data: { user: result.user, accessToken: result.accessToken } };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rt = req.cookies?.['refresh_token'];
    if (!rt) return { success: false, data: null } as any;
    // Decode to get user id
  const payload = await this.jwtService.verifyAsync(rt, { secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret' });
  const { accessToken, refreshToken } = await this.userService.refresh(payload.sub, rt);
    res.cookie('refresh_token', refreshToken, this.cookieOptions());
    return { success: true, data: { accessToken } };
  }

  private cookieOptions() {
    const isProd = process.env.NODE_ENV === 'production';
    return {
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    } as const;
  }
}
