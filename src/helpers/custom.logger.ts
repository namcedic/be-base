import { Injectable, LoggerService, Scope } from '@nestjs/common'
import * as fs from 'fs'
import { join } from 'path'
import * as winston from 'winston'
import 'winston-daily-rotate-file'

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger implements LoggerService {
	private context?: string
	private readonly logger: winston.Logger

	constructor() {
		const logDir = join(process.cwd(), 'logs')

		if (!fs.existsSync(logDir)) {
			fs.mkdirSync(logDir, { recursive: true })
		}

		this.logger = winston.createLogger({
			levels: winston.config.npm.levels,
			format: winston.format.combine(
				winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
			),
			transports: [
				new winston.transports.DailyRotateFile({
					level: 'error',
					dirname: logDir,
					filename: '%DATE%-error.log',
					datePattern: 'YYYY/MM/DD/HH',
					maxFiles: '7d',
					maxSize: '5m',
					zippedArchive: true,
					format: winston.format((info) => (info.level === 'error' ? info : false))()
				}),

				new winston.transports.DailyRotateFile({
					level: 'debug',
					dirname: logDir,
					filename: '%DATE%-debug.log',
					datePattern: 'YYYY/MM/DD/HH',
					maxFiles: '7d',
					maxSize: '5m',
					zippedArchive: true,
					format: winston.format((info) => (info.level === 'debug' ? info : false))()
				})
			]
		})
	}

	setContext(context: string) {
		this.context = context
	}

	log(message: any) {
		this.logger.info(`[${this.context}]: ${typeof message === 'string' ? message : JSON.stringify(message)}`)
	}

	error(message: any) {
		this.logger.error(`[${this.context}]: ${message}`)
	}

	warn(message: any) {
		this.logger.warn(message)
	}

	debug(message: any) {
		this.logger.debug(message)
	}
}
