import swaggerJsdoc from 'swagger-jsdoc'

const options = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'My API',
			version: '1.0.0',
			description: 'API documentation using Swagger',
		},
        servers: [{ url: 'http://localhost:3000' }],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Harus menggunakan JWT',
                },
            }
        }
	},
	apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)