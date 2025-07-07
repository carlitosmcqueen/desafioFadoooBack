import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ConfigService } from '@nestjs/config';

describe('ChatController', () => {
  let controller: ChatController;
  let chatService: ChatService;

  const mockChatService = {
    sendMessage: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(() => 'test-api-key'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: mockChatService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    chatService = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should return a chat response', async () => {
      const mockResponse = 'Hello from ChatGPT!';
      mockChatService.sendMessage.mockResolvedValue(mockResponse);

      const result = await controller.sendMessage({ message: 'Hello' });

      expect(result).toHaveProperty('response', mockResponse);
      expect(result).toHaveProperty('timestamp');
      expect(chatService.sendMessage).toHaveBeenCalledWith('Hello');
    });
  });
}); 