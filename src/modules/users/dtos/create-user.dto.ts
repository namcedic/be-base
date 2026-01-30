import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	readonly username: string

	@IsOptional()
	@IsEmail()
	readonly email?: string

	@IsOptional()
	@IsString()
	readonly phone?: string

	@IsNotEmpty()
	@MinLength(6)
	readonly password: string

	@IsOptional()
	@IsString()
	readonly firstName?: string

	@IsOptional()
	@IsString()
	readonly lastName?: string

	@IsOptional()
	@IsString()
	readonly avatar?: string
}
