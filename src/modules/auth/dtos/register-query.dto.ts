import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class RegisterQueryDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	readonly utm_source?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	readonly utm_medium?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	readonly utm_campaign?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	readonly utm_content?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	readonly utm_term?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	readonly reference?: string
}
