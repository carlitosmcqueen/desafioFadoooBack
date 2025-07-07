import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, { message: 'Message cannot be longer than 1000 characters' })
  message: string;
} 