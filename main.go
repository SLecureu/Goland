package main

import (
	"goland/api"
	"log"
)

func main() {
	server, err := api.NewAPI(":8080")
	if err != nil {
		log.Fatalln(err)
	}

	log.Printf("Server up and running on port %s\n", server.Addr)
	err = server.ListenAndServe()
	if err != nil {
		log.Println("Error here")
	}
}
