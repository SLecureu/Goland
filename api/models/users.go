package models

import (
	"context"
	"time"
)

type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	Gender    string    `json:"gender"`
	Age       string    `json:"age"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Created   time.Time `json:"created"`
}

type RegisterRequest struct {
	Email     string `json:"email"`
	Name      string `json:"name"`
	Password  string `json:"password"`
	Gender    string `json:"gender"`
	Age       string `json:"age"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Ctx       context.Context
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Ctx      context.Context
}
