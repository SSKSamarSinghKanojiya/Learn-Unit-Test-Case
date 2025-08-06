// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersController } from './users.controller';
// import { UsersService } from './users.service';
// import { CreateUserDto } from './dtos/CreateUser.dto';
// import { User } from './user.entity';
// import { ConflictException } from '@nestjs/common';
// import { AuthService } from '../auth/auth.service';
// import { EmailService } from '../../lib/utils/sendgrid/email.service';
// import { TwilioService } from '../../lib/utils/twilio/twilio.service';

// describe('UsersController', () => {
//   let controller: UsersController;
//   let service: UsersService;
//   let authService: AuthService;

//   const mockUsersService = {
//     findUserByEmail: jest.fn(),
//     createUser: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UsersController],
//       providers: [
//         {
//           provide: UsersService,
//           useValue: mockUsersService,
//         },
//         {
//           provide: AuthService,
//           useValue: {}, // 🔴 This is missing in your current setup, hence the error
//         },
//         {
//           provide: EmailService,
//           useValue: {
//             /* mock sendEmail or any method used */
//           },
//         },
//         {
//           provide: TwilioService,
//           useValue: {
//             /* mock sendOtp or similar methods */
//           },
//         },
//       ],
//     }).compile();

//     controller = module.get<UsersController>(UsersController);
//     service = module.get<UsersService>(UsersService);
//   });
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('signUpUser', () => {
//     it('should return success true with user created successfully response', async () => {
//       const createUserDto: CreateUserDto = {
//         email: 'User@gmail.com',
//         first_name: 'User1',
//         last_name: 'Coder',
//         password: '123',
//       };
//       const user: User = {
//         id: 1,
//         email: 'test@example.com',
//         first_name: 'John',
//         last_name: 'Doe',
//       } as User;

//       mockUsersService.findUserByEmail.mockResolvedValue(null);
//       mockUsersService.createUser.mockResolvedValue(user);

//       const expectedResponse = {
//         success: true,
//         message: 'User created successfully.',
//         userDetails: {
//           id: 1,
//           name: 'John Doe',
//           // email: 'test@example.com',
//         },
//       };

//       expect(await controller.signUpUser(createUserDto)).toEqual(
//         expectedResponse,
//       );
//        expect(service.findUserByEmail).toHaveBeenCalledWith(createUserDto.email);

//       expect(service.createUser).toHaveBeenCalledWith(createUserDto);
//     });
//     // it('should throw an error if email already exits when creating a user', async ()=>{
//     //   const createUserDto: CreateUserDto = {
//     //     email: 'test@example.com',
//     //     first_name: 'John',
//     //     last_name: 'Doe',
//     //     password: '123',
//     //   }
//     //   const existingUser: User = {
//     //     id: 1,
//     //     email: 'test@example.com',
//     //     first_name: 'John',
//     //     last_name: 'Doe',
//     //     // password :"123"
//     //   } as User;

//     //   mockUsersService.findUserByEmail.mockResolvedValue(existingUser)
//     //   //  await expect(controller.signUpUser(createUserDto)).rejects.toThrow(ConflictException)

//     //    expect(service.findUserByEmail).toHaveBeenCalledWith(createUserDto.email)

//     //    expect(service.createUser).not.toHaveBeenCalled()
//     // })
//     it('should throw an error if email already exists when creating a user', async () => {
//   const createUserDto: CreateUserDto = {
//     email: 'test@example.com',
//     first_name: 'John',
//     last_name: 'Doe',
//     password: '123',
//   };

//   const existingUser: User = {
//     id: 1,
//     email: 'test@example.com',
//     first_name: 'John',
//     last_name: 'Doe',
//   } as User;

//   mockUsersService.findUserByEmail.mockResolvedValue(existingUser);

//   await expect(controller.signUpUser(createUserDto)).rejects.toThrow(ConflictException);

//   expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(createUserDto.email);
//   expect(mockUsersService.createUser).not.toHaveBeenCalled();
// });

//   });
// });
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { User } from './user.entity';
import { ConflictException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { EmailService } from '../../lib/utils/sendgrid/email.service';
import { TwilioService } from '../../lib/utils/twilio/twilio.service';

describe('UsersController', () => {
  let controller: UsersController;

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
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: EmailService,
          useValue: {},
        },
        {
          provide: TwilioService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
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
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      } as User;

      mockUsersService.findUserByEmail.mockResolvedValue(null);
      mockUsersService.createUser.mockResolvedValue(user);

      const expectedResponse = {
        success: true,
        message: 'User created successfully.',
        userDetails: {
          id: 1,
          name: 'John Doe',
          email: 'test@example.com',
        },
      };

      const result = await controller.signUpUser(createUserDto);

      expect(result).toEqual(expectedResponse);
      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(mockUsersService.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an error if email already exists when creating a user', async () => {
      const fakeEmail = faker.internet.email();
      const fakeFirstName = faker.person.firstName();
      const fakeLastName = faker.person.lastName();

      // const createUserDto: CreateUserDto = {
      //   email: fakeEmail,
      //   first_name: fakeFirstName,
      //   last_name: fakeLastName,
      //   password: faker.internet.password(),
      // };

      // const existingUser: User = {
      //   id: 1,
      //   email: fakeEmail,
      //   first_name: fakeFirstName,
      //   last_name: fakeLastName,
      // } as User;

       const createUserDto: CreateUserDto = {
    email: 'test@example.com',
    first_name: 'John',
    last_name: 'Doe',
    password: '123',
  };

  const existingUser: User = {
    id: 1,
    email: 'test@example.com',
    first_name: 'John',
    last_name: 'Doe',
  } as User;

      mockUsersService.findUserByEmail.mockResolvedValue(existingUser);

      const result = await controller.signUpUser(createUserDto);

      expect(result).toEqual({
        success: false,
        error: 'Email already exists',
      });

      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(mockUsersService.createUser).not.toHaveBeenCalled();
    });
  });
});
