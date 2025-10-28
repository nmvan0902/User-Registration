import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async register(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashed = await bcrypt.hash(dto.password, this.saltRounds);
    try {
      const created = await this.userModel.create({
        email: dto.email,
        password: hashed,
      });
      const obj = created.toObject() as any;
      delete obj.password;
      return obj as Omit<User, 'password'>;
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new ConflictException('Email already registered');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
