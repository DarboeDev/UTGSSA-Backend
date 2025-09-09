# UTG Science Student Association - Backend Server

Express.js backend server for the UTG Science Student Association website, providing API endpoints and data management services.

## 🚀 Features

- **RESTful API**: Complete CRUD operations for all content types
- **Authentication**: JWT-based admin authentication
- **File Upload**: Multer-based file handling for documents and images
- **Database**: MongoDB integration with Mongoose ODM
- **Validation**: Input validation and error handling
- **CORS**: Cross-origin resource sharing configuration
- **Security**: Rate limiting and security headers

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## 📦 Installation

1. **Navigate to the server directory**:

   ```bash
   cd ssa-website/utg-server
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Server will be running** on [http://localhost:5000](http://localhost:5000)

## 🗂️ Project Structure

```
utg-server/
├── src/
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js        # JWT authentication
│   │   └── upload.js      # File upload handling
│   ├── models/            # MongoDB models
│   │   ├── User.js        # Admin user model
│   │   ├── Leader.js      # Leader/executive model
│   │   ├── Event.js       # Events model
│   │   ├── News.js        # News articles model
│   │   ├── Blog.js        # Blog posts model
│   │   ├── Resource.js    # Resources/documents model
│   │   └── Contact.js     # Contact messages model
│   ├── routes/            # API route handlers
│   │   ├── auth.js        # Authentication routes
│   │   ├── leaders.js     # Leaders CRUD
│   │   ├── events.js      # Events CRUD
│   │   ├── news.js        # News CRUD
│   │   ├── blogs.js       # Blogs CRUD
│   │   └── resources.js   # Resources CRUD
│   ├── seed.js            # Database seeding script
│   ├── seedResources.js   # Resources seeding
│   └── server.js          # Main server file
├── uploads/               # File upload directory
│   ├── images/           # Uploaded images
│   └── resources/        # Uploaded documents
├── createAdmin.js         # Admin user creation script
├── checkAdmin.js          # Admin verification script
└── package.json
```

## 🛣️ API Endpoints

### Authentication

```http
POST /api/auth/login      # Admin login
POST /api/auth/logout     # Admin logout
GET  /api/auth/verify     # Verify token
```

### Leaders

```http
GET    /api/leaders       # Get all leaders
POST   /api/leaders       # Create new leader (Auth required)
PUT    /api/leaders/:id   # Update leader (Auth required)
DELETE /api/leaders/:id   # Delete leader (Auth required)
```

### Events

```http
GET    /api/events        # Get all events
POST   /api/events        # Create new event (Auth required)
PUT    /api/events/:id    # Update event (Auth required)
DELETE /api/events/:id    # Delete event (Auth required)
```

### News

```http
GET    /api/news          # Get all news articles
POST   /api/news          # Create news article (Auth required)
PUT    /api/news/:id      # Update news article (Auth required)
DELETE /api/news/:id      # Delete news article (Auth required)
```

### Blogs

```http
GET    /api/blogs         # Get all blog posts
POST   /api/blogs         # Create blog post (Auth required)
PUT    /api/blogs/:id     # Update blog post (Auth required)
DELETE /api/blogs/:id     # Delete blog post (Auth required)
```

### Resources

```http
GET    /api/resources     # Get all resources
POST   /api/resources     # Create resource (Auth required)
PUT    /api/resources/:id # Update resource (Auth required)
DELETE /api/resources/:id # Delete resource (Auth required)
```

### File Upload

```http
POST /api/upload/image    # Upload image file
POST /api/upload/document # Upload document file
```

## 🗄️ Database Models

### User Model

```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  role: String (default: 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

### Leader Model

```javascript
{
  name: String (required),
  position: String (required),
  bio: String,
  image: String,
  email: String,
  phone: String,
  socialMedia: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Event Model

```javascript
{
  title: String (required),
  description: String,
  date: Date (required),
  location: String,
  image: String,
  category: String,
  isUpcoming: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Resource Model

```javascript
{
  title: String (required),
  description: String,
  type: String (enum: ['pdf', 'document', 'link', 'video']),
  fileUrl: String (required),
  filePublicId: String,
  department: String (required),
  year: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Scripts

```bash
# Start production server
npm start

# Start development server with nodemon
npm run dev

# Create admin user
node createAdmin.js

# Check admin user exists
node checkAdmin.js

# Seed database with sample data
node src/seed.js

# Seed resources
node src/seedResources.js
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **CORS Configuration**: Controlled cross-origin requests
- **Rate Limiting**: Prevent abuse and spam
- **Input Validation**: Sanitize and validate all inputs
- **Security Headers**: Helmet.js for security headers

## 📝 Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-complex

# File Upload (Optional)
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

## 🚀 Deployment

### Production Setup

1. **Set environment variables**:

   ```bash
   export NODE_ENV=production
   export PORT=5000
   export MONGODB_URI=your-production-mongodb-uri
   export JWT_SECRET=your-production-jwt-secret
   ```

2. **Install PM2** (Process Manager):

   ```bash
   npm install -g pm2
   ```

3. **Start with PM2**:
   ```bash
   pm2 start src/server.js --name "ssa-backend"
   pm2 startup
   pm2 save
   ```

### Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔍 API Usage Examples

### Login

```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@utgsciencesa.gm",
  "password": "admin123456"
}
```

### Create Leader

```javascript
POST /api/leaders
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "John Doe",
  "position": "President",
  "bio": "Computer Science student...",
  "email": "john@example.com",
  "image": "https://example.com/image.jpg"
}
```

### Upload File

```javascript
POST /api/upload/image
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

// Form data with 'file' field containing the image
```

## 📊 Monitoring

- **Logs**: Application logs for debugging
- **Error Handling**: Comprehensive error responses
- **Health Check**: Basic server health endpoint
- **Database Connection**: MongoDB connection status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:

- **Email**: contact@utgsciencesa.gm
- **GitHub Issues**: Create an issue in the repository

---

**Note**: This backend server is designed to work with the UTG Science Student Association frontend application. Make sure both applications are properly configured to communicate with each other.
#   U T G S S A - B a c k e n d  
 