package middleware

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/MicahParks/keyfunc/v3"
	"github.com/golang-jwt/jwt/v5"
)

func JwtAuthMiddleware(next http.Handler) http.Handler {
	supabaseURL := strings.TrimRight(os.Getenv("SUPABASE_URL"), "/")
	if supabaseURL == "" {
		panic("SUPABASE_URL is not set")
	}

	jwksURL := supabaseURL + "/auth/v1/.well-known/jwks.json"
	kf, err := keyfunc.NewDefaultCtx(context.Background(), []string{jwksURL})
	if err != nil {
		panic(fmt.Sprintf("failed to load JWKS from %s: %v", jwksURL, err))
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString, err := bearerToken(r)
		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		sub, err := verifySupabaseJWT(tokenString, kf)
		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		ctx := WithUserID(r.Context(), sub)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func bearerToken(r *http.Request) (string, error) {
	auth := r.Header.Get("Authorization")
	if !strings.HasPrefix(auth, "Bearer ") {
		return "", fmt.Errorf("missing bearer token")
	}
	token := strings.TrimSpace(strings.TrimPrefix(auth, "Bearer "))
	if token == "" {
		return "", fmt.Errorf("empty bearer token")
	}
	return token, nil
}

func verifySupabaseJWT(tokenString string, kf keyfunc.Keyfunc) (string, error) {
	// JWKS の公開鍵で署名を検証する（ES256 / RS256 / EdDSA）
	token, err := jwt.Parse(tokenString, kf.Keyfunc,
		jwt.WithValidMethods([]string{
			jwt.SigningMethodES256.Alg(),
			jwt.SigningMethodRS256.Alg(),
			jwt.SigningMethodEdDSA.Alg(),
		}),
		jwt.WithAudience("authenticated"),
	)
	if err != nil {
		return "", fmt.Errorf("failed to parse token: %w", err)
	}
	if !token.Valid {
		return "", fmt.Errorf("invalid token")
	}

	sub, err := token.Claims.GetSubject()
	if err != nil || sub == "" {
		return "", fmt.Errorf("invalid token subject")
	}

	return sub, nil
}
