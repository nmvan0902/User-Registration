import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  private readonly saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

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

  async login(dto: LoginDto): Promise<Omit<User, 'password'>> {
    const user = await this.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const obj = user.toObject() as any;
    delete obj.password;
    return obj as Omit<User, 'password'>;
  }

  private async signTokens(user: UserDocument) {
    const payload = { sub: user._id.toString(), email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'access-secret',
      expiresIn: process.env.JWT_ACCESS_TTL || '15m',
    });
    const refreshToken = await this.jwtService.signAsync({ sub: payload.sub }, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      expiresIn: process.env.JWT_REFRESH_TTL || '7d',
    });
    return { accessToken, refreshToken };
  }

  async loginJwt(dto: LoginDto) {
    const user = await this.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.signTokens(user);
    const hashedRt = await bcrypt.hash(tokens.refreshToken, this.saltRounds);
    user.hashedRefreshToken = hashedRt;
    await user.save();

    const obj = user.toObject() as any;
    delete obj.password;
    delete obj.hashedRefreshToken;
    return { user: obj as Omit<User, 'password'>, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user || !user.hashedRefreshToken) throw new ForbiddenException('Access denied');
    const valid = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!valid) throw new ForbiddenException('Access denied');

    const tokens = await this.signTokens(user);
    user.hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, this.saltRounds);
    await user.save();
    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
  }

  async logout(userId: string) {
    await this.userModel.updateOne({ _id: userId }, { $unset: { hashedRefreshToken: 1 } }).exec();
  }
}
