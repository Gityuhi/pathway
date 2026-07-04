package middleware

import (
	"net/http"
	"os"
)

func AuthChainMiddleware(next http.Handler) http.Handler {
	mode := os.Getenv("AUTH_MODE")
	if mode == "" {
		mode = "supabase"
	}

	switch mode {
	case "supabase":
		// SUPABASE_URL が必要なのはこのモードだけ
		return JwtAuthMiddleware(next)
	case "dev":
		return DevAuthMiddleware(next)
	default:
		panic("invalid AUTH_MODE: " + mode)
	}
}
