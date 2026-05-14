# Docker Development

This setup runs the Laravel app, Vite, MySQL, and Adminer in Docker.

For best WSL file performance, keep the project inside the Linux filesystem, for example `~/code/larenertia`. If the project stays on the Windows drive, open it from WSL with a path like `/mnt/c/Users/jp05/Documents/Project/Docker/practice/larenertia`.

## Start

```bash
docker compose up --build
```

The first run installs Composer and npm dependencies into Docker named volumes, waits for MySQL, clears config, and runs migrations.

## URLs

- App: http://localhost:8000
- Vite: http://localhost:5173
- Adminer: http://localhost:8080
- MySQL from your host: `localhost:3307`

## Adminer Login

- System: `MySQL`
- Server: `mysql`
- Username: `laravel`
- Password: `secret`
- Database: `larenertia`

You can also log in as `root` with password `root`.

## Useful Commands

```bash
docker compose exec app php artisan migrate
docker compose exec app php artisan test
docker compose exec app php artisan tinker
docker compose exec vite npm run build
docker compose down
```

To remove the MySQL data and start fresh:

```bash
docker compose down -v
```
