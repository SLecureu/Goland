package models

import (
	"time"

	"github.com/lib/pq"
)

type User struct {
	ID          string         `json:"id"`
	Email       string         `json:"email"`
	Name        string         `json:"name"`
	Gender      string         `json:"gender"`
	DateOfBirth time.Time      `json:"dateOfBirth"`
	FirstName   string         `json:"firstName"`
	LastName    string         `json:"lastName"`
	Created     time.Time      `json:"created"`
	Posts       pq.StringArray `json:"posts"`
}

type RegisterRequest struct {
	Email       string `json:"email"`
	Name        string `json:"name"`
	Password    string `json:"password"`
	Gender      string `json:"gender"`
	DateOfBirth string `json:"dateOfBirth"`
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
