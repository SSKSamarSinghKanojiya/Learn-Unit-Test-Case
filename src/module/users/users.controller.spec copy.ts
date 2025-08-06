import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { User } from './user.entity';
import { ConflictException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let authService: AuthService

  const mockUsersService = {
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUpUser', () => {
    it('should return success true with user created successfully response', async () => {
      const createUserDto: CreateUserDto = {
        email: 'User@gmail.com',
        first_name: 'User1',
        last_name: 'Coder',
        password: '123',
      };
      const user: User = {
        id: 1,
        email: 'User@gmail.com',
        first_name: 'User',
        last_name: 'Coder',
        // password: '123',
      } as User;

      mockUsersService.findUserByEmail.mockResolvedValue(null);
      mockUsersService.createUser.mockResolvedValue(user);

      expect(await controller.signUpUser(createUserDto)).toEqual(user);
      expect(service.findUserByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an error if email already exits when creating a user', async ()=>{
      const createUserDto: CreateUserDto = {
        email: 'User11@gmail.com',
        first_name: 'User11',
        last_name: 'Coder11',
        password: '123',
      }
      const existingUser: User = {
        id: 1,
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        password :"123"
      } as User;

      mockUsersService.findUserByEmail.mockResolvedValue(existingUser)
       await expect(controller.signUpUser(createUserDto)).rejects.toThrow(ConflictException)

       expect(service.findUserByEmail).toHaveBeenCalledWith(createUserDto.email)
       expect(service.createUser).not.toHaveBeenCalled()
    })
  });
});
