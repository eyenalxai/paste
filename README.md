# Paste

## How to deploy

#### An HTTPS environment is required due to the use of `navigator.clipboard` and `window.crypto` APIs.

Clone and cd into the repo

```bash
git clone https://github.com/eyenalxai/paste.git && cd paste
```

### Nixpacks

Build the image
```bash
nixpacks build . \
-e NEXT_PUBLIC_FRONTEND_URL=https://my-domain.com \
-e DATABASE_URL=postgres://postgres:mysecretpassword@database.com:5432/postgres \
--name paste -t paste:latest
```

Optionally add `NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION=True` and `OPENAI_API_KEY=sk-abcdefg...` to environment variables for OpenAI syntax detection

Run the container
```bash
docker run --name paste -p 3000:3000 -d paste:latest
```

### Docker

#### Without compose

Build the image
```bash
docker build --build-arg NEXT_PUBLIC_FRONTEND_URL=https://my-domain.com -t paste:latest .
```

Run the container
```bash
docker run --name paste \
-e DATABASE_URL=postgres://postgres:mysecretpassword@database.com:5432/postgres \
-p 3000:3000 -d paste:latest
```

#### With compose

Edit the `docker-compose.yml` file

Run the container
```bash
docker-compose up -d
```

## Additional configuration

For Nixpacks, all variables can be passed as environment variables during the build step and won't be required to run the container. 
Variables that do not start with `NEXT_PUBLIC_` can be passed as environment variables later to the `docker run` command to override the ones passed during the build step.

For Docker, variables that start with `NEXT_PUBLIC_` are passed as build arguments to the `docker build` command, others are passed as environment variables to the `docker run` command.

---
#### Port to run the app on
- Don't forget to change the port mapping in the `docker run` command (`-p 8000:8000`)

`PORT=8000` 

#### OpenAI Syntax Detection
`NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION=True` and `OPENAI_API_KEY=sk-abcdefg...`

#### Force client-side encryption
`NEXT_PUBLIC_CLIENT_SIDE_ENCRYPTION_ONLY=True`

#### Maximum paste size
- Defaults to 2 MiB, can be fractional (e.g. `1.5` for 1.5 MiB)

`NEXT_PUBLIC_MAX_PAYLOAD_SIZE=10`

