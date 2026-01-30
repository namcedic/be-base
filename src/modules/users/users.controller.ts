import { Body, Controller, Delete, Get, Param, Patch, Post, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { CreateUserDto } from './dtos/create-user.dto'

@ApiTags('Users')
@Controller('v1/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create user' })
	@ApiResponse({ status: HttpStatus.CREATED, description: 'User created' })
	create(@Body() dto: CreateUserDto) {
		return this.usersService.create(dto)
	}

	@Get()
	@ApiOperation({ summary: 'Get all users' })
	findAll() {
		return this.usersService.findAll()
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get user by id' })
	findOne(@Param('id') id: string) {
		return this.usersService.findOne(Number(id))
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update user by id' })
	update(@Param('id') id: string, @Body() body: Partial<CreateUserDto>) {
		return this.usersService.update(Number(id), body)
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete user by id' })
	remove(@Param('id') id: string) {
		return this.usersService.remove(Number(id))
	}
}
