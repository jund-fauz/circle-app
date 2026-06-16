# 🔵 Circle App

A modern social networking application built with full-stack technologies. Connect with friends, share moments, and build meaningful communities in real-time.

**Live Demo:** [https://circle-app-eight.vercel.app](https://circle-app-eight.vercel.app)

## ✨ Features

- **Real-Time Messaging** - Chat with friends using WebSocket technology
- **User Authentication** - Secure sign-up and login with JWT
- **Social Feed** - Share posts and connect with other users
- **Image Upload** - Upload and share images with Cloudinary
- **User Profiles** - Customize your profile with bio and profile picture
- **Friend System** - Add and manage friends
- **Responsive Design** - Works seamlessly on all devices
- **Dark Mode Support** - Modern UI with theme switching
- **Redux State Management** - Efficient state handling

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or **npm** 9+
- **PostgreSQL** - Database for storing user and message data
- **Redis** - For caching and real-time features
- **Cloudinary Account** - For image storage
- **Environment Variables** - API keys and database URLs

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jund-fauz/circle-app.git
   cd circle-app
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env.local
   # Configure your environment variables
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.

### Building for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 🛠️ Tech Stack

### 🎨 Frontend
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![Radix UI](https://img.shields.io/badge/radix%20ui-161618.svg?style=for-the-badge&logo=radix-ui&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

### 🧠 Backend
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

### 🗄️ Database & Cache
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

### 📸 Storage & Real-Time
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

### 🎨 UI & Utilities
![Lucide React](https://img.shields.io/badge/Lucide%20React-FF6B6B?style=for-the-badge&logo=react&logoColor=white)
![Sonner](https://img.shields.io/badge/Sonner-000000?style=for-the-badge&logo=javascript&logoColor=white)
![date-fns](https://img.shields.io/badge/date--fns-770C53?style=for-the-badge&logo=javascript&logoColor=white)

### ⚙️ Build & Development
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

### 🚀 Deployment
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

## 📁 Project Structure

```
circle-app/
├── frontend/               # React + TypeScript + Vite
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── backend/                # Node.js + Express
│   ├── src/
│   │   ├── app.ts
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── models/
│   ├── prisma/
│   ├── package.json
│   └── tsconfig.json
└── README.md               # This file
```

## 🎯 Usage

1. **Sign Up** - Create your account with email and password
2. **Complete Profile** - Add profile picture and bio
3. **Discover Users** - Browse and add friends
4. **Create Posts** - Share your thoughts and images
5. **Real-Time Chat** - Message with friends instantly
6. **Engage** - Like, comment, and interact with posts

## 🔧 Available Scripts

### Frontend
| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

### Backend
| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with auto-reload |
| `npm run build` | Build for production |
| `npm test` | Run tests with Jest |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋 Support

If you have any questions or issues, please:
- Open an [Issue](https://github.com/jund-fauz/circle-app/issues)
- Check existing discussions
- Visit the live demo for examples

## 🔗 Links

- **Repository:** [jund-fauz/circle-app](https://github.com/jund-fauz/circle-app)
- **Live App:** [https://circle-app-eight.vercel.app](https://circle-app-eight.vercel.app)
- **Author:** [@jund-fauz](https://github.com/jund-fauz)

---

**Connect, share, and build communities! 🌐✨**
