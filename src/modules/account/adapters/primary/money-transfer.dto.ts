import { IsNotEmpty, IsString, Length, IsNumber, Min } from 'class-validator';

export class MoneyTransferDTO {
  @IsString()
  @IsNotEmpty()
  @Length(5, 50)
  label: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  @Length(11)
  origin: string;

  @IsString()
  @IsNotEmpty()
  @Length(11)
  destination: string;
}
