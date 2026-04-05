package main

import (
	"fmt"
	"net/http"
)

func helloHandler(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "Hello Go")
}

func main() {
	http.HandleFunc("/", helloHandler)
	http.ListenAndServe(":8080", nil)
}