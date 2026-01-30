import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '@databases/entities/user.entity'
import { UserRepository } from '@databases/repositories/user.repository'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { AuthMiddleware } from '@middlewares/auth.middleware'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	providers: [UsersService, UserRepository],
	controllers: [UsersController]
})
export class UsersModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.forRoutes({ path: 'v1/users', method: RequestMethod.ALL }, { path: 'v1/users/(.*)', method: RequestMethod.ALL })
	}
}
