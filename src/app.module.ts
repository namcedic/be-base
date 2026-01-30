import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { envConfigs } from './configs'
import { typeOrmConfig } from '@databases/typeorm.config'
import { AuthModule } from '@modules/auth/auth.module'
import { RedisModule } from '@modules/redis/redis.module'
import { UsersModule } from '@modules/users/users.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: envConfigs,
			envFilePath: '.env'
		}),
		TypeOrmModule.forRoot(typeOrmConfig),
		RedisModule,
		UsersModule,
		AuthModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
