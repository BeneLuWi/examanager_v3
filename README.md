<p align="center">
  <a href="https://github.com/BeneLuWi/examanager_v3"><img src="docs/Examanager-logos-wide.jpeg" alt="Examanager"></a>
</p>

<p align="center">
  <a href="https://hub.docker.com/r/beneluwi/examanager" target="_blank">
      <img src="https://img.shields.io/docker/v/beneluwi/examanager?color=%23086dd7&logo=Docker" alt="Docker">
  </a>
</p>

<hr/>

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

## Development Setup

You need: `docker compose`, `python@3.10`, `poerty`, `node`, `npm`

- Start Database

```shell
docker compose -f docker-compose-dev.yml up mongodb
```

- Start server

```shell
cd server
poetry install
poetry shell
uvicorn server.main:app --port 5200
```

- Start app

```shell
cd app
npm install
npm start
```
