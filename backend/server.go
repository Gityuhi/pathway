//go:generate go run github.com/99designs/gqlgen generate

package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"pathway-backend/graph"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/vektah/gqlparser/v2/ast"
)

const defaultPort = "8080"

func main() {

	dbSource := os.Getenv("DB_SOURCE")
	if dbSource == "" {
		log.Fatal("DB_SOURCE is not set")
	}
	config, err := pgxpool.ParseConfig(dbSource)
	if err != nil {
		log.Fatal("cannot parse db source:", err)
	}
	config.MaxConns = 10

	ctx := context.Background()

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		log.Fatal("cannot create db pool:", err)
	}
	defer pool.Close()

	pingCtx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	if err := pool.Ping(pingCtx); err != nil {
		log.Fatal("cannot ping db:", err)
	}
	log.Println("Connected to db")

	port := os.Getenv("API_PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
