import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../common/prisma/prisma.service';

interface AiGenerationPayload {
  aiJobId: string;
  userId: string;
  prompt: string;
}

@Processor('ai-generation')
export class AiProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<AiGenerationPayload>): Promise<void> {
    const payload = job.data;

    await this.prisma.aiJob.update({
      where: { id: payload.aiJobId },
      data: { status: 'processing' },
    });

    try {
      // Placeholder for OpenAI function calling integration.
      // Keeping deterministic output for phase-1 acceptance.
      const result = {
        generatedAt: new Date().toISOString(),
        provider: 'mock-function-calling',
        menu: [
          { day: 'monday', meals: ['protein oats', 'chicken bowl', 'tofu stir fry'] },
          { day: 'tuesday', meals: ['yogurt berries', 'salmon potato', 'lentil stew'] },
        ],
      };

        await this.prisma.aiJob.update({
          where: { id: payload.aiJobId },
          data: {
            status: 'done',
            resultJson: JSON.stringify(result),
            errorMessage: null,
          },
        });
    } catch (error) {
      await this.prisma.aiJob.update({
        where: { id: payload.aiJobId },
        data: {
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown AI error',
        },
      });
      throw error;
    }
  }
}
