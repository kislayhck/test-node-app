---
agent: agent
---
You are working inside a new backend repository.

Your task is to generate a complete, production-ready Express.js backend application using MongoDB and Swagger.

====================================================
GOAL
====================================================
Build a small backend system with authentication, products, and order history APIs.
The project must be modular, secure, and documented using Swagger (OpenAPI 3.0).

====================================================
TECH STACK
====================================================
- Node.js (LTS)
- Express.js
- MongoDB with Mongoose
- JWT authentication (Bearer tokens)
- bcrypt for password hashing
- swagger-jsdoc + swagger-ui-express
- dotenv

====================================================
FOLDER STRUCTURE (STRICT)
====================================================
src/
 ├── app.js
 ├── server.js
 ├── config/
 │    ├── db.js
 │    └── swagger.js
 ├── routes/
 │    ├── auth.routes.js
 │    ├── product.routes.js
 │    └── order.routes.js
 ├── controllers/
 │    ├── auth.controller.js
 │    ├── product.controller.js
 │    └── order.controller.js
 ├── models/
 │    ├── user.model.js
 │    ├── product.model.js
 │    └── order.model.js
 ├── middleware/
 │    └── auth.middleware.js
 └── utils/
      └── token.util.js

====================================================
API REQUIREMENTS
====================================================

AUTH
- POST /api/auth/login
- Validate credentials stored in MongoDB
- Passwords must be hashed with bcrypt
- Generate JWT Bearer token (1 hour expiry)
- Token payload must include:
  - userId
  - email

PRODUCTS (Protected)
- GET /api/products
- Fetch all products from MongoDB
- Requires valid Bearer token

ORDERS (Protected)
- GET /api/orders
- Fetch order history for the authenticated user
- Use userId from decoded JWT

====================================================
SECURITY & MIDDLEWARE
====================================================
- Implement auth middleware:
  - Read Authorization header
  - Validate Bearer token
  - Attach decoded token to req.user
  - Return 401 if invalid or missing

====================================================
DATABASE DESIGN
====================================================
User:
- email (unique)
- password (hashed)

Product:
- name
- price

Order:
- user (ObjectId → User)
- products (ObjectId[] → Product)
- totalAmount

Use Mongoose schemas with timestamps.

====================================================
SWAGGER (MANDATORY)
====================================================
- Swagger UI must be available at /api-docs
- Use OpenAPI 3.0
- Document:
  - Auth API
  - Products API
  - Orders API
- Define:
  - BearerAuth security scheme
  - Request/response schemas
  - Proper HTTP status codes
- Protected endpoints must require BearerAuth

====================================================
ENVIRONMENT VARIABLES
====================================================
- PORT
- MONGO_URI
- JWT_SECRET

====================================================
CODING RULES
====================================================
- Use async/await only
- No hardcoded secrets
- Clean separation of concerns
- Meaningful variable and function names
- Centralized error handling
- Code must run without modification

====================================================
DELIVERABLE
====================================================
- Generate all required files with complete implementations
- Ensure MongoDB connection is established
- Ensure server starts successfully
- Swagger UI must load and allow API testing
- No frontend code

====================================================
IMPORTANT
====================================================
Do NOT generate partial snippets.
Do NOT skip files.
Do NOT assume existing code.
Everything must be implemented end-to-end.
