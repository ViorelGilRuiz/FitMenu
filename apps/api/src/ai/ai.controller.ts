import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import { GenerateMenuDto } from './dto/generate-menu.dto';
import { AiJobResponseDto } from './dto/ai-job-response.dto';

interface AuthRequest extends Request {
  user: { sub: string; email: string };
}

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-menu')
  generateMenu(
    @Req() req: AuthRequest,
    @Body() dto: GenerateMenuDto,
  ): Promise<AiJobResponseDto> {
    return this.aiService.enqueueMenuGeneration(req.user.sub, dto);
  }

  @Get('jobs/:id')
  getJob(@Param('id') id: string): Promise<AiJobResponseDto> {
    return this.aiService.getJobById(id);
  }
}
