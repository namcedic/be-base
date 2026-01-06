import databaseConfig from './database.config'
import appConfig from './app.config'
import redisConfig from './redis.config'
import authConfig from './auth.config'

export * from './config.type'
export const envConfigs = [databaseConfig, appConfig, redisConfig, authConfig]
