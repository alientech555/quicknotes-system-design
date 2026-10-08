# QuickNotes API Design

## REST Endpoints

| Method | Path | Description | Success Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/notes` | List all notes for the authenticated user (supports pagination via query params like `?limit=10`) | 200 OK |
| `GET` | `/notes/:id` | Retrieve a specific note by its unique ID | 200 OK |
| `POST` | `/notes` | Create a new note for the authenticated user | 201 Created |
| `PUT` | `/notes/:id` | Update an existing note entirely (title and/or body) | 200 OK |
| `DELETE` | `/notes/:id` | Delete a specific note by its unique ID | 204 No Content |
| `GET` | `/users/:id/notes` | List all notes belonging to a specific user (Admin/Moderator access) | 200 OK |

---

## Request & Response Examples

### Create a Note (`POST /notes`)
**Request Body:**
```json
{
  "title": "System Design Review",
  "body": "Review the architecture diagram and database schema.",
  "userId": 1
}
```

**Response (201 Created):**
```json
{
  "id": 101,
  "title": "System Design Review",
  "body": "Review the architecture diagram and database schema.",
  "userId": 1,
  "createdAt": "2024-05-20T10:00:00Z"
}
```

### List Notes (GET /notes?limit=2)
**Response (200 OK):**
```json
[
  {
    "id": 101,
    "title": "System Design Review",
    "body": "Review the architecture diagram and database schema.",
    "userId": 1,
    "createdAt": "2024-05-20T10:00:00Z"
  },
  {
    "id": 102,
    "title": "Grocery List",
    "body": "Milk, Eggs, Bread",
    "userId": 1,
    "createdAt": "2024-05-20T11:30:00Z"
  }
]
```

## Error Status Codes & Example Body
- All errors return a standardized JSON body:
### Example Error Body:
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Human readable description of the error."
  }
}
```
### Error Status Codes:
1. 400 Bad Request: Invalid input (e.g., title exceeds 100 characters).
2. 401 Unauthorized: Missing or invalid authentication token.
3. 403 Forbidden: User attempts to modify/delete a note they do not own.
4. 404 Not Found: Requested note or user ID does not exist.
5. 500 Internal Server Error: Unexpected server failure or database outage.