# Genwin: Campus Matchmaker - Codebase Synopsis & Working Report

## 1. Main Motive & Core Working of the Website
**Genwin** is a premium, secure, and gamified "Campus Matchmaker" platform designed for college students. 
The core premise is to allow students to secretly choose three people they are interested in from their campus across an array of categories:
1. **Crush** (The one you dream about)
2. **Like** (Someone expecting a connection)
3. **Adore** (A secret admirer perhaps)

**How it Works:**
1. **Onboarding:** Students register with their Full Name, Email, Branch, and Year.
2. **Selection (Home Page):** Users search for their peers (excluding themselves) via a slick autocomplete text input and lock in their 3 choices. Once submitted, choices cannot be changed.
3. **The Waiting Room:** Since matches are not revealed immediately, users are placed in a "Waiting Room". This acts as a lobby containing a countdown timer to "Match Day/Reveal Time". To keep users engaged, the lobby features multiple mini-games (e.g., Destiny Wheel, Roast My Rizz, Love Tester, Red Flag Swiper, Vibe Polls) and an anonymous global live chat.
4. **The Reveal (Match Results):** Once the countdown hits zero and the reveal window opens, users can access the Results page. The matching algorithm checks for *mutuality* across any slots (e.g., if you picked them as "Crush" and they picked you as "Like", it's a match). Mutual matches are displayed with options to take the connection further.

---

## 2. Codebase Structure Overview
The application is structured as a full-stack JavaScript application using the MERN stack (MongoDB, Express, React, Node.js), separated into two main directories: `genwin-client` (Frontend) and `genwin-server` (Backend).

### 2.1 Frontend (`genwin-client`)
Built with **React (Vite), React Router, TailwindCSS, and Framer Motion**. It uses a dark, "glassmorphism", neon-themed UI.

**Key Directories & Files:**
- `src/App.jsx`: Main routing setup handling public, protected, and admin routes.
- `src/pages/`:
  - `LandingPage.jsx`: Hero section, stats, and feature highlights.
  - `Login.jsx` & `Register.jsx`: Authentication flows.
  - `Home.jsx`: The selection dashboard where users lock in their 3 choices using `AutocompleteInput`.
  - `WaitingRoom.jsx`: The lobby with the countdown timer, mini-games, and entry to the live chat.
  - `MatchResults.jsx`: The reveal screen with confetti animations and mutual match display.
  - `ChatPage.jsx`: The live anonymous global chat room.
  - `AdminDashboard.jsx` & `AdminLogin.jsx`: Admin panel for viewing matches, reading feedback, and moderating chat reports.
- `src/components/games/`: Interactive mini-game components (`DestinyWheel.jsx`, `NeonLoveTester.jsx`, `RedFlagSwiper.jsx`, `RoastMyRizz.jsx`, `VibePoll.jsx`, `DailyQuote.jsx`).
- `src/components/ui/`: Reusable stylized UI components (`Button.jsx`, `GlassCard.jsx`, `Input.jsx`, `PageWrapper.jsx`, `AuthLayout.jsx`).
- `src/config.js`: Centralized API URL configuration.
- `tailwind.config.js` & `index.css`: Custom neon theme definitions, animations (`float`, `blob`, `glow`), and glass panel utilities.

### 2.2 Backend (`genwin-server`)
Built with **Node.js, Express.js, MongoDB (Mongoose), and Socket.io**.

**Key Directories & Files:**
- `server.js`: Application entry point, Express setup, CORS, Rate Limiting, and Socket.io initialization.
- `routes/`:
  - `authRoutes.js`: User signup, login (JWT generation), and token verification.
  - `userRoutes.js`: User search functionality (for autocomplete) filtering out the requesting user.
  - `matchRoutes.js`: Submission of the 3 choices, match status (countdown calculation using timezone logic), and the final mutual matching algorithm (`/result`).
  - `chatRoutes.js`: Fetch chat history, report messages, and admin delete functionality.
  - `pollRoutes.js`: Fetch active vibe polls and register votes.
  - `adminRoutes.js`: Hardcoded admin login, fetching all user submissions, fetching reported chat messages.
  - `feedbackRoutes.js`: Handling user feedback submission.
- `models/`: Mongoose schemas (`User.js`, `Match.js`, `ChatMessage.js`, `Poll.js`). `ChatMessage` includes a TTL index to auto-delete messages after 24 hours.
- `socket/chatSocket.js`: WebSocket logic. Assigns users random anonymous names, handles message sending, enforces a 5-second cooldown, and applies a profanity filter (`leo-profanity`).
- `middleware/`: Authenticators (`authMiddleware.js`, `adminAuthMiddleware.js`).

---

## 3. Functionality & Features Deep-Dive

### A. Authentication & User Management
- **JWT-based Authentication:** Sessions last 7 days. Middleware protects API endpoints.
- **Search Restrictions:** The Autocomplete search restricts finding users to just names and branches (excluding the user themselves) to maintain privacy and prevent picking oneself.

### B. The Matching Engine
- **Submission:** Stores references to the selected users (`crushUserId`, `likeUserId`, `adoreUserId`). Duplicates are currently allowed in UI but can be restricted.
- **Timezone-aware locking:** Uses `date-fns-tz` to calculate exact reveal times (e.g., every Sunday at 8:00 PM).
- **Match Interleaving:** A match is confirmed if `User A` picks `User B` in *any* of the 3 categories AND `User B` picks `User A` in *any* of the 3 categories.

### C. The Gamified Waiting Room
To solve the "empty state" problem of waiting for a matchmaking reveal, a highly interactive lobby was designed.
- **Destiny Wheel:** Framer Motion animated spinning wheel with random romantic outcomes.
- **Neon Love Tester:** Aesthetic name-compatibility calculator using a deterministic string hash.
- **Red Flag Swiper:** Tinder-like swipeable cards holding fun behavioral "red flags", assigning a standards score.
- **Vibe Polls:** Live community polls updated optimistically.
- **Roast My Rizz:** Fake AI analysis dispensing humorous dating insults.

### D. Global Anonymous Chat
- **Anonymity System:** Users are dynamically assigned fun identities via `sessionStorage` (e.g., "Cosmic Panda #452").
- **Live Sync:** Instant message broadcasting via `Socket.io`.
- **Moderation:** 5-second rate limit, active profanity filter, self-destructing messages (24hr TTL in DB), and user reporting tools which feed into the Admin dashboard.

### E. Admin Dashboard
- **Match Overview:** Sort and filter all user submissions by branch to trace campus engagement.
- **Feedback Center:** Read and update the status (`pending`, `reviewed`, `resolved`) of bugs or complaints.
- **Moderator Controls:** View heavily reported anonymous chat messages and permanently delete them from the database.

---

## 4. Pending Features & Future Scope (What's left to add/improve)
Based on current codebase comments and missing implementations, here is what still needs to be refined or added:

1. **Enforce Match Locking Logic:** The backend `/api/match/result` route currently has the "reveal window" locking logic commented out (enabling users to see results early for testing). This needs to be uncommented for production.
2. **Duplicate Choice Prevention:** The backend validation preventing a single user from putting the same person in all 3 slots is currently commented out (`// DISABLED PER PRODUCT OWNER`). This policy needs a final decision.
3. **Screenshot Uploads for Feedback:** The `FeedbackForm.jsx` has a placeholder marked `📷 Screenshot Upload (Coming Soon)`. This would require setting up an image bucket (like AWS S3 or Cloudinary) and expanding the API.
4. **Chat Enhancements:**
   - **Direct Messaging (DMs):** The Match Results page has a "Copy ID" button meant to transition matched users into a private chat (`onClick={() => {/* Chat Logic */}}`), which is not yet implemented.
   - **Reply Threading:** The global chat has a basic `replyTo` system with UI support, but the backend doesn't hydrate the replied message content completely yet.
5. **Poll Management System:** The `VibePolls` only run off a single seeded document. An admin UI to create, rotate, and manage daily polls is missing (`More polls coming soon...`).
6. **Admin Route Hardcoding:** `adminRoutes.js` currently uses a hardcoded `ADMIN_EMAIL` and `ADMIN_PASSWORD`. This must be migrated to `.env` variables or a dedicated Admin DB schema before public launch.
