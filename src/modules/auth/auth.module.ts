import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserEntity } from '@databases/entities/user.entity'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthHelper } from '@helpers/auth.helper'
import { UserRepository } from '@databases/repositories/user.repository'
import { RedisModule } from '../redis/redis.module'
import { AuthMiddleware } from '@middlewares/auth.middleware'
import { JwtAuthService } from '@modules/auth/jwt-auth.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => {
				const authConfig = configService.get('auth')
				return {
					secret: authConfig.accessSecret,
					signOptions: { expiresIn: authConfig.accessExpires }
				}
			},
			inject: [ConfigService]
		}),
		RedisModule
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		AuthHelper,
		UserRepository,
		JwtAuthService,
		{
			provide: 'AUTH_HELPER',
			useClass: AuthHelper
		}
	],
	exports: [AuthService, JwtAuthService]
})
export class AuthModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes('*/auth/session', '*/auth/summary')
	}
}
