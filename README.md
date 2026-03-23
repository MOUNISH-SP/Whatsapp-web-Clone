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
- Local MongoDB running natively at `mongodb://127.0.0.1:27017/whatsapp-clone`

### 1) Backend Initialization
Navigate into the backend project directly and install strictly mapped dependencies:
```powershell
cd server
npm install
Copy-Item .env.example .env
npm run dev
```

### 2) Frontend Client Initialization
Start the Vite development web-server simultaneously:
```powershell
cd client
npm install
Copy-Item .env.example .env
npm run dev
```

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

## 🛡️ Architecture & Security
- **Group Logic:** Mapped via the User model with `isGroup` flags and `members` arrays, allowing seamless message broadcasting across participants.
- **Theme Engine:** Implemented via a global CSS Filter Invert Layer to dynamically shift colors while preserving media and icon fidelity.
- **Socket Routing:** Real-time `receive_message` emits directly via attaching `req.io` to the request during the `POST /api/messages` REST call.
- **Security:** Passwords are salted and uniformly hashed prior to DB persistence, guaranteeing safe environments natively.
