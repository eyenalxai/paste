# Paste

## How to deploy

1. Clone and cd into the repo
```bash
git clone https://github.com/eyenalxai/paste.git
```
2. Build the image
```bash
nixpacks build paste \
-e NEXT_PUBLIC_FRONTEND_URL=https://my-domain.com \
-e DATABASE_URL=postgres://postgres:mysecretpassword@database.com:5432/postgres \
--name paste -t latest
```

3. Run the container
```bash
docker run --name paste -p 3000:3000 -d paste:latest
```

If you want to run it on the different port, you can change it via `PORT` environment variable.

```bash
docker run --name paste -e PORT=8000 -p 8000:8000 -d paste:latest
```

Client side encryption requires secure environment (HTTPS) to work, so you will need to figure it out.
