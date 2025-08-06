import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { EmailService } from '../../lib/utils/sendgrid/email.service';
import { TwilioService } from '../../lib/utils/twilio/twilio.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
    private emailService: EmailService,
    private twilioService: TwilioService,
  ) {}

  @Post('signup')
  async signUpUser(@Body() createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.usersService.findUserByEmail(
        createUserDto.email,
      );
      // if (existingUser) {
      //   throw new ConflictException('Email already exists');
      // }
      if (existingUser) {
        return {
          success: false,
          error: 'Email already exists',
        };
      }

      const newUser = await this.usersService.createUser(createUserDto);

      return {
        success: true,
        message: 'User created successfully.',
        userDetails: {
          id: newUser.id,
          name: `${newUser.first_name} ${newUser.last_name}`,
          email: newUser.email,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Login

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req): Promise<any> {
    try {
      const user = req.user;
      if (!user) {
        throw new Error('User not found');
      }

      const { accessToken, refreshToken } = await this.authService.getTokens(
        user.id,
        user.email,
      );

      return {
        success: true,
        user_role: user.role,
        message: 'User logged in successfully.',
        accessToken,
        refreshToken,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
  @UseGuards(JwtAuthGuard)
  @Put('password/change')
  async changePassword(
    @Request() req,
    @Body()
    body: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
  ) {
    try {
      await this.usersService.changePassword(
        req.user.id,
        body.currentPassword,
        body.newPassword,
        body.confirmPassword,
      );

      return {
        success: true,
        message: 'Password successfully changed.',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Request() req,
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const userId = req.user.id;
      const isAdmin = req.user.role === 'admin';

      if (!isAdmin && userId !== Number(id)) {
        throw new ForbiddenException(
          'You are not allowed to update this user profile.',
        );
      }

      // Only admin can update `isActive`
      if (isAdmin && updateUserDto.isActive !== undefined) {
        await this.usersService.setUserActiveStatus(
          Number(id),
          updateUserDto.isActive,
        );
      }

      // Prevent non-admins from updating `isActive`
      if (!isAdmin) {
        delete updateUserDto.isActive;
      }

      const updatedUser = await this.usersService.updateUser(
        Number(id),
        updateUserDto,
      );

      return { success: true, data: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post('password/forgot')
  async forgotPassword(@Body('email') email: string) {
    try {
      const { token, name } =
        await this.usersService.generateResetPasswordToken(email);

      await this.emailService.sendEmailWithTemplate(email, token, name);

      return {
        success: true,
        message: 'Reset password token sent to email.',
        token: token, // expose only in dev if needed
        name: name,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Put('password/reset')
  async resetPassword(
    @Body()
    body: {
      token: string;
      newPassword: string;
      confirmPassword: string;
    },
  ) {
    try {
      await this.usersService.resetPassword(
        body.token,
        body.newPassword,
        body.confirmPassword,
      );

      return {
        success: true,
        message: 'Password successfully reset.',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // @Post('sms')
  // async sendSMS(
  //   @Body() body: { phone: string; message: string },
  // ): Promise<any> {
  //   try {
  //     // const response = await this.twilioService.sendSMSService(
  //     const response = await this.twilioService.sendSMS(
  //       body.phone,
  //       body.message,
  //     );
  //     return { success: true, data: response };
  //   } catch (error: any) {
  //     return { success: false, error: error.message };
  //   }
  // }
}
