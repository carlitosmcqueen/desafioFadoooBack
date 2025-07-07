import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CustomLoggerService } from '../common/logger.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatResponseDto } from './dto/chat-response.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly logger: CustomLoggerService
  ) {}

  @Post('chatgpt')
  async sendMessage(@Body() sendMessageDto: SendMessageDto): Promise<ChatResponseDto> {
    const { message } = sendMessageDto;

    this.logger.log(`Mensaje recibido: ${message}`, 'ChatController');

    try {
      const response = await this.chatService.sendMessage(message);
      
      this.logger.log('Respuesta enviada', 'ChatController');
      
      return {
        response,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error en controller', error.message, 'ChatController');
      
      throw new HttpException(
        'No se pudo procesar tu mensaje',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 