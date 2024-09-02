package main

import (
	"net/http"

	api "proxymity/chat-server/internal/core"
	"proxymity/chat-server/internal/infra/database"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}

	db := database.NewDatabase()
	apiHandler := api.Initianize(db)

	http.ListenAndServe(":3000", apiHandler)
}
