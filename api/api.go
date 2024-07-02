package api

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"net/mail"
	"strconv"

	"goland/api/database"
	"goland/api/models"
)

type API struct {
	http.Server
	Storage  *database.Sqlite3Store
	Sessions *database.SessionStore
}

type APIerror struct {
	Status  int    `json:"status"`
	Error   string `json:"error"`
	Message string `json:"message"`
}

func NewAPI(addr string) (*API, error) {
	server := new(API)
	server.Server.Addr = addr

	router := http.NewServeMux()

	router.HandleFunc("/api/register", HandleFunc(server.Register))
	router.HandleFunc("/api/login", HandleFunc(server.Login))
	router.HandleFunc("/api/logout", server.Protected(server.Logout))

	router.HandleFunc("/api/auth", server.Protected(server.ReadSession))

	// router.HandleFunc("/api/users", server.Protected(server.GetUsers))
	// router.HandleFunc("/api/posts", server.Protected(server.GetPosts))
	// router.HandleFunc("/api/post", server.Protected(server.Post))
	// router.HandleFunc("/api/post/{id}", server.Protected(server.GetPostByID))
	// router.HandleFunc("/api/post/{id}/comment", server.Protected(server.Comment))
	// router.HandleFunc("/api/post/{id}/comments", server.Protected(server.GetCommentsOfID))

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) { // Frontend setup
		http.ServeFile(w, r, "index.html")
	})
	router.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("assets"))))

	server.Server.Handler = router

	storage, err := database.NewSqlite3Store()
	if err != nil {
		return nil, err
	}

	server.Storage = storage
	server.Sessions = database.NewSessionStore()
	return server, nil
}

func parseRequestLimitAndOffset(request *http.Request) (limit, offset int) {
	params := request.URL.Query()

	limit, _ = strconv.Atoi(params.Get("limit"))
	if limit == 0 {
		limit = -1
	}

	offset, _ = strconv.Atoi(params.Get("offset"))
	return limit, offset
}

func writeJSON(writer http.ResponseWriter, statusCode int, v any) error {
	writer.Header().Add("Content-Type", "application/json")
	writer.WriteHeader(statusCode)
	return json.NewEncoder(writer).Encode(v)
}

type HandlerFunc func(http.ResponseWriter, *http.Request) error

func HandleFunc(fn HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := fn(w, r); err != nil {
			writeJSON(w, http.StatusInternalServerError,
				APIerror{
					Status:  http.StatusInternalServerError,
					Error:   "Internal Server Error",
					Message: "Something went Wrong :/",
				})
		}
	}
}

func (server *API) Protected(fn HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, err := server.Sessions.GetSession(r)
		if err != nil {
			writeJSON(w, http.StatusUnauthorized,
				APIerror{
					Status:  http.StatusUnauthorized,
					Error:   "Unauthorized",
					Message: "You are not authorized to access this ressource",
				})
			return
		}
		if err := fn(w, r); err != nil {
			writeJSON(w, http.StatusInternalServerError,
				APIerror{
					Status:  http.StatusInternalServerError,
					Error:   "Internal Server Error",
					Message: err.Error(),
				})
		}
	})
}

func (server *API) Register(writer http.ResponseWriter, request *http.Request) error {
	if request.Method != http.MethodPost {
		return writeJSON(writer, http.StatusMethodNotAllowed,
			APIerror{
				Status:  http.StatusMethodNotAllowed,
				Error:   "Method Not Allowed",
				Message: "Method not allowed: Only POST is supported",
			})
	}

	registerReq := new(models.RegisterRequest)
	err := json.NewDecoder(request.Body).Decode(registerReq)
	if err != nil {
		return writeJSON(writer, http.StatusUnprocessableEntity,
			APIerror{
				Status:  http.StatusUnprocessableEntity,
				Error:   "Unprocessable Entity",
				Message: "Could not process register request",
			})
	}

	if registerReq.Email == "" ||
		registerReq.Name == "" ||
		registerReq.Password == "" ||
		registerReq.Gender == "" ||
		registerReq.DateOfBirth == "" ||
		registerReq.FirstName == "" ||
		registerReq.LastName == "" {

		return writeJSON(writer, http.StatusUnauthorized,
			APIerror{
				Status:  http.StatusUnauthorized,
				Error:   "Unauthorized",
				Message: "All fields are required",
			})
	}

	if _, err = mail.ParseAddress(registerReq.Email); err != nil {
		return writeJSON(writer, http.StatusBadRequest,
			APIerror{
				Status:  http.StatusBadRequest,
				Error:   "Bad Request",
				Message: "Invalid Email address",
			})
	}

	var cancel context.CancelFunc
	registerReq.Ctx, cancel = context.WithTimeout(request.Context(), database.TransactionTimeout)
	defer cancel()
	user, err := server.Storage.RegisterUser(registerReq)
	if errors.Is(err, database.ErrConflict) {
		return writeJSON(writer, http.StatusConflict,
			APIerror{
				Status:  http.StatusConflict,
				Error:   "Conflict",
				Message: "Email address is already taken",
			})
	}
	if err != nil {
		return err
	}

	session := server.Sessions.NewSession(writer, request)
	session.User = user

	return writeJSON(writer, http.StatusCreated, user)
}

func (server *API) Login(writer http.ResponseWriter, request *http.Request) error {
	if request.Method != http.MethodPost {
		return writeJSON(writer, http.StatusMethodNotAllowed,
			APIerror{
				Status:  http.StatusMethodNotAllowed,
				Error:   "Method Not Allowed",
				Message: "Method not allowed: Only POST is supported",
			})
	}

	loginReq := new(models.LoginRequest)
	err := json.NewDecoder(request.Body).Decode(loginReq)
	if err != nil {
		return writeJSON(writer, http.StatusUnprocessableEntity,
			APIerror{
				Status:  http.StatusUnprocessableEntity,
				Error:   "Unprocessable Entity",
				Message: "Could not process login request",
			})
	}

	if loginReq.Email == "" ||
		loginReq.Password == "" {
		return writeJSON(writer, http.StatusBadRequest,
			APIerror{
				Status:  http.StatusUnauthorized,
				Error:   "Unauthorized",
				Message: "Email and password are required",
			})
	}

	if _, err = mail.ParseAddress(loginReq.Email); err != nil {
		return writeJSON(writer, http.StatusBadRequest,
			APIerror{
				Status:  http.StatusBadRequest,
				Error:   "Bad Request",
				Message: "Invalid Email address",
			})
	}
	var cancel context.CancelFunc
	loginReq.Ctx, cancel = context.WithTimeout(request.Context(), database.TransactionTimeout)
	defer cancel()
	user, err := server.Storage.LogUser(loginReq)
	if err != nil {
		return writeJSON(writer, http.StatusBadRequest,
			APIerror{
				Status:  http.StatusBadRequest,
				Error:   "Bad Request",
				Message: "Invalid Email address",
			})
	}

	session := server.Sessions.NewSession(writer, request)
	session.User = user

	return writeJSON(writer, http.StatusOK, user)
}

func (server *API) Logout(writer http.ResponseWriter, request *http.Request) error {
	err := server.Sessions.EndSession(request)
	if err != nil {
		return err
	}

	return writeJSON(writer, http.StatusOK, "Session ended.")
}

func (server *API) GetUsers(writer http.ResponseWriter, request *http.Request) error {
	ctx, cancel := context.WithTimeout(request.Context(), database.TransactionTimeout)
	defer cancel()
	limit, offset := parseRequestLimitAndOffset(request)
	users, err := server.Storage.GetUsers(ctx, limit, offset)
	if err != nil {
		return writeJSON(writer, http.StatusInternalServerError,
			APIerror{
				Status:  http.StatusInternalServerError,
				Error:   "Internal Server Error",
				Message: "Something went wrong :/",
			})
	}
	return writeJSON(writer, http.StatusOK, users)
}

func (server *API) ReadSession(writer http.ResponseWriter, request *http.Request) error {
	session, err := server.Sessions.GetSession(request)
	if err != nil {
		return writeJSON(writer, http.StatusInternalServerError,
			APIerror{
				Status:  http.StatusServiceUnavailable,
				Error:   "Service Unavailable",
				Message: "Unable to retrieve Session",
			})
	}
	return writeJSON(writer, http.StatusOK, session.User)
}

func (server *API) Post(writer http.ResponseWriter, request *http.Request) error {
	if request.Method != http.MethodPost {
		return writeJSON(writer, http.StatusMethodNotAllowed,
			APIerror{
				Status:  http.StatusMethodNotAllowed,
				Error:   "Method Not Allowed",
				Message: "Method not allowed: Only POST is supported",
			})
	}

	postReq := new(models.PostRequest)
	err := json.NewDecoder(request.Body).Decode(postReq)
	if err != nil {
		return writeJSON(writer, http.StatusUnprocessableEntity,
			APIerror{
				Status:  http.StatusUnprocessableEntity,
				Error:   "Unprocessable Entity",
				Message: "Could not process post request",
			})
	}

	if postReq.Content == "" {
		return writeJSON(writer, http.StatusBadRequest,
			APIerror{
				Status:  http.StatusServiceUnavailable,
				Error:   "Service Unavailable",
				Message: "Unable to retrieve Session",
			})
	}

	session, err := server.Sessions.GetSession(request)
	if err != nil {
		return writeJSON(writer, http.StatusInternalServerError,
			APIerror{
				Status:  http.StatusServiceUnavailable,
				Error:   "Service Unavailable",
				Message: "Unable to retrieve Session",
			})
	}

	postReq.UserID = session.User.ID
	postReq.Username = session.User.Name

	var cancel context.CancelFunc
	postReq.Ctx, cancel = context.WithTimeout(request.Context(), database.TransactionTimeout)
	defer cancel()

	post, err := server.Storage.CreatePost(postReq)
	if err != nil {
		return err
	}

	return writeJSON(writer, http.StatusCreated, post)
}

func (server *API) GetPostByID(writer http.ResponseWriter, request *http.Request) error {
	ctx, cancel := context.WithTimeout(request.Context(), database.TransactionTimeout)
	defer cancel()

	post, err := server.Storage.GetPostByID(ctx, request.PathValue("id"))
	if err != nil {
		return err
	}

	return writeJSON(writer, http.StatusOK, post)
}

func (server *API) GetPosts(writer http.ResponseWriter, request *http.Request) error {
	ctx, cancel := context.WithTimeout(request.Context(), database.TransactionTimeout)
	defer cancel()

	limit, offset := parseRequestLimitAndOffset(request)
	posts, err := server.Storage.GetPosts(ctx, limit, offset)
	if err != nil {
		return err
	}

	return writeJSON(writer, http.StatusOK, posts)
}

func (server *API) Comment(writer http.ResponseWriter, request *http.Request) error {
	if request.Method != http.MethodPost {
		return writeJSON(writer, http.StatusMethodNotAllowed,
			APIerror{
				Status:  http.StatusMethodNotAllowed,
				Error:   "Method Not Allowed",
				Message: "Method not allowed: Only POST is supported",
			})
	}

	commentReq := new(models.CommentRequest)
	err := json.NewDecoder(request.Body).Decode(commentReq)
	if err != nil {
		return writeJSON(writer, http.StatusUnprocessableEntity,
			APIerror{
				Status:  http.StatusUnprocessableEntity,
				Error:   "Unprocessable Entity",
				Message: "Could not process register request",
			})
	}

	if commentReq.Content == "" {
		return writeJSON(writer, http.StatusBadRequest,
			APIerror{
				Status:  http.StatusBadRequest,
				Error:   "Status Bad Request",
				Message: "Content field is required",
			})
	}

	session, err := server.Sessions.GetSession(request)
	if err != nil {
		return writeJSON(writer, http.StatusInternalServerError,
			APIerror{
				Status:  http.StatusServiceUnavailable,
				Error:   "Service Unavailable",
				Message: "Unable to retrieve Session",
			})
	}
	commentReq.UserID = session.User.ID
	commentReq.PostID = request.PathValue("id")

	var cancel context.CancelFunc
	commentReq.Ctx, cancel = context.WithTimeout(request.Context(), database.TransactionTimeout)
	defer cancel()

	comment, err := server.Storage.CreateComment(commentReq)
	if err != nil {
		log.Println(err)
		return err
	}

	return writeJSON(writer, http.StatusOK, comment)
}

func (server *API) GetCommentsOfID(writer http.ResponseWriter, request *http.Request) error {
	ctx, cancel := context.WithTimeout(request.Context(), database.TransactionTimeout)
	defer cancel()
	limit, offset := parseRequestLimitAndOffset(request)

	comments, err := server.Storage.GetCommentsOfID(ctx, request.PathValue("id"), limit, offset)
	if err != nil {
		return err
	}
	return writeJSON(writer, http.StatusOK, comments)
}
