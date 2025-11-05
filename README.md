# Real-Time Collaborative Code Editor

A full-stack web application enabling multiple users to write and edit code simultaneously in real-time, inspired by tools like Google Docs and VS Code.

## 🚀 Features

- **Real-time Collaboration**: Multiple users can edit code simultaneously
- **Room-based Sessions**: Join unique sessions with synchronized state
- **Monaco Editor Integration**: Syntax-highlighted, IDE-like coding experience
- **WebSocket Communication**: Bi-directional real-time updates
- **User Presence**: See who's currently editing
- **Code Persistence**: Save and load code snippets (MongoDB)
- **Modern UI**: Beautiful, responsive interface

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB** - Database (optional)
- **Mongoose** - ODM for MongoDB

### Frontend
- **React** - UI library
- **Monaco Editor** - Code editor component
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Styling

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collaborative-code-editor
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🎯 Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Create a new room or join an existing one using the room ID
3. Start coding! Changes will be synchronized in real-time
4. Share the room ID with others to collaborate

## 📁 Project Structure

```
collaborative-code-editor/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── utils/        # Utility functions
│   │   └── App.js        # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── socket/           # Socket.IO handlers
│   └── index.js          # Server entry point
├── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/collaborative-editor
NODE_ENV=development
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker (Optional)
```bash
docker build -t collaborative-editor .
docker run -p 5000:5000 collaborative-editor
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Monaco Editor for the excellent code editing experience
- Socket.IO for real-time communication
- React team for the amazing UI library 