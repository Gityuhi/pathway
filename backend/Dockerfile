# Development
FROM golang:1.26.2-alpine AS development

WORKDIR /app

RUN apk add --no-cache git postgresql-client
RUN go install github.com/air-verse/air@latest

COPY backend/go.mod backend/go.sum ./
RUN go mod download 

COPY ./backend .

CMD ["air", "-c", ".air.toml"]

# Builder
FROM golang:1.26.2-alpine AS builder

WORKDIR /app

COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY ./backend .

RUN CGO_ENABLED=0 go build -o /main .

# Production
FROM alpine:3.20 AS production

WORKDIR /app

COPY --from=builder /main .
ENV PORT=8080
EXPOSE 8080

CMD [ "./main" ]