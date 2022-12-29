# Container with python3, pip and venv
# only built once

# Container with the python venv containing all the dependencies for server
# only built, when requirements.txt changes
FROM python:3.10-slim-bullseye AS base
RUN python3 -m venv /venv
RUN /venv/bin/pip install poetry

# Build the dependencies
FROM base AS server-build-venv
COPY server/poetry.lock server/pyproject.toml /
RUN . /venv/bin/activate && /venv/bin/poetry install --no-root --without dev

# Container with nodejs that creates a bundled build of the app
# Splitting npm ci and npm run build separates the dependency installation from the edits to the source code
FROM node:16 AS app-build
# part I: Install dependencies
# only built, when package.json or package-lock.json change
COPY app/package*.json /app/
WORKDIR /app
RUN npm ci
# part II: Create bundle build
# only built, when app souce code changes
COPY app /app
RUN CI=false npm run build


# Container with the python venv and the bundled app build
FROM python:3.10-slim-bullseye
# Copy the venv with all the dependencies
COPY --from=server-build-venv /venv /venv
# Copy the server code
COPY server /server
# Copy the app build
COPY --from=app-build /app/build /app/build

WORKDIR /server
ENV PYTHONPATH="/server"

EXPOSE 5200

ENTRYPOINT ["/venv/bin/uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "5200"]
