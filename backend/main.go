package main

import (
	"fmt"
	"net/http"
	// "github.com/99designs/gqlgen"
)

func helloHandler(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "Hello Go")
}

func ApiHandler(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "Hello API")
}

func main() {
	http.HandleFunc("/", helloHandler)
	http.HandleFunc("/api", ApiHandler)
	http.ListenAndServe(":8080", nil)
}