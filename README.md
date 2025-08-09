# Blog API

A RESTful API for managing blog posts with tags and image upload functionality built with Node.js, Express, MongoDB, and AWS S3.


## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/simran1002/s3-post-tags-api.git
   cd blog-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm run dev

   ```

## API Documentation

Once the server is running, you can access the interactive API documentation at:
```
http://localhost:3000/api-docs
```

## API Endpoints

### Tags

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tags` | Get all tags with pagination |
| POST | `/api/tags` | Create a new tag |
| GET | `/api/tags/:id` | Get a specific tag |
| PUT | `/api/tags/:id` | Update a tag |
| DELETE | `/api/tags/:id` | Delete a tag |

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts with filtering, sorting, and pagination |
| POST | `/api/posts` | Create a new post (with image upload) |
| GET | `/api/posts/:id` | Get a specific post |
| PUT | `/api/posts/:id` | Update a post |
| DELETE | `/api/posts/:id` | Delete a post |
| GET | `/api/posts/search?q=keyword` | Search posts by keywords |
| GET | `/api/posts/by-tag/:tagId` | Get posts by tag |
