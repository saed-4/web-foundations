
# Library Books REST API

Base URL: `/api/books`

## 1. List all books

- **Method:** GET
- **Path:** `/api/books`
- **Description:** Returns a list of all books.
- **Success status:** 200 OK

## 2. Get one book

- **Method:** GET
- **Path:** `/api/books/:id`
- **Description:** Returns the book with the specified ID.
- **Success status:** 200 OK

## 3. Create a book

- **Method:** POST
- **Path:** `/api/books`
- **Description:** Creates a new book.
- **Example request body:**

  
  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "publishedYear": 1958
  }
  
- **Success status:** 201 Created

## 4. Update a book

- **Method:** PUT
- **Path:** `/api/books/:id`
- **Description:** Updates an existing book.
- **Example request body:**


  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "publishedYear": 1959
  }


- **Success status:** 200 OK

## 5. Delete a book

- **Method:** DELETE
- **Path:** `/api/books/:id`
- **Description:** Deletes the book with the specified ID.
- **Success status:** 204 No Content

## 6. List books by author

- **Method:** GET
- **Path:** `/api/books?author=Chinua%20Achebe`
- **Description:** Returns books written by the specified author.
- **Success status:** 200 OK

## Error Codes

- **400 Bad Request:** The request contains invalid data, such as a missing book title when creating a book.
- **404 Not Found:** The requested book ID does not exist.
