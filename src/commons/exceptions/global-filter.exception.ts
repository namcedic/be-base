import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import { ValidationError } from 'class-validator'
import { ERROR_CODE } from '@constants/error-code'

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger(GlobalExceptionsFilter.name)

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const request = ctx.getRequest<Request>()

		let status = HttpStatus.INTERNAL_SERVER_ERROR
		let errorResponse: any = {
			code: ERROR_CODE.INTERNAL_SERVER_ERROR,
			status: false,
			message: ERROR_CODE.INTERNAL_SERVER_ERROR,
			data: null,
			statusCode: ERROR_CODE.INTERNAL_SERVER_ERROR
		}

		// ✅ Handle CORS errors FIRST (before logging)
		if (exception instanceof Error && exception.message === 'Not allowed by CORS') {
			status = HttpStatus.FORBIDDEN
			errorResponse = {
				code: status,
				status: false,
				message: 'CORS policy: Origin not allowed',
				data: null,
				statusCode: ERROR_CODE.CORS
			}

			this.logger.warn(`CORS blocked: ${request.headers.origin} -> ${request.method} ${request.url}`)
			return response.status(status).json(errorResponse)
		}

		// Log request info for debugging (except CORS)
		this.logger.error(
			`Exception caught: ${request.method} ${request.url}`,
			exception instanceof Error ? exception.stack : JSON.stringify(exception)
		)

		// ✅ Handle HttpException (BadRequest, Unauthorized, Forbidden, NotFound, etc.)
		if (exception instanceof HttpException) {
			const res = exception.getResponse() as any
			status = exception.getStatus()

			// 🔹 Log riêng cho 401
			if (status === HttpStatus.UNAUTHORIZED) {
				const authHeader = request.headers.authorization
				const dpopHeader = (request.headers as any).dpop
				this.logger.warn(`Unauthorized request to ${request.url}`, {
					hasAuthHeader: !!authHeader,
					hasDpopHeader: !!dpopHeader,
					origin: request.headers.origin,
					ip: request.ip
				})
			}

			// 🔹 CASE CHUNG: BadRequestException custom payload { message, data, statusCode }
			if (status === HttpStatus.BAD_REQUEST && res && typeof res === 'object' && !Array.isArray(res)) {
				errorResponse = {
					code: status,
					status: false,
					message: res.message ?? ERROR_CODE.UNKNOWN_ERROR,
					data: res.data ?? null,
					statusCode: res.statusCode ?? status
				}
			}
			// 🔹 CASE: NotFoundException
			else if (status === HttpStatus.NOT_FOUND) {
				errorResponse = {
					code: status,
					status: false,
					message: res?.message || 'Not Found',
					data: res?.data ?? null,
					statusCode: res?.statusCode ?? status
				}
			}
			// 🔹 CASE: ForbiddenException (không phải CORS)
			else if (status === HttpStatus.FORBIDDEN) {
				this.logger.warn(`Forbidden request to ${request.url}`, {
					origin: request.headers.origin,
					ip: request.ip
				})

				errorResponse = {
					code: status,
					status: false,
					message: res?.message || 'FORBIDDEN',
					data: res?.data ?? null,
					statusCode: res?.statusCode ?? status
				}
			}
			// 🔹 Các HttpException khác
			else {
				errorResponse = {
					code: status || ERROR_CODE.UNKNOWN_ERROR,
					status: false,
					message: res?.message || exception.message || ERROR_CODE.UNKNOWN_ERROR,
					data: res && res.data !== undefined ? res.data : null,
					statusCode: res?.statusCode || status
				}
			}
		}
		// ✅ Handle ValidationError (class-validator) nếu có ném trực tiếp
		else if (exception instanceof ValidationError) {
			let message = ERROR_CODE.VALIDATION_FAILED
			if (exception?.constraints) {
				const firstConstraint = Object.values(exception.constraints)[0]
				message = firstConstraint || message
			}
			status = HttpStatus.BAD_REQUEST
			errorResponse = {
				code: HttpStatus.BAD_REQUEST,
				status: false,
				message,
				data: null,
				statusCode: message
			}
		}
		// ✅ Handle other errors
		else if (exception instanceof Error) {
			this.logger.error(`Unhandled error: ${exception.message}`, exception.stack)
			errorResponse.message = process.env.NODE_ENV === 'production' ? ERROR_CODE.INTERNAL_SERVER_ERROR : exception.message
		}

		// Log final error response
		this.logger.error(`Error Response [${status}]: ${request.method} ${request.url}`, {
			error: errorResponse,
			ip: request.ip,
			userAgent: request.headers['user-agent']
		})

		response.status(status).json(errorResponse)
	}
}
