package services

import "proxymity/chat-server/internal/domain/entities"

type GetUsersResponse struct {
	Users []entities.User
}

func (service *UserService) GetUsers() ([]entities.User, error) {
	users := []entities.User{
		*entities.NewUser("John", "Doe", ""),
	}

	var err error

	return users, err
}
