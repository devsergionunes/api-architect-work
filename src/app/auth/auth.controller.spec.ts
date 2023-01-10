import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/authDto';

const requestModk = {
  user: {},
};

const jwtTokenMock =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRldnNlcmdpb251bmVzQGdtYWlsLmNvbSIsInN1YiI6IjQwYWJjYjI5LTVlMTItNDI1ZC1hMTVlLWU5YmM4OWJjODU2OCIsImlhdCI6MTY3MzMzMjQzNCwiZXhwIjoxNjczMzM2MDM0fQ.uqKKM5sE0NGvITt9h8_g4FrRbodWHNxSJPxiFDcH3BU';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue(jwtTokenMock),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return the authentication jwt teken', async () => {
      // arrange
      const body: AuthDto = {
        email: 'email',
        password: 'password',
      };

      // act
      const result = await authController.login(requestModk, body);

      // assert
      expect(result).toEqual(jwtTokenMock);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });
  });
});
