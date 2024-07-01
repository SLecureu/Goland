package models

import (
	"context"
	"time"
)

type Post struct {
	ID         string    `json:"id"`
	UserID     string    `json:"userID"`
	Username   string    `json:"username"`
	Categories []string  `json:"categories"`
	Content    string    `json:"content"`
	Created    time.Time `json:"created"`
}

type PostRequest struct {
	Content    string `json:"content"`
	UserID     string
	Username   string
	Categories []string `json:"categories"`
	Ctx        context.Context
}
