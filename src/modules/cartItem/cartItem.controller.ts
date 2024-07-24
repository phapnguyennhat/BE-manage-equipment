import { User } from './../../models/user.entity';
import { promiseHooks } from 'v8';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateCartDTO } from 'src/dtos/create-cartItem-dto';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { CartItem } from 'src/models/cartItem.entity';
import { CreateCartParams } from 'src/params/create-cart-params';
import { CartItemService } from 'src/services/cartItem.service';
import { DeleteResult } from 'typeorm';
import { EquipmentService } from 'src/services/equipment.service';
import { UpdateCartDTO } from 'src/dtos/update-cartItem-dto';
import { UpdateItem } from 'src/dtos/update-cartAll-dto';

@Controller('cartItem')
@ApiTags('cartItem')
export class CartItemController {
  constructor(
    private readonly cartItemService: CartItemService,
    private readonly equipService: EquipmentService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: CreateCartParams })
  async create(
    @Req() req,

    @Body() cartItemDTO: CreateCartParams,
  ): Promise<CartItem> {
    // cartItemDTO.userId = req.user.userId;
    const data: CreateCartDTO = { ...cartItemDTO, userId: req.user.userId };
    const cartItem = await this.cartItemService.create(data);
    const equip = await this.equipService.findById(cartItem.equipId);
    cartItem.equip = equip;
    return cartItem;
  }

  @Delete(':equipId')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  async delete(
    // @Param('userId') userId: string,
    @Param('equipId') equipId: string,
    @Req() req,
  ): Promise<DeleteResult> {
    return this.cartItemService.delete(req.user.userId, equipId);
  }

  @Delete('/delete/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async deleteAll(@Req() req) {
    return this.cartItemService.deleteAll(req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async getItem(@Req() req) {
    return this.cartItemService.findbyUserId(req.userId);
  }

  @Put(':equipId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async update(
    @Req() req,
    @Param('equipId') equipId: string,
    @Body() updateCartDTO: UpdateCartDTO,
  ) {
    // console.log(req.user.userId);

    return this.cartItemService.update(req.user.userId, equipId, updateCartDTO);
  }

  @Put('update/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: UpdateItem, isArray: true })
  async updateAll(@Req() req, @Body() data: UpdateItem[]) {
    return this.cartItemService.updateAll(req.user.userId, data);
  }
}
