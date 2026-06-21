<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Gym SaaS - NestJS Backend

A NestJS backend with JWT authentication, role-based access control, and TypeORM.

## Features

- **JWT Authentication**: Secure token-based authentication with configurable expiration
- **Role-Based Access Control**: Admin and Super Admin roles with extensible design
- **Password Security**: bcrypt hashing for secure password storage
- **Database**: PostgreSQL with TypeORM
- **Input Validation**: Comprehensive validation using class-validator
- **Soft Deletes**: User soft deletion for data retention
- **CORS Enabled**: Cross-origin request support
- **Environment Configuration**: Secure environment-based configuration

## Architecture

- **Auth Module**: Authentication logic, strategies, and guards
- **User Module**: User management service
- **Role Module**: Role management service
- **TypeORM Repositories**: Database access through domain repositories

## Project Setup

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Environment Configuration
Create a `.env` file:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gym_saas"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
```

### 3. Database Setup
```bash
# Run migrations
npm run migration:run

# Seed roles, users, and spinner colors
npm run seed
```

## Running the Application

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## API Endpoints

### Authentication

- **POST** `/auth/register` - Register a new user
- **POST** `/auth/login` - Login user
- **GET** `/auth/profile` - Get authenticated user profile (protected)

For detailed API documentation and examples, see [AUTHENTICATION.md](./AUTHENTICATION.md)

## Testing

```bash
# unit tests
npm run test

# test coverage
npm run test:cov

# e2e tests
npm run test:e2e
```

## Code Quality

```bash
# lint and fix
npm run lint

# format code
npm run format
```

## Database Operations

```bash
# Create and run migrations
npm run migration:run

# Deploy migrations to production
npm run migration:run:prod

# Run seed script
npm run seed
```

## Project Structure

```
src/
├── auth/              # Authentication module
├── user/              # User management module
├── role/              # Role management module
├── database/          # Entities, migrations, and seeders
├── app.module.ts      # Main application module
└── main.ts            # Application entry point
```

## Documentation

- [Authentication Documentation](./AUTHENTICATION.md) - Detailed authentication system docs
- [TypeORM Entities](./src/database/entities) - Database schema definitions
- [NestJS Documentation](https://docs.nestjs.com) - Official NestJS docs
- [TypeORM Documentation](https://typeorm.io/) - Official TypeORM docs

## Next Steps

1. Implement additional modules (e.g., Members, Membership Plans)
2. Add role-based access control middleware
3. Implement refresh token functionality
4. Add email verification
5. Implement password reset functionality
6. Add 2FA support
7. Implement OAuth integration
8. Add API rate limiting
9. Implement comprehensive logging
10. Add monitoring and analytics

## License

This project is licensed under the UNLICENSED license.

$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
