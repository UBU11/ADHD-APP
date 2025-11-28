# Zanshin - ADHD-Friendly Task Management Dashboard

<div align="center">

![Zanshin Logo](public/sloth.svg)

**A vibrant, comic-themed productivity dashboard designed specifically for ADHD users**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.5-purple.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

</div>

---

## 🎯 Overview

Zanshin is a comprehensive task management dashboard that integrates with Google Calendar, Google Tasks and Google Classroom to provide a unified, ADHD-friendly interface for managing your daily activities. With its vibrant comic book UI and intelligent priority system, Zanshin helps you stay focused on what matters most.

## ✨ Features

### 📊 **Smart Priority Engine**
- Automatic task prioritization based on urgency
- Color-coded urgency levels (Critical, High, Medium, Low)
- Real-time countdown timers
- Overdue task highlighting

### 🔗 **Google Integration**
- **Google Calendar**: View and manage upcoming events
- **Google Tasks**: Complete tasks directly from the dashboard
- **Google Classroom**: Track assignments and course materials
- Automatic synchronization across all platforms

### 🎯 **Focus Mode**
- Distraction-free task completion interface
- Session timer tracking
- Zen mode for minimal distractions
- Task completion with celebration animations
- Skip functionality for flexible workflow

### 📚 **Classroom Management**
- View all active courses
- Track assignments with due dates
- Direct links to submit assignments in Google Classroom
- Course materials organization
- Score tracking system for completed assignments

### 📅 **Calendar View**
- Grouped events by date
- Visual indicators for today's events
- Past event filtering
- Responsive grid layout
- Location and time information

### 🏆 **Gamification**
- Point system for completed assignments
- Persistent score tracking (localStorage)
- Completed task counter
- Visual progress indicators

### 📱 **Fully Responsive**
- Mobile-first design
- Tablet and desktop optimized
- Touch-friendly interface
- Adaptive layouts and typography

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Cloud Project with OAuth 2.0 credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/UBU11/ADHD-APP.git
   cd ADHD-APP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
   ```

4. **Configure Google OAuth**
   
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - Google Calendar API
     - Google Tasks API
     - Google Classroom API
   - Create OAuth 2.0 credentials
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - Your production domain
   - Copy the Client ID to your `.env` file

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Google OAuth Scopes

The application requests the following permissions:

- `https://www.googleapis.com/auth/calendar.events` - Read and write calendar events
- `https://www.googleapis.com/auth/tasks` - Manage tasks
- `https://www.googleapis.com/auth/classroom.courses.readonly` - View courses
- `https://www.googleapis.com/auth/classroom.coursework.me.readonly` - View assignments
- `https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly` - View course materials

### Course Selection

On first login, you can select which courses to track in the Classroom view. This preference is saved in localStorage.

## 📖 Usage

### Dashboard
- View all prioritized tasks, events, and assignments in one place
- Click on tasks/events to enter Focus Mode
- Click "Submit" on assignments to open them in Google Classroom

### Focus Mode
- **Play/Pause**: Start or pause the session timer
- **Complete**: Mark task/event as done (syncs with Google)
- **Skip**: Move to the next item without completing
- **Zen Mode**: Toggle minimal distraction mode

### Classroom View
- Select courses to track
- View assignments with due dates and point values
- Mark assignments as complete to earn points
- Access course materials

### Calendar View
- See all upcoming events grouped by date
- Visual indicators for today's events
- Past events are clearly marked

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **GSAP** - Advanced animations

### State Management
- **Zustand** - Lightweight state management
- **localStorage** - Persistent storage

### APIs & Libraries
- **Google APIs** - Calendar, Tasks, Classroom integration
- **date-fns** - Date manipulation
- **Lucide React** - Icon library

## 📁 Project Structure

```
adhd/
├── public/
│   └── sloth.svg              # Logo
├── src/
│   ├── components/
│   │   ├── Layout.tsx         # Main layout with navigation
│   │   ├── Preloader.tsx      # Loading screen
│   │   └── NotificationManager.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── FocusMode.tsx      # Focus mode interface
│   │   ├── CalendarView.tsx   # Calendar page
│   │   ├── ClassroomView.tsx  # Classroom page
│   │   ├── Login.tsx          # Login page
│   │   └── Settings.tsx       # Settings page
│   ├── services/
│   │   └── googleApi.ts       # Google API integration
│   ├── store/
│   │   └── useAppStore.ts     # Zustand store
│   ├── utils/
│   │   └── priorityEngine.ts  # Task prioritization logic
│   ├── App.tsx                # Root component
│   ├── index.css              # Global styles
│   └── main.tsx               # Entry point
├── .env                       # Environment variables
├── .env.example               # Environment template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` to customize the comic theme colors:

```javascript
colors: {
  'comic-yellow': '#FFD93D',
  'comic-blue': '#6BCB77',
  'comic-red': '#FF6B6B',
  'comic-dark': '#2C3E50',
  'comic-paper': '#FFFEF7',
}
```

### Fonts

The project uses:
- **Bangers** - Comic-style headings
- **Inter** - Body text

## 🐛 Troubleshooting

### Events/Tasks Not Deleting

1. Logout from the app
2. Clear browser cache
3. Login again to get new OAuth permissions
4. Check browser console for error messages

### Score Not Persisting

- Ensure localStorage is enabled in your browser
- Check browser console for storage errors
- Try clearing localStorage and re-logging in

### Google API Errors

- Verify your Client ID is correct in `.env`
- Check that all required APIs are enabled in Google Cloud Console
- Ensure authorized origins are configured correctly

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Designed specifically for ADHD users
- Inspired by comic book aesthetics
- Built with modern web technologies

## 📧 Contact

Project Link: [https://github.com/UBU11/ADHD-APP](https://github.com/UBU11/ADHD-APP)

---

<div align="center">

**Made with ❤️ for the ADHD community**

</div>
