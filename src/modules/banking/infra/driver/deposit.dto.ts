import { IsNotEmpty, IsString, Length, IsNumber, Min } from 'class-validator';

export class DepositDTO {
  @IsString()
  @IsNotEmpty()
  @Length(11)
  origin: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;
}
