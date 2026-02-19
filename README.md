

# 🏢 EasyProperty

Property Management System (PMS)  
Built with **NestJS (Backend)** + **Next.js (Frontend)** + **MongoDB**

---

# 📦 Project Structure

```
EasyProperty/
 ├── backend/   # NestJS API
 ├── frontend/  # Next.js App (App Router)
 ├── .gitignore
 └── README.md
```

---

# 🚀 Tech Stack

- Backend: NestJS + Mongoose
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind
- Database: MongoDB (Atlas recommended)
- Auth: JWT

---

# 🖥️ Requirements

Please install the following before starting:

- Node.js **20 LTS**
- npm (comes with Node)
- MongoDB Atlas account (or local MongoDB)

Check your version:

```
node -v
npm -v
```

---

# 📥 1️⃣ Clone Repository

```
git clone <YOUR_REPO_URL>
cd EasyProperty
```

---

# ⚙️ 2️⃣ Backend Setup (NestJS)

Go to backend folder:

```
cd backend
```

Install dependencies:

```
npm install
```

Create `.env` file inside `backend/`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
PORT=3000
```

Run backend:

```
npm run start:dev
```

Backend will run on:

```
http://localhost:3000
```

---

# 🌐 3️⃣ Frontend Setup (Next.js)

Open new terminal:

```
cd frontend
```

Install dependencies:

```
npm install
```

Create `.env.local` inside `frontend/`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Run frontend:

```
npm run dev
```

Frontend will run on:

```
http://localhost:3001
```

(or 3000 if backend uses different port)

---

# 🔐 Environment Variables Summary

## backend/.env

```
MONGO_URI=
JWT_SECRET=
PORT=
```

## frontend/.env.local

```
NEXT_PUBLIC_API_URL=
```

⚠️ Never commit `.env` files to Git.

---

# 🌿 Git Workflow (Team)

We use:

- main → production
- develop → integration branch
- feature/<feature-name> → individual work

Example:

```
git checkout -b feature/auth
git add .
git commit -m "feat: add login system"
git push origin feature/auth
```

Then create Pull Request to `develop`.

---

# 🧪 Running Both Together

Option 1: Open 2 terminals  
Option 2: Use VSCode split terminal

Terminal 1:
```
cd backend
npm run start:dev
```

Terminal 2:
```
cd frontend
npm run dev
```

---

# 🛠️ Common Issues

### 1. MongoDB Connection Error
- Check your MONGO_URI
- Make sure Atlas IP whitelist includes your IP

### 2. CORS Error
Make sure backend has:

```
app.enableCors();
```

### 3. Port Already In Use
Change backend PORT in `.env`

---

# 📌 Development Rules

- Do NOT push `.env`
- Do NOT push `node_modules`
- Always create feature branch
- Pull latest develop before starting new feature

---

# 🚀 Deployment (Future)

- Frontend → Vercel
- Backend → Render / Railway
- Database → MongoDB Atlas

---

# 👨‍💻 Contributors

EasyProperty Team