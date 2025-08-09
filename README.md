# Blog API

A RESTful API for managing blog posts with tags and image upload functionality built with Node.js, Express, MongoDB, and AWS S3.

## Features

- ✅ **Post Management**: CRUD operations for blog posts
- ✅ **Tag System**: Create and manage tags, attach multiple tags to posts
- ✅ **Image Upload**: Upload post images to AWS S3
- ✅ **Advanced Filtering**: Filter posts by title, tags, and other criteria
- ✅ **Search Functionality**: Search posts by keywords in title and description
- ✅ **Pagination**: Built-in pagination for all list endpoints
- ✅ **Sorting**: Sort posts by various fields
- ✅ **API Documentation**: Complete Swagger/OpenAPI documentation
- ✅ **Error Handling**: Comprehensive error handling and validation
- ✅ **Security**: Rate limiting, CORS, and security headers

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- AWS S3 bucket and credentials

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your configuration
   ```

4. **Configure Environment Variables**
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/blog-api
   
   # AWS S3 Configuration
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET_NAME=your-s3-bucket-name
   
   # JWT Configuration (for future use)
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
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
| POST | `/api/posts` | Create a new post (with optional image upload) |
| GET | `/api/posts/:id` | Get a specific post |
| PUT | `/api/posts/:id` | Update a post |
| DELETE | `/api/posts/:id` | Delete a post |
| GET | `/api/posts/search?q=keyword` | Search posts by keywords |
| GET | `/api/posts/by-tag/:tagId` | Get posts by tag |

## Usage Examples

### Creating a Tag

```bash
curl -X POST http://localhost:3000/api/tags \
  -H "Content-Type: application/json" \
  -d '{"name": "Technology"}'
```

### Creating a Post

```bash
curl -X POST http://localhost:3000/api/posts \
  -F "title=Getting Started with Node.js" \
  -F "desc=Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine..." \
  -F "tags=technology,programming" \
  -F "image=@/path/to/image.jpg"
```

### Getting Posts with Filtering

```bash
# Get posts with pagination
curl "http://localhost:3000/api/posts?page=1&limit=10&sort=-createdAt"

# Filter posts by title
curl "http://localhost:3000/api/posts?title=nodejs"

# Filter posts by tags
curl "http://localhost:3000/api/posts?tags=507f1f77bcf86cd799439011,507f1f77bcf86cd799439012"
```

### Searching Posts

```bash
curl "http://localhost:3000/api/posts/search?q=javascript&page=1&limit=5"
```

### Getting Posts by Tag

```bash
curl "http://localhost:3000/api/posts/by-tag/507f1f77bcf86cd799439011?page=1&limit=10"
```

## Query Parameters

### Posts Endpoint

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `sort` (string): Sort field and order (e.g., `title`, `-createdAt`, `updatedAt`)
- `title` (string): Filter by title (partial match)
- `tags` (string): Filter by tag IDs (comma-separated)

### Search Endpoint

- `q` (string, required): Search query
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

## Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

```json
{
  "success": false,
  "error": "Error message"
}
```

## File Upload

The API supports image uploads with the following specifications:

- **Supported formats**: JPEG, JPG, PNG, GIF, WebP
- **Maximum file size**: 5MB
- **Storage**: AWS S3
- **Access**: Public read access

## Database Schema

### Post Schema
```javascript
{
  title: String (required, max 200 chars),
  desc: String (required, max 5000 chars),
  image: String (optional, S3 URL),
  tags: [ObjectId] (references to Tag model),
  createdAt: Date,
  updatedAt: Date
}
```

### Tag Schema
```javascript
{
  name: String (required, unique, max 50 chars),
  createdAt: Date,
  updatedAt: Date
}
```

## Development

### Running Tests
```bash
npm test
```

### Code Structure
```
blog-api/
├── models/          # Database models
│   ├── Post.js
│   └── Tag.js
├── routes/          # API routes
│   ├── posts.js
│   └── tags.js
├── utils/           # Utility functions
│   └── s3Upload.js
├── server.js        # Main server file
├── package.json
└── README.md
```

## Deployment

### Environment Variables for Production

Make sure to set the following environment variables in your production environment:

- `NODE_ENV=production`
- `MONGODB_URI` (your production MongoDB connection string)
- `AWS_ACCESS_KEY_ID` (your AWS access key)
- `AWS_SECRET_ACCESS_KEY` (your AWS secret key)
- `AWS_REGION` (your AWS region)
- `AWS_S3_BUCKET_NAME` (your S3 bucket name)

### Deployment Platforms

This API can be deployed to various platforms:

- **Heroku**: Use the Procfile and set environment variables
- **Vercel**: Deploy as a Node.js function
- **AWS**: Use Elastic Beanstalk or EC2
- **DigitalOcean**: Use App Platform or Droplets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 