# Genwin - College Matchmaking Platform 💘

Genwin is a fun matchmaking web application where users can secretly select their Crush, a Person they Like, and a Person they Adore. If there's a mutual match, it's revealed after a set delay!

## 🚀 Features
- **User Authentication**: Secure Signup/Login with JWT & Email/Username uniqueness.
- **Smart Matching**: Submit 3 names (Crush, Like, Adore). Matches are based on unique usernames.
- **Autocomplete**: Search for registered users while typing to ensure accuracy.
- **Delayed Results**: Results are locked for a specific period (default: 3 days) to build anticipation.
- **Waiting Room**: Interactive Waiting Room with a **FLAMES** mini-game while you wait.
- **Responsive UI**: Built with React + Tailwind CSS for a premium mobile-friendly experience.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd genwin
```

### 2. Backend Setup
```bash
cd genwin-server
npm install
```
Create a `.env` file in `genwin-server`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
REVEAL_DELAY_DAYS=3  # Set to 0 for instant results during testing
```
Start the server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd genwin-client
npm install
npm run dev
```

## 🧪 How to Test Matching
1. **Register User A** (`@alice`) and **User B** (`@bob`).
2. **User A** logs in and selects `@bob` as their "Crush".
3. **User B** logs in and selects `@alice` as their "Like".
4. **Wait**: The results will be locked for the duration specified in `REVEAL_DELAY_DAYS`.
   - *Tip: Set `REVEAL_DELAY_DAYS=0` in `.env` and restart backend to see results instantly.*
5. **Reveal**: Visit the Results page to see the match!

## 🌍 Deployment
- **Frontend**: Deploy on [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/).
- **Backend**: Deploy on [Render](https://render.com/) or [Railway](https://railway.app/).
- **Database**: Use [MongoDB Atlas](https://www.mongodb.com/atlas).

---
Made with ❤️ for fun!
