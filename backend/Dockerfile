# Development
FROM golang:1.25.0-alpine AS development

WORKDIR /app
COPY go.mod ./backend/go.mod
RUN apk add --no-cache git postgresql-client redis
RUN go install github.com/air-verse/air@latest

RUN go mod download 

COPY ./backend .

CMD ["air", "-c", ".air.toml"]

# Builder
FROM golang:1.25.0-alpine AS builder
WORKDIR /app
COPY go.mod ./backend/go.mod
RUN go mod download
COPY . .

RUN CGO_ENABLED=0 go build -o /main backend/main.go

# Production
FROM alpine:3.20 AS production

WORKDIR /app

COPY --from=builder /main .

CMD [ "./main" ]