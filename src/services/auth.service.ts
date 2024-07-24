import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDTO } from 'src/dtos/login-dto';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/models/user.entity';
import { PayLoadType } from 'src/types/payLoad.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDTO: LoginDTO): Promise<{ access_token: string }> {
    const user = await this.userService.findByUsername(loginDTO.username);
    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );
    if (passwordMatched) {
      delete user.password;
      const payload: PayLoadType = { userId: user.id, role: user.role };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new NotFoundException('Password does not match');
    }
  }
}
