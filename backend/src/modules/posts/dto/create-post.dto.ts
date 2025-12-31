import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  postedByUserId: string;

  @IsString()
  @IsNotEmpty()
  postedByName: string;

  @IsString()
  @IsNotEmpty()
  postedByRole: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];
}

