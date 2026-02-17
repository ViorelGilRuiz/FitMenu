import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { GenerateMenuDto } from './dto/generate-menu.dto';
import { AiJobResponseDto } from './dto/ai-job-response.dto';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async enqueueMenuGeneration(userId: string, dto: GenerateMenuDto): Promise<AiJobResponseDto> {
    const prompt = `Generate weekly menu for goal=${dto.goal}, activity=${dto.activityLevel}, meals=${dto.mealsPerDay}`;

    const aiJob = await this.prisma.aiJob.create({
      data: {
        userId,
        prompt,
        status: 'queued',
      },
    });

    void this.processInBackground(aiJob.id, prompt);

    return {
      id: aiJob.id,
      status: 'queued',
      queueJobId: null,
    };
  }

  async getJobById(id: string): Promise<AiJobResponseDto> {
    const aiJob = await this.prisma.aiJob.findUnique({ where: { id } });
    if (!aiJob) {
      throw new NotFoundException('AI job not found');
    }

    return {
      id: aiJob.id,
      status: aiJob.status,
      queueJobId: aiJob.queueJobId,
      resultJson: aiJob.resultJson
        ? (JSON.parse(aiJob.resultJson) as Record<string, unknown>)
        : null,
      errorMessage: aiJob.errorMessage,
    };
  }

  private async processInBackground(aiJobId: string, prompt: string): Promise<void> {
    setTimeout(async () => {
      await this.prisma.aiJob.update({
        where: { id: aiJobId },
        data: { status: 'processing' },
      });

      try {
        const result = {
          generatedAt: new Date().toISOString(),
          provider: 'local-dev-mock-function-calling',
          prompt,
          menu: [
            { day: 'monday', meals: ['protein oats', 'chicken bowl', 'tofu stir fry'] },
            { day: 'tuesday', meals: ['yogurt berries', 'salmon potato', 'lentil stew'] },
          ],
        };

        await this.prisma.aiJob.update({
          where: { id: aiJobId },
          data: {
            status: 'done',
            resultJson: JSON.stringify(result),
            errorMessage: null,
          },
        });
      } catch (error) {
        await this.prisma.aiJob.update({
          where: { id: aiJobId },
          data: {
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : 'Unknown AI error',
          },
        });
      }
    }, 400);
  }
}
