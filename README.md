![Examanager-logos-wide.jpeg](docs%2FExamanager-logos-wide.jpeg)

Examanager is a web app for teachers to manage exams and their classes’ results. It allows viewing and editing exam
results, statistical analysis and data export to `Excel`

## Quick Start

```shell
git clone https://github.com/BeneLuWi/examanager_v3.git
cd examanager_v3
```

- Initialize the `admin` user by adding the environment variable `INIT_ADMIN_USER: true` to the `examanager` service

```shell
docker compose up -d
```

- Visit `http://localhost:5200` and login with `admin:ChangeMe`
- Visit the API Docs [Swagger UI](http://localhost:5200/docs)
