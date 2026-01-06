import { Body, Controller, Post, HttpCode, HttpStatus, UnauthorizedException, Req, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { RegisterRequestDto } from '@modules/auth/dtos/register.dto'
import { LoginRequestDto } from '@modules/auth/dtos/login.dto'
import { RefreshRequestDto } from '@modules/auth/dtos/refresh.dto'
import { ChangePasswordDto } from '@modules/auth/dtos/change-password.dto'
import { ERROR_CODE } from '@constants/error-code'

@ApiTags('Authentication')
@Controller('v1/auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/register')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'User register' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'User registered successfully'
	})
	async register(@Body() body: RegisterRequestDto) {
		const result = await this.authService.register(body)
		return {
			success: true,
			data: result,
			message: 'Register successfully'
		}
	}

	@Post('/login')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'User login' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'User logged in successfully'
	})
	async login(@Body() body: LoginRequestDto) {
		const result = await this.authService.login(body)
		return {
			success: true,
			data: result,
			message: 'Login successfully'
		}
	}

	@Post('/refresh')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Refresh access token' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Token refreshed successfully'
	})
	async refresh(@Body() body: RefreshRequestDto) {
		const result = await this.authService.refreshAccessToken(body)
		return {
			success: true,
			data: result,
			message: 'Refresh successfully'
		}
	}

	@Post('/change-password')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Change password' })
	@ApiResponse({ status: HttpStatus.OK, description: 'Password changed successfully' })
	async changePassword(@Body() body: ChangePasswordDto, @Req() req: any) {
		const user = req?.user
		if (!user?.id) {
			throw new UnauthorizedException('Unauthorized')
		}

		const result = await this.authService.changePassword(body, { id: Number(user.id) })
		return { success: true, data: result, message: 'Change password successfully' }
	}

	@Get('/session')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get session login' })
	@ApiResponse({ status: HttpStatus.OK, description: 'Get session token' })
	async session(@Req() request: any) {
		const jwtUser: any = request?.user
		const userId = Number(jwtUser?.user || jwtUser?.id)
		if (!userId) {
			throw new UnauthorizedException({
				message: 'UNAUTHORIZED',
				data: null,
				statusCode: ERROR_CODE.UNAUTHORIZED
			})
		}

		return this.authService.getSessionUser(userId)
	}
}
