# Sudoku Game (Web App)

A modern, interactive **Sudoku web application** built using **HTML, CSS, and JavaScript** with **Firebase Authentication** and **Firestore Leaderboard** integration.  
It lets players solve Sudoku puzzles of varying difficulty, track scores, and compete globally — all in a clean and responsive interface.

---

## Features

### Gameplay
- Three difficulty levels — **Easy**, **Medium**, and **Hard**
- **Randomized puzzles** each time (via rotation and flipping)
- Click-based number entry with **real-time tile selection**
- **Highlighting for selected numbers** for easy tracking
- Sudoku board dynamically generated in JavaScript

### Scoring System
- Scores are saved **only when the puzzle is fully completed**
- Each completion adds to your cumulative total score
- Works only when logged in — no anonymous saves

### Leaderboard
- Shows **Top 10 players** sorted by total score
- Displays each player's **name** (no email for privacy)
- Automatically updates after each valid score submission

### User Authentication
- Built with **Firebase Authentication**
- Supports **Signup & Login** using email and password
- Usernames are stored in Firestore and linked to scores
- Click on the user icon to **login or logout**
- Password visibility toggle (eye icon) for better UX

### Firebase Integration
- **Firestore** stores:
  - User profiles (`name`, `email`, `createdAt`)
  - Score records (`name`, `score`, `timestamp`)
- Secure and scalable with real-time updates

---

## Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | HTML, CSS, JavaScript |
| **Database** | Firebase Firestore |
| **Auth System** | Firebase Authentication |
| **Hosting (optional)** | Firebase Hosting / Netlify / Vercel |

---

## UI Highlights

- Clean and minimalist Sudoku board layout  
- Responsive across desktop and mobile  
- Pop-up overlays for **Leaderboard** and **Login/Signup**  
- Intuitive buttons and hover effects  

---

## Setup & Installation

### Clone this repository

git clone https://github.com/<your-username>/sudoku-game.git
cd sudoku-game
### Add your Firebase configuration

Open `main.js` (or the file containing Firebase setup) and replace:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

with your actual Firebase config from the Firebase console.

### Run the project

Just open `index.html` in your browser, or use a local server:

```bash
npx live-server
```

---

## How Scoring Works

* Every correct number adds to your completion rate.
* You can **submit** only when all cells are filled.
* Final score = percentage of correct answers.
* Your total score accumulates across multiple completed puzzles.

---

## Responsiveness

* Fully responsive across devices:

  * Mobile view automatically scales Sudoku grid and buttons
  * Login and leaderboard popups adapt for smaller screens

---

## Folder Structure

```
sudoku-game/
│
├── index.html           # Main HTML file
├── style.css            # All styles including responsive layout
├── main.js              # Game logic, Firebase setup, auth, leaderboard
├── /images              # Icons (user, logout, eye, leaderboard)
└── README.md            # Project documentation
```

---

## Author

**Bharathvaj V**
Computer Science Student — Karpaga Vinayaga College of Engineering & Technology  
Interests: Full-Stack Development, Flutter, and IoT-based Assistive Tech  
[Linkedin Profile](https://www.linkedin.com/in/bharathvaj-v)

---

## Future Enhancements

* Timer and best-time leaderboard
* Dark mode toggle
* Sound effects and animations
* Support for multiple puzzles per difficulty
* Offline play mode with local storage

---

## License

This project is licensed under the **MIT License** — feel free to use, modify, and share it.

---

### If you like this project...

Share your feedback!

```

---

Would you like me to add **Firebase setup instructions (console side)** in detail (creating project, enabling auth, Firestore collections)? That would make it a more beginner-friendly README for others who clone your repo.
```
