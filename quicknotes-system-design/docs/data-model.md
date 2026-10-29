# QuickNotes Data Model

## 1. Overview

QuickNotes uses a relational database to store users, notes, tags, and the relationships between notes and tags.

The database uses primary keys to identify records and foreign keys to maintain referential integrity.

## 2. Entities and Columns

### Users

| Column | Type | Constraints |
|---|---|---|
| user_id | BIGINT | Primary key, generated automatically |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| password_hash | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL, defaults to current time |

### Notes

| Column | Type | Constraints |
|---|---|---|
| note_id | BIGINT | Primary key, generated automatically |
| user_id | BIGINT | Foreign key referencing users |
| title | VARCHAR(100) | NOT NULL |
| body | TEXT | Nullable |
| created_at | TIMESTAMP | NOT NULL, defaults to current time |
| updated_at | TIMESTAMP | NOT NULL, defaults to current time |

### Tags

| Column | Type | Constraints |
|---|---|---|
| tag_id | BIGINT | Primary key, generated automatically |
| user_id | BIGINT | Foreign key referencing users |
| name | VARCHAR(50) | NOT NULL |

### Note_Tags

| Column | Type | Constraints |
|---|---|---|
| note_id | BIGINT | Primary key component and foreign key |
| tag_id | BIGINT | Primary key component and foreign key |

The combination of `note_id` and `tag_id` forms a composite primary key.

## 3. Relationships

- **Users to Notes — one-to-many:** One user can create many notes, but each note belongs to one user.
- **Users to Tags — one-to-many:** One user can create many tags, and each tag belongs to one user.
- **Notes to Tags — many-to-many:** A note can have multiple tags, and a tag can be attached to multiple notes. The `note_tags` junction table represents this relationship.

Foreign keys prevent notes, tags, and note-tag relationships from referencing nonexistent records. Deleting a user removes their notes and tags; deleting a note or tag removes its associated junction records.

## 4. SQL Table Definitions

The following statements use PostgreSQL syntax.


CREATE TABLE users (
    user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    note_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id)
        ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    tag_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id)
        ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    UNIQUE (user_id, name)
);

CREATE TABLE note_tags (
    note_id BIGINT NOT NULL REFERENCES notes(note_id)
        ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(tag_id)
        ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);


## 5. Indexes


CREATE INDEX idx_notes_user_created
ON notes (user_id, created_at DESC);


This index helps the API retrieve a user's notes in newest-first order without scanning every note in the database.

The unique constraint on `users.email` also creates an index that supports efficient email lookups during login.

## 6. Example SQL Queries

### Query 1: Retrieve a user's notes


SELECT note_id, title, body, created_at
FROM notes
WHERE user_id = 1
ORDER BY created_at DESC;

This retrieves notes belonging to user 1, newest first.

### Query 2: Create a note

INSERT INTO notes (user_id, title, body)
VALUES (1, 'Study SQL', 'Practise JOIN queries.')
RETURNING note_id, title, body, created_at;

The database generates the note ID and creation timestamp.

### Query 3: Retrieve notes with their tags (JOIN)

SELECT n.note_id, n.title, t.name AS tag_name
FROM notes AS n
JOIN note_tags AS nt ON n.note_id = nt.note_id
JOIN tags AS t ON nt.tag_id = t.tag_id
WHERE n.user_id = 1
ORDER BY n.note_id;


This joins the notes, junction, and tags tables to show which tags are attached to a user's notes.

### Query 4: Count notes for each user


SELECT u.user_id, u.name, COUNT(n.note_id) AS note_count
FROM users AS u
LEFT JOIN notes AS n ON u.user_id = n.user_id
GROUP BY u.user_id, u.name
ORDER BY note_count DESC;


The `LEFT JOIN` includes users who have not created any notes.

## 7. SQL vs NoSQL Decision

I would use PostgreSQL, a relational SQL database, for QuickNotes. The application has clearly related entities, including users, notes, and tags. Foreign keys and transactions help preserve data integrity, while JOINs make it straightforward to retrieve notes with their tags. PostgreSQL also supports indexes, constraints, and mature backup and replication options needed as the service grows to one million users. A NoSQL database could offer more flexible document structures, but that flexibility is less important here than relational integrity and predictable queries.
