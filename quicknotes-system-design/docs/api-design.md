# QuickNotes API Design

## 1. Overview

The QuickNotes API allows users to create, read, update, and delete notes. Users must be authenticated to access their private notes.

The API follows REST principles and uses JSON for request and response bodies. It uses HTTPS for secure communication.

**Base URL:** `https://api.quicknotes.example.com/v1`

**Authentication:** Bearer token in the `Authorization` header.

**Content type:** `application/json`

## 2. REST Endpoints

| Method | Path | Description | Success status |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | 201 Created |
| POST | `/auth/login` | Authenticate a user | 200 OK |
| GET | `/notes` | List the authenticated user's notes | 200 OK |
| GET | `/notes/{id}` | Retrieve one note by ID | 200 OK |
| POST | `/notes` | Create a new note | 201 Created |
| PATCH | `/notes/{id}` | Update an existing note | 200 OK |
| DELETE | `/notes/{id}` | Delete an existing note | 204 No Content |
| GET | `/tags` | List the user's tags | 200 OK |

All note operations are restricted to the authenticated user who owns the requested notes. Pagination is supported when listing notes.

## 3. Authentication

After a successful login, the API returns an access token. Clients send this token with protected requests.

Example request header:


Authorization: Bearer <access_token>


The server returns `401 Unauthorized` if the token is missing, invalid, or expired.

## 4. Create a Note

**Request**

`POST /v1/notes`

Headers:


Authorization: Bearer <access_token>
Content-Type: application/json

Request JSON:


{
  "title": "Study SQL",
  "body": "Practise SELECT and JOIN queries."
}


The title is required and must contain between 1 and 100 characters after trimming whitespace. The body is optional.

**Successful response — 201 Created**


{
  "id": 101,
  "user_id": 12,
  "title": "Study SQL",
  "body": "Practise SELECT and JOIN queries.",
  "created_at": "2026-10-29T09:00:00Z",
  "updated_at": "2026-10-29T09:00:00Z"
}


The server generates the note ID and timestamps. The client must not choose the owner ID; the server derives ownership from the authenticated user.

## 5. List Notes

**Request**

`GET /v1/notes?page=1&limit=10`

Headers:


Authorization: Bearer <access_token>


**Successful response — 200 OK**


{
  "data": [
    {
      "id": 101,
      "user_id": 12,
      "title": "Study SQL",
      "body": "Practise SELECT and JOIN queries.",
      "created_at": "2026-10-29T09:00:00Z",
      "updated_at": "2026-10-29T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "total_pages": 1
  }
}

The server returns only notes belonging to the authenticated user. Pagination prevents large collections from being returned in one response.

## 6. Retrieve, Update and Delete Notes

### Retrieve one note

`GET /v1/notes/{id}`

Returns `200 OK` and the note JSON when the note exists and belongs to the authenticated user.

### Update a note

`PATCH /v1/notes/{id}`

Request JSON:


{
  "title": "Revise SQL joins",
  "body": "Practise INNER JOIN and LEFT JOIN."
}

Returns `200 OK` and the updated note. Only supplied fields are changed.

### Delete a note

`DELETE /v1/notes/{id}`

Returns `204 No Content` when deletion succeeds. The response has no JSON body.

## 7. Error Status Codes

| Status | Meaning |   When it is used |
|
| 400 Bad Request | Invalid request | Missing title, invalid fields, or malformed JSON |
| 401 Unauthorized | Authentication required | Missing, invalid, or expired access token |
| 403 Forbidden | Action not permitted | Authenticated user lacks permission for an operation |
| 404 Not Found | Resource not found | Note or endpoint does not exist |
| 409 Conflict | Resource conflict | Duplicate email during registration |
| 422 Unprocessable Content | Validation failed | Request fields fail business validation |
| 429 Too Many Requests | Rate limit exceeded | Client sends too many requests |
| 500 Internal Server Error | Unexpected server error | Unexpected failure on the server |

The API must not expose database details, passwords, tokens, or internal stack traces in error responses.

## 8. Example Error Response

**Request:** `POST /v1/notes` with an empty title.

**Response:** `400 Bad Request`


{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields.",
    "details": [
      {
        "field": "title",
        "message": "Title is required and must not exceed 100 characters."
      }
    ],
    "request_id": "req_8f31ab"
  }
}


Error responses use a consistent structure so the front end can display helpful messages. The `request_id` allows developers to find the corresponding server logs.

## 9. Design Considerations

- **Security:** Use HTTPS, hashed passwords, short-lived access tokens, input validation, and authorization checks.
- **Privacy:** Users can access only their own notes and tags.
- **Performance:** Paginate list requests and index frequently queried columns.
- **Consistency:** Return appropriate HTTP status codes and a predictable JSON structure.
- **Reliability:** Log unexpected errors and assign request IDs for troubleshooting.
- **Versioning:** Use `/v1` so future API changes can be introduced without unexpectedly breaking existing clients.
