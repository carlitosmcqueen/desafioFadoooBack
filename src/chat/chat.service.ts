import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from '../common/logger.service';
import OpenAI from 'openai';

@Injectable()
export class ChatService {
  private openai: OpenAI;
  private useMockMode: boolean = false; // cambiar a false para usar ChatGPT real

  constructor(
    private configService: ConfigService,
    private logger: CustomLoggerService
  ) {
    this.logger.log('ChatService iniciado', 'ChatService');
    
    // si no esta en modo mock, configuro openai
    if (!this.useMockMode) {
      const apiKey = this.configService.get<string>('OPENAI_API_KEY');
      
      if (apiKey && apiKey !== 'your_openai_api_key_here') {
        this.logger.log('Usando OpenAI real', 'ChatService');
        this.openai = new OpenAI({
          apiKey: apiKey,
        });
      } else {
        this.logger.warn('No hay API key, usando modo mock', 'ChatService');
        this.useMockMode = true;
      }
    }
  }

  async sendMessage(userMessage: string): Promise<string> {
    this.logger.log(`Procesando: ${userMessage}`, 'ChatService');
    
    // si esta en modo mock, uso respuestas de prueba
    if (this.useMockMode) {
      const response = this.getResponse(userMessage);
      this.logger.logChat(userMessage, response);
      return response;
    }

    // codigo para openai real
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
        throw new HttpException('No hay respuesta de OpenAI', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      this.logger.logChat(userMessage, response);
      return response;
    } catch (error) {
      this.logger.error('Error con OpenAI', error.message, 'ChatService');
      
      // si falla openai, uso modo demo
      if (error.status === 429) {
        this.logger.warn('Cuota excedida, usando modo demo', 'ChatService');
        const response = this.getResponse(userMessage);
        this.logger.logChat(userMessage, response);
        return response;
      }
      
      throw new HttpException(
        'Error al procesar tu mensaje',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getResponse(userMessage: string): string {
    // respuestas basicas para el demo
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('hola') || msg.includes('hello')) {
      return `¡Hola! Soy un chatbot de prueba. Tu mensaje: "${userMessage}". El backend está funcionando bien.`;
    }
    
    if (msg.includes('test') || msg.includes('prueba')) {
      return `Test exitoso! Mensaje procesado: "${userMessage}". Backend NestJS funcionando correctamente.`;
    }

    if (msg.includes('backend') || msg.includes('nestjs')) {
      return `Backend NestJS funcionando! Tu consulta: "${userMessage}". Todo está operativo.`;
    }

    if (msg.includes('desafio') || msg.includes('challenge')) {
      return `Este es el backend del desafío. Procesé tu mensaje: "${userMessage}". Sistema funcionando bien.`;
    }

    // respuestas genericas
    const respuestas = [
      `Recibí tu mensaje: "${userMessage}". Esta es una respuesta de prueba del backend.`,
      `Tu mensaje fue procesado correctamente: "${userMessage}". Backend funcionando bien.`,
      `Mensaje procesado: "${userMessage}". Sistema de chat operativo.`,
      `Consulta procesada: "${userMessage}". Todo funcionando correctamente.`,
    ];

    return respuestas[Math.floor(Math.random() * respuestas.length)];
  }
} 