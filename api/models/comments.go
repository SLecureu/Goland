package models

import (
	"context"
	"time"
)

type Comment struct {
	ID      string    `json:"id"`
	UserID  string    `json:"userid"`
	PostID  string    `json:"postid"`
	Content string    `json:"content"`
	Created time.Time `json:"created"`
}

type CommentRequest struct {
	UserID  string
	PostID  string
	Content string `json:"content"`
	Ctx     context.Context
}
