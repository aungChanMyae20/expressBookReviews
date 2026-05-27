Book Review API (Express)

Quick start

- Install dependencies:

```bash
cd "D:/learning/corsera/expressBookReviews/final_project"
npm install
```

- Run server:

```bash
node index.js
```

API Endpoints

- GET / : list all books (response: JSON object of books keyed by ISBN)
- GET /isbn/:isbn : get book details by ISBN (response: book object)
- GET /author/:author : search books by author (response: array of matching books)
- GET /title/:title : search books by title (response: array of matching books)
- GET /review/:isbn : get all reviews for a book (response: object of username->review)

- POST /register : register a new user
  - Payload: {"username":"<name>", "password":"<pwd>"}
  - Responses: 201 created or 409 conflict

- POST /customer/login : login registered user
  - Payload: {"username":"<name>", "password":"<pwd>"}
  - Response: {"message":"User successfully logged in","token":"<JWT>"}

- PUT /customer/auth/review/:isbn : add or modify your review for a book (authenticated)
  - Headers: Authorization: Bearer <token>
  - Payload: {"review":"<text>"}
  - Response: {message, reviews}

- DELETE /customer/auth/review/:isbn : delete your review for a book (authenticated)
  - Headers: Authorization: Bearer <token>
  - Response: {message, reviews}

Notes

- The application uses `router/booksdb.js` as the in-memory data store for books and reviews.
- Reviews are stored per-username; users can only modify/delete their own reviews.

Example curl usage (POSIX shell)

```bash
# register
curl -s -X POST http://localhost:5000/register -H "Content-Type: application/json" -d '{"username":"userA","password":"passA"}'

# login and extract token
TOKEN=$(curl -s -X POST http://localhost:5000/customer/login -H "Content-Type: application/json" -d '{"username":"userA","password":"passA"}' | sed -E 's/.*"token":"([^\"]+)".*/\1/')

# add or update review
curl -s -X PUT http://localhost:5000/customer/auth/review/1 -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"review":"Great book"}'

# get reviews for a book
curl -s http://localhost:5000/review/1

# delete your review
curl -s -X DELETE http://localhost:5000/customer/auth/review/1 -H "Authorization: Bearer $TOKEN"
```

Files

- `index.js` — server entry and auth middleware
- `router/general.js` — public routes and registration
- `router/auth_users.js` — login and authenticated review routes
- `router/booksdb.js` — in-memory books DB
