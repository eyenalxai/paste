# Paste

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


#### With compose

Edit the `docker-compose.yml` file

Run the container
```bash
docker-compose up -d
```

### Important
Client side encryption requires secure environment (*HTTPS*) to work, so you will need to figure it out
