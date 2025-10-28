import { IsString, IsNumber, IsIn, IsUrl, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class EnvironmentVariables {
  @IsString()
  @IsUrl({}, { message: 'MONGODB_URI must be a valid URL' })
  MONGODB_URI: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  PORT: number;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  CORS_ORIGIN: string;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  CORS_CREDENTIALS: boolean;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  RATE_LIMIT_WINDOW: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  RATE_LIMIT_MAX_REQUESTS: number;
}