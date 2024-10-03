import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from 'src/entities';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { SecurityService } from 'src/security/security.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(User)
    private userRepository: Repository<User>,
    private readonly securityService: SecurityService
  ) {}

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with the ID ${id} not found`);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) return null;

    return user;
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const oldUser = await this.getUserByEmail(dto.email);

    if (oldUser) {
      throw new BadRequestException(`Email ${dto.email} is already in use`);
    }

    return await this.userRepository.save(dto);
  }

  async getAllUsers() {
    const users = await this.userRepository.find();

    if (!users.length) {
      throw new NotFoundException(`The list of users is empty`);
    }

    return users;
  }

  async updatePassword(
    id: number,
    dto: UpdateUserPasswordDto
  ): Promise<boolean> {
    const existingUser = await this.getUserById(id);

    const isValidPassword = await this.securityService.compareData(
      dto.oldPassword,
      existingUser.hashedPassword
    );

    if (!isValidPassword) {
      throw new BadRequestException('Wrong old password');
    }

    const newHashedPassword = await this.securityService.hashData(dto.password);

    const updatedUser = await this.userRepository.save({
      ...existingUser,
      hashedPassword: newHashedPassword,
    });

    return !!updatedUser;
  }
}
