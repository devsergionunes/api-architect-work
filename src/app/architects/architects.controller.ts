import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwtauth.guard';
import { ArchitectsService } from './architects.service';

@Controller('api/v1/architect')
export class ArchitectsController {
  constructor(private readonly architectsService: ArchitectsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async index() {
    return await this.architectsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async show(@Param('id') id: number) {
    return await this.architectsService.findOne(id);
  }
}
