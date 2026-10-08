# QuickNotes Data Model

## Entities and Relationships

The database consists of four entities: `users`, `notes`, `tags`, and `note_tags`.

1. **users**: Stores user account details.
   - Columns: `id` (SERIAL, Primary Key), `username` (VARCHAR), `email` (VARCHAR), `created_at` (TIMESTAMP).
2. **notes**: Stores the content of the notes.
   - Columns: `id` (SERIAL, Primary Key), `user_id` (INT, Foreign Key), `title` (VARCHAR), `body` (TEXT), `created_at` (TIMESTAMP).
   - **Relationship (One-to-Many)**: A single user can have many notes, but each note belongs to exactly one user. This is enforced by the `user_id` foreign key referencing `users.id`.
3. **tags**: Stores unique labels for categorizing notes.
   - Columns: `id` (SERIAL, Primary Key), `name` (VARCHAR).
4. **note_tags**: A junction table used to resolve the relationship between notes and tags.
   - Columns: `note_id` (INT, Foreign Key), `tag_id` (INT, Foreign Key).
   - **Relationship (Many-to-Many)**: A single note can have multiple tags, and a single tag can be assigned to multiple notes. This many-to-many relationship is achieved through the `note_tags` junction table linking `notes.id` and `tags.id`.

## CREATE TABLE Statements

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE note_tags (
    note_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

## Example SQL Queries
1. Get all notes for a specific user:
```sql
   SELECT id, title, body, created_at 
   FROM notes 
   WHERE user_id = 1 
   ORDER BY created_at DESC;
```

2. Get a specific note and its associated tags (JOIN query):
```sql
   SELECT n.title, t.name AS tag_name
   FROM notes n
   JOIN note_tags nt ON n.id = nt.note_id
   JOIN tags t ON nt.tag_id = t.id
   WHERE n.id = 101;
```

3. Count the total number of notes per user:
```sql
   SELECT u.username, COUNT(n.id) AS note_count
   FROM users u
   LEFT JOIN notes n ON u.id = n.user_id
   GROUP BY u.username;
```

## Indexes
- Index Creation: CREATE INDEX idx_notes_user_id ON notes(user_id);
- Reason: This index optimizes the WHERE user_id = ? query, which is executed every time a user loads their dashboard. Without it, the database would perform a full table scan on the notes table, which would severely degrade read performance as the dataset grows to support 1 million users.

## SQL vs NoSQL Decision
I chose a Relational SQL database (PostgreSQL) over a NoSQL alternative because the QuickNotes data model relies heavily on strict relational integrity and structured queries. The entities (users, notes, tags) have well-defined one-to-many and many-to-many relationships that benefit greatly from foreign key constraints to prevent orphaned records. Furthermore, SQL natively supports the complex JOIN operations required to efficiently retrieve notes alongside their associated tags, making it the most robust and appropriate choice for this application.