package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func SendJson(w http.ResponseWriter, data any, status int) {
	jsonData, err := json.Marshal(data)

	w.Header().Set("Content-Type", "application/json")

	if err != nil {
		fmt.Print(err)
		http.Error(w, "Error on trying to parse JSON", http.StatusInternalServerError)
		w.Write([]byte(`{ "error": "Error on trying to parse JSON" }`))
	}

	w.WriteHeader(status)
	w.Write(jsonData)
}
