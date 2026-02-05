const swaggerJsdoc = require('swagger-jsdoc');

const getServers = () => {
  const servers = [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ];

  // Add production/ngrok URL if available
  if (process.env.API_BASE_URL) {
    servers.unshift({
      url: process.env.API_BASE_URL,
      description: 'Production server',
    });
  }

  return servers;
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express Backend API',
      version: '1.0.0',
      description: 'Production-ready Express.js backend with MongoDB and JWT authentication',
    },
    servers: getServers(),
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            email: {
              type: 'string',
              example: 'user@example.com',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439012',
            },
            name: {
              type: 'string',
              example: 'Laptop',
            },
            price: {
              type: 'number',
              example: 999.99,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439013',
            },
            user: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            products: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['507f1f77bcf86cd799439012'],
            },
            totalAmount: {
              type: 'number',
              example: 999.99,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              example: 'password123',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Login successful',
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Invalid credentials',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
