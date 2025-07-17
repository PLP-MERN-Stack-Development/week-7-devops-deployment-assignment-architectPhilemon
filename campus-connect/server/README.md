# Campus Connect Backend API

A comprehensive REST API for the Campus Connect platform, enabling university students to connect, collaborate, and engage with campus life.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Profile management, search, and statistics
- **Event Management**: Create, join, and manage campus events
- **Study Groups**: Form and manage collaborative study groups
- **Real-time Chat**: Direct messages and group chats
- **Resource Sharing**: Upload and share academic resources
- **Security**: Helmet.js, CORS, input validation, and rate limiting

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. Clone and navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up MongoDB:

**Option A: Local MongoDB**
```bash
# Install MongoDB locally (macOS with Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string and update MONGO_URI in .env

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## Database Configuration

### Local MongoDB
```env
MONGO_URI=mongodb://localhost:27017/campus_connect
```

### MongoDB Atlas (Cloud)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campus_connect?retryWrites=true&w=majority
```

### Database Features
- **Automatic Connection**: Connects on server startup
- **Connection Monitoring**: Logs connection status and errors
- **Graceful Shutdown**: Properly closes connections on app termination
- **Error Handling**: Comprehensive error handling for database operations
- **Indexes**: Optimized queries with proper indexing

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search` - Search users
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/achievements` - Get user achievements

### Events
- `GET /api/events` - Get all events (with filtering)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/join` - Join event
- `POST /api/events/:id/leave` - Leave event

### Study Groups
- `GET /api/study-groups` - Get all study groups
- `GET /api/study-groups/:id` - Get single study group
- `POST /api/study-groups` - Create study group
- `PUT /api/study-groups/:id` - Update study group
- `DELETE /api/study-groups/:id` - Delete study group
- `POST /api/study-groups/:id/join` - Join study group
- `POST /api/study-groups/:id/leave` - Leave study group
- `GET /api/study-groups/user/my-groups` - Get user's study groups

### Chat
- `GET /api/chat/rooms` - Get user's chat rooms
- `POST /api/chat/rooms/direct` - Create direct message room
- `POST /api/chat/rooms/group` - Create group chat room
- `GET /api/chat/rooms/:roomId/messages` - Get room messages
- `POST /api/chat/rooms/:roomId/messages` - Send message
- `PUT /api/chat/messages/:messageId` - Edit message
- `DELETE /api/chat/messages/:messageId` - Delete message

### Resources
- `GET /api/resources` - Get all resources (with filtering)
- `GET /api/resources/:id` - Get single resource
- `POST /api/resources` - Upload new resource
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource
- `POST /api/resources/:id/download` - Download resource
- `POST /api/resources/:id/rate` - Rate resource
- `GET /api/resources/user/my-uploads` - Get user's uploads
- `GET /api/resources/popular/trending` - Get popular resources

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "john.doe@university.edu",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "university": "State University",
  "major": "Computer Science",
  "year": "Junior"
}
```

### Create Event
```bash
POST /api/events
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "React Workshop",
  "description": "Learn React fundamentals and build your first app",
  "date": "2025-03-20T14:00:00Z",
  "location": "Computer Lab 101",
  "category": "workshop",
  "maxAttendees": 30
}
```

### Create Study Group
```bash
POST /api/study-groups
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Advanced Calculus Study Group",
  "subject": "Mathematics",
  "description": "Weekly sessions covering advanced calculus topics",
  "maxMembers": 8,
  "meetingSchedule": "Wednesdays 7:00 PM",
  "location": "Library Room 205"
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation using express-validator
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet.js**: Security headers and protection
- **Rate Limiting**: Prevent abuse and DoS attacks
- **Password Hashing**: bcrypt with salt rounds

## Database Schema

The application uses MongoDB with Mongoose ODM:
- **Users**: User profiles and authentication
- **Events**: Campus events and attendees
- **Study Groups**: Collaborative study sessions
- **Chat Rooms & Messages**: Real-time messaging
- **Resources**: Academic resource sharing
- **File Storage**: AWS S3, Google Cloud Storage, or local filesystem

## Development

### Available Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Project Structure
```
server/
├── app.js              # Main application file
├── config/             # Configuration files
│   └── database.js    # MongoDB connection setup
├── middleware/         # Custom middleware
│   ├── auth.js        # Authentication middleware
│   └── validation.js  # Validation middleware
├── models/            # Mongoose data models
│   ├── User.js       # User model
│   ├── Event.js      # Event model
│   ├── StudyGroup.js # Study group model
│   ├── ChatRoom.js   # Chat room model
│   ├── Message.js    # Message model
│   └── Resource.js   # Resource model
├── routes/            # API routes
│   ├── auth.js       # Authentication routes
│   ├── users.js      # User management routes
│   ├── events.js     # Event management routes
│   ├── studyGroups.js # Study group routes
│   ├── chat.js       # Chat functionality routes
│   └── resources.js  # Resource sharing routes
├── package.json      # Dependencies and scripts
├── .env.example     # Environment variables template
└── README.md        # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details