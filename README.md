## Workflows

A **leave management** app. Employees file leaves, managers approve or reject requests.

- **Frontend:** Next.js (RSC, App router, Tailwind)
- **Backend:** Django with GraphQL API (Graphene)
- **Database:** PostgreSQL
- Docker Compose.

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine with the Compose plugin)
- Git

## Running the app

```bash
git clone https://github.com/Randell-janus/umpisa-next.git
cd umpisa-next
docker compose up --build
```

Runs the migrations and loads demo data automatically. To stop, run `docker compose down`.

## Dummy data for login

All accounts use `password123`. Each employee has 15 VLs and 10 SLs.

| Username | Role |
| --- | --- |
| `juan` | Employee |
| `ana` | Employee |
| `manager` | Manager |

## Workflows

**Employee**
- View remaining vacation and sick leave credits
- File a leave request with type, dates and reason
- See a live count of weekdays while picking dates
- View all filed requests and their status

**Manager**
- View team requests by status (pending, approved, rejected)
- Review a request with the employee's remaining balance
- Approve or reject with an optional note

## Running tests

```bash
docker compose run --rm backend python manage.py test
docker compose run --rm --no-deps frontend npm test
```
