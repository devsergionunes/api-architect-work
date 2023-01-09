import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwtauth.guard';
import { CreateUserDto } from './dtos/createUserDto';
import { UpdateUserDto } from './dtos/updateUserDto';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async index() {
    return await this.usersService.findAll();
  }

  @Post()
  async create(@Body() user: CreateUserDto) {
    return await this.usersService.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async show(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() user: UpdateUserDto) {
    return await this.usersService.update(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async destroy(@Param('id') id: number) {
    return await this.usersService.delete(id);
  }
}
