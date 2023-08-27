### vest-backend-dev

##### to run project 
      * docker compose up

##### here's the optimized SQL query
    SELECT users.id, users.name, MAX(posts.title) AS latest_post_title,
    MAX(comments.content) AS latest_comment_content, COUNT(posts.id) 
    AS post_count FROM users LEFT JOIN posts ON users.id = posts.userId LEFT JOIN 
    (SELECT postId, MAX(createdAt) AS max_createdAt
    FROM comments GROUP BY postId) latest_comments ON posts.id = latest_comments.postId LEFT JOIN
    comments ON latest_comments.postId = comments.postId 
    AND latest_comments.max_createdAt = comments.createdAt 
    GROUP BY users.id, users.name ORDER BY post_count DESC LIMIT 3;


##### to run tests
      * yarn run test

##### Note: project runs behind a proxy so it can be accessed directly on port 80 
