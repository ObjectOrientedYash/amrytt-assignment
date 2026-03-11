import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
dotenv.config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Blog Platform API',
            version: '1.0.0',
            description: 'A RESTful API for a blog platform with real-time features'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}/api`,
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['src/server.js', 'src/routes/*.js'] // Define where your paths and schemas are documented
};

export const specs = swaggerJsdoc(options);
export {swaggerUi};
