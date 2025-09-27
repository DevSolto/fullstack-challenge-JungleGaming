import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO } from '@repo/types';
import { randomBytes, scrypt as scryptCallback } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const scrypt = promisify(scryptCallback);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDTO> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const user = this.usersRepository.create({
      email: createUserDto.email,
      username: createUserDto.username,
      password: await this.hashPassword(createUserDto.password),
    });

    const savedUser = await this.usersRepository.save(user);

    return this.toDTO(savedUser);
  }

  async findAll(): Promise<UserDTO[]> {
    const users = await this.usersRepository.find({
      order: { createdAt: 'ASC' },
    });

    return users.map((user) => this.toDTO(user));
  }

  async findOne(id: string): Promise<UserDTO> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.toDTO(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDTO> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailInUse = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (emailInUse && emailInUse.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }

    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      user.password = await this.hashPassword(updateUserDto.password);
    }

    const updatedUser = await this.usersRepository.save(user);

    return this.toDTO(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  private toDTO(user: User): UserDTO {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt?.toISOString(),
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

    return `${salt}:${derivedKey.toString('hex')}`;
  }
}
