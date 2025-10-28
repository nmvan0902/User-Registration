import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, password } = createUserDto;

    try {
      // Check if user already exists
      const existingUser = await this.userModel.findOne({ email }).exec();

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const createdUser = new this.userModel({
        email,
        password: hashedPassword,
      });

      const savedUser = await createdUser.save();

      // Return user without password
      return {
        id: savedUser._id.toString(), // Convert ObjectId to string
        email: savedUser.email,
        createdAt: savedUser.createdAt,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).exec();
  }
}