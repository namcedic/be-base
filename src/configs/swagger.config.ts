import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

const getSwaggerDescription = () => {
	const gitHash = process?.env?.GIT_COMMIT_HASH
	const gitMessage = process?.env?.GIT_COMMIT_MSG

	if (!gitHash && !gitMessage) {
		return 'ATE API Documentation 📝📝 '
	}
	return `${gitHash} | ${gitMessage}`
}

export function swaggerConfig(app: INestApplication) {
	const description = getSwaggerDescription()
	const config = new DocumentBuilder()
		.setTitle('ATE API V1.1.6')
		.setDescription(description)
		.addBearerAuth()
		.setVersion('0.0.1')
		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('docs', app, document, {
		swaggerOptions: {
			persistAuthorization: true
		}
	})
}
