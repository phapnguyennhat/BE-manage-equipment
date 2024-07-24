import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ExpressAdapter, FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { CreateUserDTO } from 'src/dtos/create-user-dto';
import { LoginDTO } from 'src/dtos/login-dto';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { User } from 'src/models/user.entity';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'It will return the user in the response',
    type: OmitType(User, ['formRegisters', 'formApproveds', 'cartItems']),
  })
  @ApiBody({ type: CreateUserDTO })
  signup(
    @Body() userDTO: CreateUserDTO,
    // @UploadedFile() file: Express.Multer.File,
  ) {
    // console.log(file);
    // console.log(userDTO);
    return this.userService.create(userDTO);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 201,
    description: 'It will give you the access_token in the response',
  })
  @ApiBody({ type: LoginDTO })
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return this.userService.findById(req.user?.userId);
  }
}
