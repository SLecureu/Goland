package database

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"math/rand"
	"os"
	"time"

	"goland/api/models"

	"github.com/gofrs/uuid"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

const TransactionTimeout = 3 * time.Second

var ErrConflict = errors.New("Conflict")

type Sqlite3Store struct{ *sql.DB }

func GenerateB64(n int) string {
	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890+-")
	id := make([]rune, n)
	for i := range id {
		id[i] = letters[rand.Intn(len(letters))]
	}
	return string(id)
}

func NewSqlite3Store() (*Sqlite3Store, error) {
	db, err := sql.Open("sqlite3", "api/database/database.sqlite")
	if err != nil {
		return nil, err
	}

	f, err := os.ReadFile("api/database/database.sql")
	if err != nil {
		return nil, err
	}

	_, err = db.Exec(string(f))
	if err != nil {
		return nil, err
	}
	return &Sqlite3Store{db}, nil
}

func (store *Sqlite3Store) RegisterUser(req *models.RegisterRequest) (user models.User, err error) {
	tx, err := store.BeginTx(req.Ctx, nil)
	if err != nil {
		return
	}
	defer tx.Rollback()

	var exists bool
	err = tx.QueryRowContext(req.Ctx, "SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)", req.Email).Scan(&exists)
	if err != nil {
		return
	}

	if exists {
		return user, ErrConflict
	}

	err = tx.Commit()
	if err != nil {
		return
	}

	tx, err = store.BeginTx(req.Ctx, nil)
	if err != nil {
		return
	}
	defer tx.Rollback()

	id, err := uuid.NewV4()
	if err != nil {
		return
	}

	crypt, err := bcrypt.GenerateFromPassword([]byte(req.Password), 11)
	if err != nil {
		return
	}

	user.ID = id.String()
	user.Email = req.Email
	user.Name = req.Name
	user.Gender = req.Gender
	user.DateOfBirth, err = time.Parse("2006-05-01", req.DateOfBirth)
	user.FirstName = req.FirstName
	user.LastName = req.LastName
	user.Created = time.Now().UTC()

	_, err = tx.ExecContext(req.Ctx, "INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
		user.ID,
		user.Email,
		user.Name,
		crypt,
		user.Gender,
		user.DateOfBirth,
		user.FirstName,
		user.LastName,
		user.Created,
	)
	if err != nil {
		return
	}

	return user, tx.Commit()
}

func (store *Sqlite3Store) LogUser(req *models.LoginRequest) (user models.User, err error) {
	tx, err := store.BeginTx(req.Ctx, &sql.TxOptions{ReadOnly: true})
	if err != nil {
		return
	}
	defer tx.Rollback()

	row := tx.QueryRowContext(req.Ctx, "SELECT * FROM users WHERE email = ?;", req.Email)
	password := []byte{}

	err = row.Scan(
		&user.ID,
		&user.Email,
		&user.Name,
		&password,
		&user.Gender,
		&user.DateOfBirth,
		&user.FirstName,
		&user.LastName,
		&user.Created,
	)
	if err != nil {
		return
	}

	err = tx.Commit()
	if err != nil {
		return
	}
	return user, bcrypt.CompareHashAndPassword(password, []byte(req.Password))
}

func (store *Sqlite3Store) GetUsers(ctx context.Context, limit, offset int) (users []models.User, err error) {
	tx, err := store.BeginTx(ctx, &sql.TxOptions{ReadOnly: true})
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()
	rows, err := tx.QueryContext(ctx, "SELECT id, email, name, gender, date_of_birth, first_name, last_name, created FROM users ORDER BY created LIMIT ? OFFSET ?;",
		limit,
		offset)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		user := models.User{}
		err = rows.Scan(
			&user.ID,
			&user.Email,
			&user.Name,
			&user.Gender,
			&user.DateOfBirth,
			&user.FirstName,
			&user.LastName,
			&user.Created,
		)
		if err != nil {
			continue
		}
		users = append(users, user)
	}
	return users, tx.Commit()
}

func (store *Sqlite3Store) CreatePost(req *models.PostRequest) (post models.Post, err error) {
	tx, err := store.BeginTx(req.Ctx, nil)
	if err != nil {
		return
	}
	defer tx.Rollback()

	if req.Categories == nil {
		req.Categories = make([]string, 0)
	}

	post.ID = GenerateB64(5)
	post.UserID = req.UserID
	post.Username = req.Username
	post.Categories = req.Categories
	post.Content = req.Content
	post.Created = time.Now().UTC()

	byteCategories, err := json.Marshal(post.Categories)
	if err != nil {
		return
	}

	_, err = tx.ExecContext(req.Ctx, "INSERT INTO posts VALUES (?, ?, ? ,?, ?);",
		post.ID,
		post.UserID,
		byteCategories,
		post.Content,
		post.Created,
	)
	if err != nil {
		return
	}
	return post, tx.Commit()
}

func (store *Sqlite3Store) GetPosts(ctx context.Context, limit, offset int) (posts []models.Post, err error) {
	tx, err := store.BeginTx(ctx, &sql.TxOptions{ReadOnly: true})
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	rows, err := tx.QueryContext(ctx,
		`SELECT posts.id, users.id, users.name, posts.categories, posts.content, posts.created 
			FROM posts JOIN users ON posts.userid = users.id ORDER BY posts.created DESC LIMIT ? OFFSET ?;`,
		limit,
		offset,
	)
	if err != nil {
		return nil, err
	}
	byteCategories := []byte{}

	for rows.Next() {
		post := models.Post{}
		err = rows.Scan(
			&post.ID,
			&post.UserID,
			&post.Username,
			&byteCategories,
			&post.Content,
			&post.Created,
		)
		if err != nil {
			return nil, err
		}

		err = json.Unmarshal(byteCategories, &post.Categories)
		if err != nil {
			return nil, err
		}

		if post.Categories == nil {
			post.Categories = make([]string, 0)
		}

		posts = append(posts, post)
	}

	return posts, tx.Commit()
}

func (store *Sqlite3Store) GetPostByID(ctx context.Context, id string) (*models.Post, error) {
	tx, err := store.BeginTx(ctx, &sql.TxOptions{ReadOnly: true})
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()
	post := new(models.Post)
	byteCategories := []byte{}
	err = tx.QueryRowContext(ctx,
		`SELECT posts.id, users.id, users.name, posts.categories, posts.content, posts.created 
			FROM posts JOIN users ON posts.userid = users.id WHERE posts.id = ?;`,
		id).Scan(
		&post.ID,
		&post.UserID,
		&post.Username,
		&byteCategories,
		&post.Content,
		&post.Created,
	)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(byteCategories, &post.Categories)
	if err != nil {
		return nil, err
	}

	if post.Categories == nil {
		post.Categories = make([]string, 0)
	}

	return post, tx.Commit()
}

func (store *Sqlite3Store) CreateComment(req *models.CommentRequest) (comment models.Comment, err error) {
	tx, err := store.BeginTx(req.Ctx, &sql.TxOptions{ReadOnly: true})
	if err != nil {
		return
	}
	defer tx.Rollback()

	var postExists, userExists bool
	err = tx.QueryRowContext(req.Ctx,
		`SELECT
			EXISTS (SELECT 1 FROM posts WHERE id = ?),
    		EXISTS (SELECT 1 FROM users WHERE id = ?);`,
		req.PostID,
		req.UserID).Scan(&postExists, &userExists)
	if err != nil {
		return
	}

	if !postExists {
		return comment, errors.New("post not found")
	}
	if !userExists {
		return comment, errors.New("user not found")
	}

	err = tx.Commit()
	if err != nil {
		return
	}

	tx, err = store.BeginTx(req.Ctx, nil)
	if err != nil {
		return
	}
	defer tx.Rollback()

	comment = models.Comment{
		ID:      GenerateB64(5),
		PostID:  req.PostID,
		UserID:  req.UserID,
		Content: req.Content,
		Created: time.Now(),
	}

	_, err = tx.ExecContext(req.Ctx, "INSERT INTO comments VALUES (?, ?, ?, ?, ?);",
		comment.ID,
		comment.PostID,
		comment.UserID,
		comment.Content,
		comment.Created,
	)
	if err != nil {
		return
	}
	return comment, tx.Commit()
}

func (store *Sqlite3Store) GetCommentsOfID(ctx context.Context, id string, limit, offset int) (comments []models.Comment, err error) {
	comments = []models.Comment{}

	tx, err := store.BeginTx(ctx, &sql.TxOptions{ReadOnly: true})
	if err != nil {
		return
	}
	defer tx.Rollback()
	rows, err := tx.QueryContext(ctx, "SELECT * FROM comments WHERE postid = ? LIMIT ? OFFSET ?;", id, limit, offset)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		comment := models.Comment{}
		err = rows.Scan(
			&comment.ID,
			&comment.UserID,
			&comment.PostID,
			&comment.Content,
			&comment.Created,
		)
		if err != nil {
			log.Println(err)
			continue
		}

		comments = append(comments, comment)
	}

	return comments, tx.Commit()
}
