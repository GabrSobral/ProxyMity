package services

import (
	"proxymity/chat-server/internal/infra/database/repositories"
)

type UserService struct {
	userRepository *repositories.UserRepositoryImpl
}

func NewUserService(userRepository *repositories.UserRepositoryImpl) *UserService {
	return &UserService{userRepository}
}
