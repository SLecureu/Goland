package database

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

	"goland/api/models"

	"github.com/gofrs/uuid"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

const TransactionTimeout = 3 * time.Second

var ErrConflict = errors.New("Conflict")

type PostgreSQLStore struct{ *sql.DB }

func generateB64(n int) string {
	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890+-")
	id := make([]rune, n)
	for i := range id {
		id[i] = letters[rand.Intn(len(letters))]
	}
	return string(id)
}

func NewPostgreSQLStore() (*PostgreSQLStore, error) {
	db, err := sql.Open("postgres",
		fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable",
			os.Getenv("POSTGRES_USER"),
			os.Getenv("POSTGRES_PASSWORD"),
			os.Getenv("POSTGRES_HOST"),
			os.Getenv("POSTGRES_DB")))
	if err != nil {
		return nil, err
	}
	return &PostgreSQLStore{db}, nil
}

func (store *PostgreSQLStore) RegisterUser(ctx context.Context, req *models.RegisterRequest) (user models.User, err error) {
	tx, err := store.BeginTx(ctx, nil)
	if err != nil {
		return
	}
	defer tx.Rollback()

	var exists bool
	err = tx.QueryRowContext(ctx, "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1);", req.Email).Scan(&exists)
	if err != nil {
		return
	}

	if exists {
		return user, ErrConflict
	}

	tx, err = store.BeginTx(ctx, nil)
	if err != nil {
		return
	}

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
	user.Posts = []string{}

	_, err = tx.ExecContext(ctx, "INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);",
		user.ID,
		user.Email,
		user.Name,
		crypt,
		user.Gender,
		user.DateOfBirth,
		user.FirstName,
		user.LastName,
		user.Created,
		user.Posts,
	)
	if err != nil {
		return
	}

	return user, tx.Commit()
}

func (store *PostgreSQLStore) LogUser(ctx context.Context, req *models.LoginRequest) (user models.User, err error) {
	row := store.QueryRowContext(ctx, "SELECT * FROM users WHERE email = $1;", req.Email)
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
		&user.Posts,
	)
	if err != nil {
		return
	}

	return user, bcrypt.CompareHashAndPassword(password, []byte(req.Password))
}

func (store *PostgreSQLStore) GetUsers(ctx context.Context, limit, offset *int) (users []models.User, err error) {
	rows, err := store.QueryContext(ctx,
		`SELECT id, email, name, gender, date_of_birth, first_name, last_name, created
		FROM users 
		ORDER BY created 
		LIMIT $1 
		OFFSET $2;`,

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
	return users, nil
}

func (store *PostgreSQLStore) GetUsersById(ctx context.Context, id string) (*models.User, error) {
	user := new(models.User)
	err := store.QueryRowContext(ctx,
		`SELECT id, email, name, gender,date_of_birth, first_name, last_name, created, posts
		FROM users
		WHERE id = $1;`, id).Scan(
		&user.ID,
		&user.Email,
		&user.Name,
		&user.Gender,
		&user.DateOfBirth,
		&user.FirstName,
		&user.LastName,
		&user.Created,
		&user.Posts,
	)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (store *PostgreSQLStore) CreatePost(ctx context.Context, req *models.PostRequest) (post models.Post, err error) {
	tx, err := store.BeginTx(ctx, nil)
	if err != nil {
		return
	}
	defer tx.Rollback()

	post.ID = generateB64(5)
	post.UserID = req.UserID
	post.Username = req.Username
	post.Categories = req.Categories
	post.Content = req.Content
	post.Image = req.ImagePath

	post.Categories = req.Categories
	post.Created = time.Now().UTC()

	_, err = tx.ExecContext(ctx, "INSERT INTO posts VALUES ($1, $2, $3 ,$4, $5, $6);",
		post.ID,
		post.UserID,
		post.Categories,
		post.Content,
		post.Created,
		post.Image,
	)
	if err != nil {
		return
	}

	_, err = tx.ExecContext(ctx,
		`UPDATE users
		SET posts = array_append(posts, $1 )
		WHERE id = $2;`,
		post.ID,
		post.UserID)
	if err != nil {
		return
	}

	return post, tx.Commit()
}

func (store *PostgreSQLStore) GetPosts(ctx context.Context, limit, offset *int) (posts []models.Post, err error) {
	posts = []models.Post{}

	rows, err := store.QueryContext(ctx,
		`SELECT posts.id, users.id, users.name, posts.categories, posts.content, posts.created 
		FROM posts 
		JOIN users ON posts.userid = users.id
		ORDER BY posts.created DESC 
		LIMIT $1 
		OFFSET $2;`,

		limit,
		offset,
	)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		post := models.Post{}
		err = rows.Scan(
			&post.ID,
			&post.UserID,
			&post.Username,
			&post.Categories,
			&post.Content,
			&post.Created,
		)
		if err != nil {
			return nil, err
		}

		posts = append(posts, post)
	}

	return posts, nil
}

func (store *PostgreSQLStore) GetPostByID(ctx context.Context, id string) (*models.Post, error) {
	post := new(models.Post)
	err := store.QueryRowContext(ctx,
		`SELECT posts.id, users.id, users.name, posts.categories, posts.content, posts.created 
			FROM posts JOIN users ON posts.userid = users.id WHERE posts.id = $1;`,
		id).Scan(
		&post.ID,
		&post.UserID,
		&post.Username,
		&post.Categories,
		&post.Content,
		&post.Created,
	)
	if err != nil {
		return nil, err
	}

	return post, nil
}

func (store *PostgreSQLStore) CreateComment(req *models.CommentRequest) (comment models.Comment, err error) {
	var postExists, userExists bool
	err = store.QueryRowContext(req.Ctx,
		`SELECT
			EXISTS (SELECT 1 FROM posts WHERE id = $1),
    		EXISTS (SELECT 1 FROM users WHERE id = $2);`,
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

	tx, err := store.BeginTx(req.Ctx, nil)
	if err != nil {
		return
	}
	defer tx.Rollback()

	comment = models.Comment{
		ID:      generateB64(5),
		PostID:  req.PostID,
		UserID:  req.UserID,
		Content: req.Content,
		Created: time.Now(),
	}

	_, err = tx.ExecContext(req.Ctx, "INSERT INTO comments VALUES ($1, $2, $3, $4, $5);",
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

func (store *PostgreSQLStore) GetCommentsOfID(ctx context.Context, id string, limit, offset *int) (comments []models.Comment, err error) {
	comments = []models.Comment{}
	rows, err := store.QueryContext(ctx, "SELECT * FROM comments WHERE postid = $1 LIMIT $2 OFFSET $3;", id, limit, offset)
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

	return comments, nil
}

func (store *PostgreSQLStore) GetCategory(ctx context.Context, name string, limit, offset *int) (posts []models.Post, err error) {
	posts = []models.Post{}

	rows, err := store.QueryContext(ctx,
		`SELECT posts.id, users.id, users.name, posts.categories, posts.content, posts.created 
		FROM posts JOIN users 
		ON posts.userid = users.id 
		WHERE $1 = ANY(posts.categories)
		ORDER BY posts.created DESC LIMIT $2 OFFSET $3;`,

		name,
		limit,
		offset,
	)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		post := models.Post{}
		err = rows.Scan(
			&post.ID,
			&post.UserID,
			&post.Username,
			&post.Categories,
			&post.Content,
			&post.Created,
		)
		if err != nil {
			return nil, err
		}

		posts = append(posts, post)
	}
	return posts, nil
}
