package controllers

import (
	"fmt"
	"net/http"

	services "proxymity/chat-server/internal/application/services/user_service"
	utils "proxymity/chat-server/internal/presentation/http"
)

type UserController struct {
	userService services.UserService
}

func NewUserController(userService services.UserService) *UserController {
	return &UserController{
		userService: userService,
	}
}

func (controller *UserController) GetUsers(w http.ResponseWriter, request *http.Request) {
	users, err := controller.userService.GetUsers()

	if err != nil {
		fmt.Print(err)
		http.Error(w, "Error on trying to parse JSON", http.StatusInternalServerError)
		w.Write([]byte(`{ "error": "Error on trying to parse JSON" }`))
	}

	utils.SendJson(w, users, http.StatusOK)
}
