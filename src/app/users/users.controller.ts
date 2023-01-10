import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwtauth.guard';
import { CreateUserDto } from './dtos/createUserDto';
import { UpdateUserDto } from './dtos/updateUserDto';
import { CreateUserWagger } from './swagger/createWagger';
import { IndexUserWagger } from './swagger/indexWagger';
import { ShowUserWagger } from './swagger/showWagger';
import { UpdateUserWagger } from './swagger/updateWagger';
import { UsersService } from './users.service';

@Controller('api/v1/user')
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Returns the data of the logged in user' })
  @ApiResponse({
    status: 200,
    description: 'Returns the data of the logged in user',
    type: IndexUserWagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async index(@Request() req) {
    return await this.usersService.findOne(req.user.userId);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Creates a new user based on the common or architect user type',
  })
  @ApiResponse({
    status: 201,
    description: 'Create a new user',
    type: CreateUserWagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async create(@Body() user: CreateUserDto) {
    return await this.usersService.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Search a user by id' })
  @ApiResponse({
    status: 200,
    description: "Returns a user's data",
    type: ShowUserWagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async show(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: "Update a user's data" })
  @ApiResponse({
    status: 200,
    description: "Update a user's data",
    type: UpdateUserWagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async update(@Param('id') id: number, @Body() user: UpdateUserDto) {
    return await this.usersService.update(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Delete a user',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiOperation({ summary: 'Delete a user' })
  async destroy(@Param('id') id: number) {
    return await this.usersService.delete(id);
  }
}
