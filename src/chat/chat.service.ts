import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from '../common/logger.service';
import OpenAI from 'openai';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private logger: CustomLoggerService
  ) {
    this.logger.log('ChatService iniciado');
    
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    
    if (!apiKey) {
      this.logger.error('No hay API key configurada');
    } else {
      this.logger.log('config OpenAI');
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
    }
  }

  async sendMessage(userMessage: string): Promise<string> {
    console.log(`procesando: ${userMessage}`);
    
    // verifico si hay API key
    if (!this.openai) {
      return 'Error: No hay API key de OpenAI configurada';
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        return 'Error: OpenAI no devolvió respuesta. Intenta de nuevo.';
      }

      this.logger.logChat(userMessage, response);
      return response;
      
    } catch (error) {
      this.logger.error('Error con OpenAI', error.message);
      return error.message;
    }
  }
} 