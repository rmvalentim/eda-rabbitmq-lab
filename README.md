# EDA RabbitMQ Lab

A minimal event-driven architecture (EDA) lab using RabbitMQ with a publisher and a consumer. The project demonstrates publishing orders to a topic exchange and consuming them in a separate service. It includes Docker support via `docker-compose.yaml` for easy local setup.

**Project Layout**

- `publisher/`: HTTP service that accepts order POSTs and publishes messages to RabbitMQ.
- `consumer/`: Service that consumes messages from RabbitMQ.
- `docker-compose.yaml`: Development setup to run RabbitMQ, publisher and consumer with Docker.

**Key details**

- Exchange: `orders_exchange` (type: `topic`, durable)
- Routing key used by publisher: `order.created`

Prerequisites

- Docker & Docker Compose (recommended)
- Node.js (if running services locally)

Quick start (Docker Compose)

1. Build and run the full stack:

```
docker-compose up --build -d
```

2. Publisher will expose an HTTP endpoint for creating orders (see examples below).

Run locally (without Docker)

1. Start RabbitMQ (locally or via Docker). A typical local URL is `amqp://guest:guest@localhost:5672`.
2. Install dependencies and start services:

```
cd publisher
npm install
SET RABBIT_URL=amqp://guest:guest@localhost:5672
SET APP_PORT=3000
node index.js

cd ..\consumer
npm install
SET RABBIT_URL=amqp://guest:guest@localhost:5672
node index.js
```

On non-Windows shells (bash / macOS / Linux) use `export` instead of `SET`.

Environment variables

- `RABBIT_URL`: AMQP connection string used by publisher and consumer.
- `APP_PORT`: (publisher) HTTP port (default: `3000`).

API (Publisher)

- POST `/order` — create an order and publish it to the `orders_exchange` with routing key `order.created`.

Example request

```
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -d '{"customer":"Jane Doe","email":"jane@example.com","value":99.95}'
```

What to look for

- The publisher logs a confirmation when an order is published.
- The consumer logs when it receives and processes messages.

Next steps

- Inspect `publisher/index.js` and `consumer/index.js` to see publishing and consuming logic.
- Extend the exchange/routing keys or add persistent queues for more advanced scenarios.