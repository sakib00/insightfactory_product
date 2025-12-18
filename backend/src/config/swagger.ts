import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend API Documentation',
      version: '1.0.0',
      description: 'A well-structured REST API built with TypeScript, Express, and SQLite',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
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
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'johndoe' },
          },
        },
        Skill: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            filename: { type: 'string', example: 'my-skill.ts' },
            file_size: { type: 'integer', example: 1024 },
            name: { type: 'string', example: 'My Skill' },
            description: { type: 'string', example: 'A useful skill', nullable: true },
            version: { type: 'string', example: '1.0.0' },
            author: { type: 'string', example: 'John Doe', nullable: true },
            content: { type: 'string', example: 'export default function...' },
            is_public: { type: 'boolean', example: true },
            download_count: { type: 'integer', example: 42 },
            clone_count: { type: 'integer', example: 10 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        SkillWithTags: {
          allOf: [
            { $ref: '#/components/schemas/Skill' },
            {
              type: 'object',
              properties: {
                tags: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Tag' },
                },
              },
            },
          ],
        },
        SkillWithOwner: {
          allOf: [
            { $ref: '#/components/schemas/SkillWithTags' },
            {
              type: 'object',
              properties: {
                owner: { $ref: '#/components/schemas/User' },
              },
            },
          ],
        },
        Tag: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'TypeScript' },
            slug: { type: 'string', example: 'typescript' },
            usage_count: { type: 'integer', example: 15 },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                username: { type: 'string', example: 'johndoe' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Error message' },
          },
        },
      },
    },
    security: [],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
