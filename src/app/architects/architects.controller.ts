import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwtauth.guard';
import { ArchitectsService } from './architects.service';
import { indexArchitectsWagger } from './swagger/indexArchitectsWagger';
import { showArchitectsWagger } from './swagger/showArchitectsWagger';

@Controller('api/v1/architect')
@ApiTags('Architects')
export class ArchitectsController {
  constructor(private readonly architectsService: ArchitectsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Search all architects' })
  @ApiResponse({
    status: 200,
    description: "Returns a list of architects' data",
    type: indexArchitectsWagger,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async index() {
    return await this.architectsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Search an architect by id' })
  @ApiResponse({
    status: 200,
    description: "Returns the architect's data",
    type: showArchitectsWagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async show(@Param('id') id: string) {
    return await this.architectsService.findOne(id);
  }
}
