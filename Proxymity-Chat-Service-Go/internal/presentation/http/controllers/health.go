package controllers

import "net/http"

func HealthCheck(writter http.ResponseWriter, request *http.Request) {
	writter.Write([]byte("Healthy"))
}
