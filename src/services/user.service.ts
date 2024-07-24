import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from 'src/dtos/create-user-dto';
import { User } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { error } from 'console';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repoUser: Repository<User>) {}

  async create(userDTO: CreateUserDTO): Promise<User> {
    const user = this.repoUser.create(userDTO);
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(userDTO.password, salt);
    const checkEmail = await this.repoUser.findOneBy({ email: user.email });
    if (checkEmail) {
      throw new BadRequestException('Email đã được sử dụng');
    }
    const checkUsername = await this.repoUser.findOneBy({
      username: user.username,
    });
    if (checkUsername) {
      throw new BadRequestException('Tên đăng nhập đã có người sử dụng');
    }
    const savedUser = await this.repoUser.save(user);
    delete savedUser.password;
    return savedUser;
  }
  async findByUsername(username: string) {
    const user = await this.repoUser.findOneBy({ username: username });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: string) {
    const user = await this.repoUser.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('User not found', 'khong tim thay user');
    }
    delete user.password;
    return user;
  }

  async findbyMssv(mssv: string) {
    return this.repoUser.findOneBy({ mssv });
  }
}
