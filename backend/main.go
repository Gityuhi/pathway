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

func successHandler(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "success cd")
}

func main() {
	http.HandleFunc("/", helloHandler)
	http.HandleFunc("/api", ApiHandler)
	http.HandleFunc("/success", successHandler)
	http.ListenAndServe(":8080", nil)
}