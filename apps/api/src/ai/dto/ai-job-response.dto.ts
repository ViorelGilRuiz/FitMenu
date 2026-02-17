import { ApiProperty } from '@nestjs/swagger';

export class AiJobResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty({ required: false })
  queueJobId?: string | null;

  @ApiProperty({ required: false, type: Object })
  resultJson?: Record<string, unknown> | null;

  @ApiProperty({ required: false })
  errorMessage?: string | null;
}
