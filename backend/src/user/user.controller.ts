import { 
  Controller, 
  Post, 
  Body, 
  HttpStatus, 
  HttpCode,
  BadRequestException 
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

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
}