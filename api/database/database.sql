CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    password BLOB,
    gender TEXT,
    age INTEGER,
    first_name TEXT,
    last_name TEXT,
    created DATE
);

CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    userid TEXT REFERENCES users(id),
    categories BLOB,
    content TEXT,
    created DATE
);

CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    postid TEXT REFERENCES posts(id),
    userid TEXT REFERENCES users(id),
    content TEXT,
    created DATE
);