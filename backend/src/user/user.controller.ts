import { 
  Controller, 
  Post, 
  Body, 
  HttpStatus, 
  HttpCode,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as jwt from 'jsonwebtoken';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<{
    message: string;
    user: UserResponseDto;
  }> {
    try {
      const user = await this.userService.register(createUserDto);
      
      return {
        message: 'User registered successfully',
        user,
      };
    } catch (error) {
      // Re-throw known exceptions
      if (error.status) {
        throw error;
      }
      
      // Handle unknown errors
      throw new BadRequestException('Registration failed');
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: { email: string; password: string }): Promise<{
    message: string;
    user: UserResponseDto;
    token: string;
  }> {
    try {
      const user = await this.userService.validateUser(loginDto.email, loginDto.password);
      
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return {
        message: 'Login successful',
        user,
        token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new BadRequestException('Login failed');
    }
  }
}