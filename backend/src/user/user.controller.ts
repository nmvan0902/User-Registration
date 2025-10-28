import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  async logout() {
    return { success: true, data: 'Logged out' };
  }
}
