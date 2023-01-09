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
import { JwtAuthGuard } from 'src/app/auth/jwtauth.guard';
import { CreateSolicitationDto } from './dtos/createSolicitationDto';
import { UpdateSolicitationDto } from './dtos/updateSolicitationDto';
import { SolicitationService } from './solicitation.service';

@Controller('api/v1/solicitation')
export class SolicitationController {
  constructor(private readonly solicitationService: SolicitationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async index(@Request() req) {
    const { userId } = req.user;
    return await this.solicitationService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() solicitation: CreateSolicitationDto, @Request() req) {
    const { userId } = req.user;
    return await this.solicitationService.create(solicitation, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async show(@Param('id') id: string, @Request() req) {
    const { userId } = req.user;
    return await this.solicitationService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
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
  async destroy(@Param('id') id: string, @Request() req) {
    const { userId } = req.user;
    return await this.solicitationService.delete(id, userId);
  } // ok Architect
}
