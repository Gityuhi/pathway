package middleware

import (
	"net/http"
	"os"
)

func DevAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userID := os.Getenv("DEV_USER_ID")
		if userID == "" {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		ctx := WithUserID(r.Context(), userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}