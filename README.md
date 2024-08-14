# Paste

## Important
An HTTPS environment is required due to the use of `navigator.clipboard` and `window.crypto` APIs.
## How to deploy

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
--name paste -t latest
```

Optionally add `NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION=True` and `OPENAI_API_KEY=sk-abcdefg...` to environment variables for OpenAI syntax detection

Run the container
```bash
docker run --name paste -p 3000:3000 -d paste:latest
```

Port can be changed with `PORT` environment variable

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

Port can be changed with `PORT` environment variable

Optionally add  `NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION=True` as build argument and `OPENAI_API_KEY=sk-abcdefg...` to environment variables for OpenAI syntax detection


#### With compose

Edit the `docker-compose.yml` file

Run the container
```bash
docker-compose up -d
```

