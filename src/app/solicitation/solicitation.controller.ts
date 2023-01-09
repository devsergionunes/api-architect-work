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
import { JwtAuthGuard } from 'src/app/auth/jwtauth.guard';
import { CreateSolicitationDto } from './dtos/createSolicitationDto';
import { UpdateSolicitationDto } from './dtos/updateSolicitationDto';
import { SolicitationService } from './solicitation.service';
import { CreateSolicitationWagger } from './swagger/createWagger';
import { IndexSolicitationWagger } from './swagger/indexWagger';
import { ShowSolicitationWagger } from './swagger/showWagger';
import { UpdateSolicitationWagger } from './swagger/updateWagger';

@Controller('api/v1/solicitation')
@ApiTags('Solicitation')
export class SolicitationController {
  constructor(private readonly solicitationService: SolicitationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary:
      'Search all requests from a user or architect, depending on who is logged in',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of user or architect requests',
    type: IndexSolicitationWagger,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async index(@Request() req) {
    const { userId } = req.user;
    return await this.solicitationService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'User creates a new request for an architect',
  })
  @ApiResponse({
    status: 201,
    description: 'New request successfully created',
    type: CreateSolicitationWagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async create(@Body() solicitation: CreateSolicitationDto, @Request() req) {
    const { userId } = req.user;
    return await this.solicitationService.create(solicitation, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Search a request by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns request data',
    type: ShowSolicitationWagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async show(@Param('id') id: string, @Request() req) {
    const { userId } = req.user;
    return await this.solicitationService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update request status and data' })
  @ApiResponse({
    status: 200,
    description: 'Request data updated successfully',
    type: UpdateSolicitationWagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async update(
    @Param('id') id: string,
    @Body() solicitation: UpdateSolicitationDto,
    @Request() req,
  ) {
    const { userId } = req.user;
    return await this.solicitationService.update(id, solicitation, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a solicitation' })
  @ApiResponse({
    status: 204,
    description: 'Delete a solicitation',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async destroy(@Param('id') id: string, @Request() req) {
    const { userId } = req.user;
    return await this.solicitationService.delete(id, userId);
  } // ok Architect
}
