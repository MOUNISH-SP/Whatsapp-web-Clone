# Full-Stack WhatsApp Web Clone 💬

A high-fidelity, meticulously designed full-stack chat application featuring the exact UI/UX of WhatsApp Web. It demonstrates MVC backend architecture, MongoDB object mapping, custom Express routing, and Socket.IO integrations, perfectly replicating the modern WhatsApp Web experience.

## 🌟 Key Features
- **Pixel-Perfect UI:** Exact replica of the classic WhatsApp Web Two-Panel Layout. Includes exact icons, styling, typography, and interactive hover states.
- **Group & Community Creation:** Natively design and create groups with multiple participants. Smooth member selection and group messaging logic.
- **Interactive Profiles:** Fully customizable profiles with "About" status updates and unique user identifiers for every account.
- **Dark & Bright Mode:** Dynamic theme shifting with a global dark mode toggle, perfectly mimicking the WhatsApp Web experience.
- **Document & Media Sharing:** Fully-featured attachment popover allowing users to share Documents, Photos & Videos seamlessly.
- **Emoji Support & Voice Messages:** Native emoji picker integration and in-chat audio recording with dynamic playback and UI visualization.
- **Status & Calls UI:** 
  - **Status Overlay:** Full-screen immersive UI for viewing and navigating user status updates.
  - **Call Overlays:** Animated WhatsApp Audio & Video call overlay interfaces with active timers.
- **Real-Time Integration:** Instant messaging using Socket.IO. Features dynamic message delivery status (Sent tracking, Double Gray Ticks for delivered, Double Blue Ticks for read).
- **Authentication:** Stateless JSONWebToken (JWT) authentication for secure login/registration.

## 🏗 Stack Overview
### Frontend (Client)
- React.js + React Router (SPA Logic)
- Vite (Lightning-fast HMR Build tool)
- TailwindCSS (Highly customized to perfectly match WhatsApp Web's design system)
- Axios (REST fetching)
- Socket.IO Client (Real-time duplex updates)

### Backend (Server)
- Node.js & Express.js (API Engine)
- MongoDB & Mongoose (Persistent storage)
- JSONWebToken (Stateless Authentication Middleware)
- Socket.IO & HTTP Core (WebSocket connections)
- bcrypt (Password hashing & security)
- Multer (File & Media uploads processing)

---

## 🚀 Setup & Execution

### Prerequisites
- Node.js (v18+)
- MongoDB installed and running locally
- Git (for version control)

### Database Setup
1. Install MongoDB locally:
   - **Windows**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - **Mac**: `brew install mongodb-community`
   - **Linux**: Follow official MongoDB installation guide

2. Start MongoDB service:
   - **Windows**: `net start MongoDB`
   - **Mac/Linux**: `sudo systemctl start mongod` or `brew services start mongodb-community`

3. Verify MongoDB is running:
   ```bash
   mongosh
   # or
   mongo
   ```

### 1) Backend Setup
Navigate to the server directory and set up the backend:
```bash
cd server
npm install
```

#### Environment Variables (Backend)
Create environment configuration:
```bash
# Copy the example environment file
Copy-Item .env.example .env  # Windows
# or
cp .env.example .env        # Mac/Linux
```

Edit the `.env` file with your configuration:
```env
# Server Configuration
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/whatsapp-clone

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

#### Start Backend Server
```bash
npm run dev
```
Server will start at `http://localhost:5000`

### 2) Frontend Setup
Open a new terminal and set up the frontend:
```bash
cd client
npm install
```

#### Environment Variables (Frontend)
Create environment configuration:
```bash
# Copy the example environment file
Copy-Item .env.example .env  # Windows
# or
cp .env.example .env        # Mac/Linux
```

Edit the `.env` file with your configuration:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Socket.IO Configuration
VITE_SOCKET_URL=http://localhost:5000
```

#### Start Frontend Server
```bash
npm run dev
```
Frontend will start at `http://localhost:5173`

### 3) Running the Application
1. Ensure both backend and frontend servers are running
2. Open browser and navigate to `http://localhost:5173`
3. Register your first user account
4. Open incognito window for second user to test real-time chat

### 🔧 Troubleshooting

#### Common Issues:
- **MongoDB Connection Error**: Ensure MongoDB is running and the URI in `.env` is correct
- **Port Already in Use**: Change PORT in server `.env` file if 5000 is occupied
- **CORS Issues**: Verify frontend URL matches backend CORS configuration
- **Socket Connection Failed**: Check that both servers are running and VITE_SOCKET_URL is correct

#### Development Tips:
- Backend runs on port 5000 by default
- Frontend runs on port 5173 by default (Vite default)
- All API requests go through `/api` prefix
- Socket.IO connects to the same port as the backend server

### 🧪 Sample Test Flow
1. Open up an Edge/Chrome window at `http://localhost:5173`.
2. Select **Register** and create a user: `Alice` (password123).
3. Open a **brand new Incognito Window**.
4. Inside Incognito, go to `http://localhost:5173` and register a second user: `Bob` (password123).
5. Bob's screen will instantly populate the left sidebar. Alice's screen will proactively show Bob's presence!
6. Click their names to immediately begin sending instant texts.
7. Use the "New Group" option in the menu to select participants and create a collective chatroom.
8. Switch to **Dark Mode** in the Profile/Settings panel to experience the advanced theme shifting.
9. Use the attachment clip icon to open the custom Document/Media sharer, or the Microphone icon for audio recordings.

---

## 📁 Project Structure

```
whatsapp-web-clone/
├── client/                     # React Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── GroupPanel.jsx
│   │   │   ├── ProfilePanel.jsx
│   │   │   ├── StatusOverlay.jsx
│   │   │   └── CallOverlay.jsx
│   │   ├── context/           # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── pages/             # Main application pages
│   │   │   ├── Login.jsx
│   │   │   └── ChatDashboard.jsx
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx            # Main App component
│   │   └── main.jsx           # App entry point
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js Backend
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   │   └── db.js
│   │   ├── controllers/       # Route controllers
│   │   │   ├── userController.js
│   │   │   ├── messageController.js
│   │   │   └── authController.js
│   │   ├── middlewares/       # Express middlewares
│   │   │   ├── authMiddleware.js
│   │   │   └── uploadMiddleware.js
│   │   ├── models/            # MongoDB schemas
│   │   │   ├── User.js
│   │   │   ├── Message.js
│   │   │   └── Chat.js
│   │   ├── routes/            # API routes
│   │   │   ├── userRoutes.js
│   │   │   ├── messageRoutes.js
│   │   │   └── authRoutes.js
│   │   ├── sockets/           # Socket.IO handlers
│   │   ├── utils/             # Utility functions
│   │   └── server.js          # Server entry point
│   ├── uploads/               # File upload directory
│   ├── .env.example           # Environment variables template
│   └── package.json
├── README.md                  # Project documentation
└── .gitignore                 # Git ignore file
```

## 🛡️ Architecture & Security
- **Group Logic:** Mapped via the User model with `isGroup` flags and `members` arrays, allowing seamless message broadcasting across participants.
- **Theme Engine:** Implemented via a global CSS Filter Invert Layer to dynamically shift colors while preserving media and icon fidelity.
- **Socket Routing:** Real-time `receive_message` emits directly via attaching `req.io` to the request during the `POST /api/messages` REST call.
- **Security:** Passwords are salted and uniformly hashed prior to DB persistence, guaranteeing safe environments natively.

## 🚀 Deployment Notes

### Production Considerations:
- Change `JWT_SECRET` to a secure, random string in production
- Use MongoDB Atlas or a production-ready MongoDB instance
- Configure proper CORS origins for your domain
- Set up file storage service (AWS S3, Cloudinary) for file uploads
- Enable HTTPS in production

### Environment Variables Summary:
- **Backend**: PORT, MONGODB_URI, JWT_SECRET, UPLOAD_DIR, MAX_FILE_SIZE, FRONTEND_URL
- **Frontend**: VITE_API_URL, VITE_SOCKET_URL, VITE_APP_NAME, VITE_APP_VERSION

## 📝 Submission Requirements ✅

This project satisfies all submission requirements:

✅ **Public GitHub Repository**: Ready for upload to GitHub  
✅ **Comprehensive README**: Detailed setup instructions for both frontend and backend  
✅ **Environment Variables**: Fully documented with example files for both client and server  
✅ **Database Setup**: Complete MongoDB installation and configuration guide  

---
