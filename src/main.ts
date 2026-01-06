import { GlobalExceptionsFilter } from '@commons/exceptions/global-filter.exception'
import { SERVICE_NAME, SERVICE_PREFIX } from '@constants/constant'
import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationError } from 'class-validator'
import * as compression from 'compression'
import * as cookieParser from 'cookie-parser'
import { json } from 'express'
import * as session from 'express-session'
import helmet from 'helmet'
import * as passport from 'passport'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, { abortOnError: true })
	const logger = new Logger(SERVICE_NAME)

	app.use(helmet())
	app.use(compression())
	app.setGlobalPrefix(SERVICE_PREFIX)

	const isProd = process.env.NODE_ENV === 'production'
	app.set('trust proxy', isProd ? 1 : false) // nếu sau Nginx/Load balancer phải = 1

	app.use(
		session({
			name: 'sena',
			secret: 'urABLOEJZg2G9ceWl5aJclK5fbaXUxJR',
			saveUninitialized: false,
			resave: false,
			cookie: {
				httpOnly: true,
				maxAge: 60000,
				secure: isProd,
				sameSite: isProd ? 'none' : 'lax' // ✅ cross-site cần 'none'
			}
		})
	)

	app.use(json({ limit: '5mb' }))
	app.use(cookieParser())
	app.use(passport.initialize())
	app.use(passport.session())

	const allowedOrigins: RegExp[] = [/^http:\/\/localhost(?::\d+)?$/]

	app.enableCors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true)

			const ok = allowedOrigins.some((re) => re.test(origin))
			return ok ? callback(null, true) : callback(new Error('Not allowed by CORS'), false)
		},
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true
	})

	app.useGlobalFilters(new GlobalExceptionsFilter())
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			exceptionFactory: (errors: ValidationError[]) => errors[0]
		})
	)

	const options = new DocumentBuilder()
		.setTitle('Sena APIs')
		.setDescription('The Sena APIs description')
		.setVersion('1.0.0')
		.addTag('Sena')
		.build()
	const document = SwaggerModule.createDocument(app, options)

	SwaggerModule.setup('apis', app, document, {
		swaggerOptions: {
			url: `http://${process.env.HOST}:${process.env.PORT}/apis`,
			persistAuthorization: true
		},
		customSiteTitle: 'Sena API Docs'
	})

	await app.listen(parseInt(process.env.PORT, 10))

	logger.log(`Application is running on: \x1b[31m${`${await app.getUrl()}`}\x1b[0m`)
}

void bootstrap()
