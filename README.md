# Spinner Wheel

## Run with Docker

1. Create the Compose environment file:

   ```sh
   cp .env.example .env
   ```

2. Replace `POSTGRES_PASSWORD` and `JWT_SECRET` in `.env` with strong values.

3. Build and start the application:

   ```sh
   docker compose up --build -d
   ```

4. Open <http://localhost:8080> (or the port configured by `APP_PORT`).

TypeORM migrations and idempotent seeders are applied automatically whenever the backend container starts.
To rerun the roles, sample users, and spinner-color seeders manually:

```sh
docker compose exec backend npm run seed:prod
```

Stop the containers with `docker compose down`. To also delete the PostgreSQL
data volume, use `docker compose down -v`.
