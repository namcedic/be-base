import { IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class QueryUsersDto {
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	readonly page?: number = 1

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@IsPositive()
	readonly limit?: number = 20

	@IsOptional()
	@IsString()
	readonly q?: string
}
