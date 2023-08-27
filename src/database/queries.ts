// create users table
export const CREATE_USERS_DATABASE = "CREATE TABLE IF NOT EXISTS users (id bigserial primary key, username text UNIQUE, password text, createdAt timestamptz DEFAULT now());";
export const CREATE_USERNAME_INDEX = "CREATE INDEX IF NOT EXISTS username ON users (username);"
export const CREATE_USERS_INDEX = "CREATE INDEX IF NOT EXISTS id ON users (id);"

// create posts table
export const CREATE_POSTS_DATABASE = "CREATE TABLE IF NOT EXISTS posts (id bigserial primary key, userId int, title text, content text, createdAt timestamptz DEFAULT now());";
export const ADD_USERID_FOREIGN_KEY = "ALTER TABLE posts ADD FOREIGN KEY (userId) REFERENCES users (id);"
export const CREATE_POSTS_OWNER_INDEX = "CREATE INDEX IF NOT EXISTS userId ON posts (userId);"
export const CREATE_POSTS_INDEX = "CREATE INDEX IF NOT EXISTS id ON posts (id);"

// create comments table
export const CREATE_COMMENTS_DATABASE = "CREATE TABLE IF NOT EXISTS comments (id bigserial primary key, postId int, content text, createdAt timestamptz DEFAULT now());";
export const ADD_POSTID_FOREIGN_KEY = "ALTER TABLE comments ADD FOREIGN KEY (postId) REFERENCES posts (id);"
export const CREATE_COMMENTS_OWNER_INDEX = "CREATE INDEX IF NOT EXISTS postId ON comments (postId);"
export const CREATE_COMMENTS_INDEX = "CREATE INDEX IF NOT EXISTS id ON comments (id);"

// db queries for user
export const CREATE_USER = "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *";
export const GET_USER = "SELECT * FROM users WHERE username = $1";
export const GET_USERS = "SELECT id, username FROM users ORDER BY id ASC";

// db queries for posts
export const CREATE_POST = "INSERT INTO posts (userId, title, content) VALUES ($1, $2, $3) RETURNING *";
export const GET_USER_POSTS = "SELECT * FROM posts WHERE userId = $1 ORDER BY id ASC";

// db queries for comments
export const CREATE_COMMENT = "INSERT INTO comments (postId, content) VALUES ($1, $2) RETURNING *";

// optimized db query for performance challenge
export const CHALLENGE_QUERY = "SELECT users.id, users.username, MAX(posts.title) AS latest_post_title, MAX(comments.content) AS latest_comment_content, COUNT(posts.id) AS post_count FROM users LEFT JOIN posts ON users.id = posts.userId LEFT JOIN (SELECT postId, MAX(createdat) AS max_createdAt FROM comments GROUP BY postId) latest_comments ON posts.id = latest_comments.postId LEFT JOIN comments ON latest_comments.postId = comments.postId AND latest_comments.max_createdAt = comments.createdat GROUP BY users.id, users.username ORDER BY post_count DESC LIMIT 3;"
// "SELECT users.id, users.username, posts.title, comments.content FROM users LEFT JOIN posts ON users.id = posts.userId LEFT JOIN comments ON posts.id = comments.postId WHERE comments.createdat = (SELECT MAX(createdAt) FROM comments WHERE postId = posts.id) ORDER BY (SELECT COUNT(posts.id) FROM posts WHERE posts.userId = users.id) DESC LIMIT 3;";
