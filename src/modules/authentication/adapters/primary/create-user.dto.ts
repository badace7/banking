import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  lastName: string;
}
