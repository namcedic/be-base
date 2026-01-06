import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { envConfigs } from './configs'
import { typeOrmConfig } from '@databases/typeorm.config'
import { AuthModule } from '@modules/auth/auth.module'
import { RedisModule } from '@modules/redis/redis.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: envConfigs,
			envFilePath: '.env'
		}),
		TypeOrmModule.forRoot(typeOrmConfig),
		RedisModule,
		AuthModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
