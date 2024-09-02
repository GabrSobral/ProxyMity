package database

import (
	"context"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Database struct {
	Db     *mongo.Database
	Client *mongo.Client
}

func NewDatabase() *Database {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	databaseUrl := os.Getenv("DATABASE_URL")
	databaseName := os.Getenv("DATABASE_NAME")

	clientOptions := options.Client().
		ApplyURI(databaseUrl).
		SetMaxPoolSize(50).
		SetMinPoolSize(10).
		SetCompressors([]string{"snappy"}).
		SetMaxConnIdleTime(10 * time.Minute)

	client, err := mongo.Connect(ctx, clientOptions)

	if err != nil {
		panic(err)
	}

	defer client.Disconnect(context.Background())

	return &Database{
		Db:     client.Database(databaseName),
		Client: client,
	}
}
