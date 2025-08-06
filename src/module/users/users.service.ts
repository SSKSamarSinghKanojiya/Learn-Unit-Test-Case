import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/typeorm/entities/user.entity';
import { User } from '../../typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
// import { CreateSuccessUserDto } from './dtos/CreateSuccess.user.dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findUserById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        // relations: ['attachment'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      return user;
    } catch (error) {
      throw new NotFoundException(`Failed to fetch user: ${error.message}`);
    }
  }
  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found.`);
      }

      return user;
    } catch (error) {
      throw new NotFoundException(
        `Failed to fetch user by email: ${error.message}`,
      );
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existing = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existing) throw new ConflictException('User already exists');
      const user = plainToClass(User, createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error(`User creation failed: ${error.message}`);
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        return null;
      }

      const isPasswordValid = await user.comparePassword(password);
      return isPasswordValid ? user : null;
    } catch (error) {
      throw new Error(`User validation failed: ${error.message}`);
    }
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<void> {
    try {
      if (newPassword !== confirmPassword) {
        throw new BadRequestException(
          'New password and confirm password do not match.',
        );
      }

      // const user = await this.userRepository.findOne(userId);
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Current password is incorrect.');
      }

      user.password = newPassword;
      await this.userRepository.save(user);
    } catch (error) {
      throw new Error(`Password change failed: ${error.message}`);
    }
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      Object.assign(user, updateUserDto);

      return await this.userRepository.save(user);
    } catch (error) {
      throw new NotFoundException(`Failed to update user: ${error.message}`);
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const result = await this.userRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async setUserActiveStatus(userId: number, isActive: boolean): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }

      user.isActive = isActive;
      await this.userRepository.save(user);
    } catch (error) {
      throw new Error(`Failed to update user status: ${error.message}`);
    }
  }

  async generateResetPasswordToken(
    email: string,
  ): Promise<{ token: string; name: string }> {
    try {
      const user = await this.findUserByEmail(email);

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found.`);
      }

      user.reset_password_token = uuidv4();
      user.reset_password_sent_at = new Date();
      await this.userRepository.save(user);

      return { token: user.reset_password_token, name: user.first_name };
    } catch (error) {
      throw new Error(`Failed to generate reset token: ${error.message}`);
    }
  }

  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<void> {
    try {
      if (newPassword !== confirmPassword) {
        throw new BadRequestException('Passwords do not match.');
      }

      const user = await this.userRepository.findOne({
        where: { reset_password_token: token },
      });

      if (!user) {
        throw new NotFoundException('Invalid or expired password reset token.');
      }

      user.reset_password_token = null;
      user.reset_password_sent_at = null;
      user.password = newPassword; // Assuming password hashing is handled via @BeforeUpdate
      await this.userRepository.save(user);
    } catch (error) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }
}
