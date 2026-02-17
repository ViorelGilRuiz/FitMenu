import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, Max, Min } from 'class-validator';

export class GenerateMenuDto {
  @ApiProperty({ enum: ['lose_fat', 'maintain', 'gain_muscle'] })
  @IsIn(['lose_fat', 'maintain', 'gain_muscle'])
  goal!: 'lose_fat' | 'maintain' | 'gain_muscle';

  @ApiProperty({ enum: ['low', 'moderate', 'high'] })
  @IsIn(['low', 'moderate', 'high'])
  activityLevel!: 'low' | 'moderate' | 'high';

  @ApiProperty({ minimum: 3, maximum: 6 })
  @IsInt()
  @Min(3)
  @Max(6)
  mealsPerDay!: number;
}
