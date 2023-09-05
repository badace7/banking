import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  @Length(11)
  identifier: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  password: string;
}
