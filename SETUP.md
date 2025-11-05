# Collaborative Code Editor - Setup Guide

This guide will help you set up and run the Real-Time Collaborative Code Editor on your local machine.

## Prerequisites

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (optional - can use Docker)
- **Git** (for cloning the repository)

## Quick Start

### Option 1: Automated Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collaborative-code-editor
   ```

2. **Run the setup script**
   ```bash
   node setup.js
   ```

3. **Start MongoDB** (choose one):
   - **Docker**: `docker run -d -p 27017:27017 --name mongo mongo:6`
   - **Local**: Install MongoDB locally and start the service
   - **Docker Compose**: `docker-compose up -d mongo`

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Option 2: Manual Setup

1. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB** (see options above)

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Option 3: Docker Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collaborative-code-editor
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   Navigate to `http://localhost:3000`

## Project Structure

```
collaborative-code-editor/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context providers
│   │   ├── utils/         # Utility functions
│   │   ├── App.js         # Main app component
│   │   └── index.js       # React entry point
│   ├── package.json       # Client dependencies
│   └── tailwind.config.js # Tailwind CSS config
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── socket/           # Socket.IO handlers
│   └── index.js          # Server entry point
├── package.json          # Server dependencies
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
└── README.md            # Project documentation
```

## Features

### ✅ Implemented Features

- **Real-time Code Editing**: Multiple users can edit code simultaneously
- **Monaco Editor Integration**: Full-featured code editor with syntax highlighting
- **Room-based Collaboration**: Join unique sessions with room IDs
- **Live Cursor Tracking**: See where other users are typing
- **Chat System**: Real-time messaging between participants
- **User Presence**: See who's currently in the room
- **Language Support**: Multiple programming languages
- **Code Persistence**: Save and load code snippets
- **Modern UI**: Beautiful, responsive interface
- **WebSocket Communication**: Real-time bi-directional updates

### 🔧 Technical Features

- **Socket.IO**: Real-time communication
- **MongoDB**: Data persistence
- **Express.js**: RESTful API
- **React**: Modern UI framework
- **Tailwind CSS**: Utility-first styling
- **Monaco Editor**: VS Code-like editing experience

## API Endpoints

### Room Management
- `POST /api/code/room` - Create a new room
- `GET /api/code/room/:roomId` - Get room details
- `PUT /api/code/room/:roomId` - Update room
- `DELETE /api/code/room/:roomId` - Delete room
- `GET /api/code/rooms` - List public rooms

### Participants
- `POST /api/code/room/:roomId/participant` - Add participant
- `DELETE /api/code/room/:roomId/participant/:userId` - Remove participant

## Socket.IO Events

### Client to Server
- `join-room` - Join a room
- `leave-room` - Leave a room
- `code-change` - Code content changed
- `cursor-change` - Cursor position changed
- `chat-message` - Send chat message
- `typing` - Typing indicator
- `language-change` - Programming language changed

### Server to Client
- `room-joined` - Successfully joined room
- `code-updated` - Code content updated
- `cursor-updated` - Cursor position updated
- `user-joined` - New user joined
- `user-left` - User left the room
- `chat-message` - New chat message
- `user-typing` - User typing indicator

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/collaborative-editor

# Client Configuration
REACT_APP_SERVER_URL=http://localhost:5000
```

## Development

### Available Scripts

```bash
# Install all dependencies
npm run install-all

# Start development server (both client and server)
npm run dev

# Start server only
npm run server

# Start client only
npm run client

# Build for production
npm run build

# Start production server
npm start
```

### Development Workflow

1. **Start MongoDB** (if not using Docker)
2. **Run `npm run dev`** to start both client and server
3. **Open `http://localhost:3000`** in your browser
4. **Create a room** or join an existing one
5. **Share the room ID** with others to collaborate

## Deployment

### Production Build

```bash
# Build the client
npm run build

# Start the production server
npm start
```

### Docker Deployment

```bash
# Build and run with Docker
docker build -t collaborative-editor .
docker run -p 5000:5000 collaborative-editor

# Or use Docker Compose
docker-compose up --build
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`
   - Verify MongoDB is accessible on the specified port

2. **Socket.IO Connection Issues**
   - Check if the server is running on the correct port
   - Verify CORS settings in the server configuration
   - Ensure the client is connecting to the correct server URL

3. **Monaco Editor Not Loading**
   - Check browser console for errors
   - Ensure all client dependencies are installed
   - Verify the Monaco Editor package is properly imported

4. **Port Already in Use**
   - Change the port in `.env` file
   - Kill the process using the port: `lsof -ti:5000 | xargs kill -9`

### Performance Tips

- Use a modern browser for the best experience
- Close unnecessary browser tabs to free up memory
- Consider using a dedicated MongoDB instance for production
- Monitor WebSocket connections for memory leaks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Ensure all dependencies are properly installed
4. Verify your environment configuration

Happy coding! 🚀 