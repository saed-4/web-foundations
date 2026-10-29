# QuickNotes System Design

## Description

QuickNotes is a notes application project that demonstrates how a browser-based app can communicate with a REST API and how a real online notes service could be designed to support one million registered users.

The API client uses [JSONPlaceholder](https://jsonplaceholder.typicode.com/posts) to practise loading, creating, and deleting notes. JSONPlaceholder is a demonstration API, so changes are simulated rather than permanently stored.

The `docs/` directory contains the proposed API design, relational database model, and scalable system architecture for a future production backend.

## Features

- Load 10 notes from the API using GET.
- Create notes using POST.
- Delete notes using DELETE.
- Validate note titles and handle request errors.
- Display loading, success, error, and empty states.
- Document the backend API, database schema, and architecture.

## Project Structure

```text
quicknotes-system-design/
├── index.html
├── api.js
├── style.css
├── README.md
└── docs/
    ├── api-design.md
    ├── data-model.md
    └── architecture.md
```

## How to Run the API Client

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using the Live Server extension, or serve the folder through a local HTTP server.
4. Click **Load notes** to retrieve 10 notes.
5. Enter a title and optional body, then click **Create note**.
6. Click **Delete** beside a note to simulate deleting it.

An internet connection is required to access JSONPlaceholder.

### Important Limitation

JSONPlaceholder is a practice API. It returns simulated responses for POST and DELETE operations and does not permanently store newly created notes or remove existing server records. The client updates the displayed list to reflect successful simulated operations.

## Design Documents

- [API Design](docs/api-design.md) — endpoints, request and response examples, authentication, and error handling.
- [Data Model](docs/data-model.md) — entities, relationships, PostgreSQL table definitions, queries, and indexes.
- [Architecture](docs/architecture.md) — requirements, workload estimates, architecture diagram, request flows, and trade-offs.

## What I Learned

1. **REST API communication:** How GET, POST, and DELETE requests use HTTP methods, headers, JSON bodies, and response status codes.
2. **Asynchronous JavaScript:** How `async`, `await`, `try`, `catch`, and `finally` help manage network requests and errors.
3. **Input validation and safe rendering:** Why user input should be validated and inserted with `textContent` instead of unsafe HTML insertion.
4. **Relational database design:** How primary keys, foreign keys, indexes, and JOINs support consistent data storage and retrieval.
5. **System scalability:** How load balancers, caching, read replicas, queues, and redundant components help a service handle growth.
6. **Trade-offs in engineering:** How performance, consistency, reliability, and infrastructure cost influence architectural decisions.

## Future Improvements

- Build a real backend API with persistent PostgreSQL storage.
- Implement user authentication and authorization.
- Add automated tests for API operations.
- Add pagination, searching, and tag management.
- Deploy the application and backend using secure production infrastructure.
