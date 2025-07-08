import { Controller, Post, Body, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CustomLoggerService } from '../common/logger.service';
import { FirebaseService } from '../auth/firebase.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatResponseDto } from './dto/chat-response.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly logger: CustomLoggerService,
    private readonly firebaseService: FirebaseService
  ) {}

  @Post('chatgpt')
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @Headers('authorization') authHeader: string
  ): Promise<ChatResponseDto> {
    const { message } = sendMessageDto;

    this.logger.log(`Mensaje recibido: ${message}`);

    // revisar token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException(
        'Token de autorización requerido. Usa: Authorization: Bearer tu_token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = authHeader.substring(7);

    // validar con firebase
    const validation = await this.firebaseService.validateToken(token);
    
    if (!validation.valid) {
      this.logger.error(`Token malo: ${validation.error}`);
      throw new HttpException(
        `Auth error: ${validation.error}`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    this.logger.log(`Usuario autenticado: ${validation.uid}`);

    try {
      const response = await this.chatService.sendMessage(message);
      
      this.logger.log('Respuesta enviada');
      
      return {
        response,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error en controller', error.message);
      
      throw new HttpException(
        'No se pudo procesar tu mensaje',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 