# OwnMon UI

<div align="center">

**A beautiful, modern dashboard for the OwnMon activity monitoring system**

[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?logo=vite)](https://vitejs.dev/)

</div>

---

## 🌟 Features

### Real-Time Activity Tracking
- **Live Dashboard** - Real-time updates via WebSocket for current activity, media playback, and statistics
- **Current Activity Monitor** - See what application you're currently using with live duration tracking
- **Media Playback Display** - View currently playing music/media with artist and album information

### Comprehensive Analytics
- **Activity Flow Timeline** - Visualize your daily activity with an interactive hourly timeline
- **Category Distribution** - See how your time is distributed across different activity categories
- **Trend Charts** - Analyze your productivity patterns over time (7, 14, or 30 days)
- **Top Applications** - Identify which applications you spend the most time on
- **Productivity Insights** - Get actionable insights like most active day and average session duration

### Advanced Session Management
- **Session History** - Browse through all your activity sessions with detailed information
- **Powerful Filtering** - Search by app name, filter by category, or select date ranges
- **Pagination Support** - Efficiently handle large datasets with load-more functionality
- **Idle Session Tracking** - Separate idle time from active sessions for accurate time tracking

### Beautiful UI/UX
- **Modern Dark Theme** - Eye-friendly dark mode with glassmorphism effects
- **Responsive Design** - Works seamlessly on desktop and tablet devices
- **Smooth Animations** - Polished transitions and micro-interactions
- **Color-Coded Categories** - Visual distinction between different activity types

### Multi-Page Navigation
- **Dashboard** - Overview of today's activity and quick stats
- **Analytics** - Deep dive into productivity trends and patterns
- **Sessions** - Detailed session history with filtering
- **Categories** - Manage activity categories and their properties
- **Settings** - Configure API connection and application preferences

---

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3.4
- **Charts**: Recharts
- **Routing**: React Router DOM 6.28
- **Icons**: Lucide React
- **Real-time**: WebSocket (native)
- **HTTP Client**: Fetch API (native)

---

## 📋 Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **OwnMon Backend** running on `http://127.0.0.1:13234` (or configurable host/port)

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ownmon-ui.git
cd ownmon-ui

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:5173
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview the production build
npm run preview
```

---

## ⚙️ Configuration

### API Connection

The dashboard connects to the OwnMon backend API and WebSocket. You can configure the connection in the **Settings** page:

1. Navigate to **Settings** → **API Connection**
2. Click **Edit** to open the configuration modal
3. Configure:
   - **Host**: Backend server hostname (default: `127.0.0.1`)
   - **Port**: Backend server port (default: `13234`)
   - **Use HTTPS/WSS**: Enable secure connections
   - **Verify TLS**: Validate SSL/TLS certificates (recommended)

### Database Configuration

The backend configuration settings are fetched from the database and displayed in the Settings page, including:
- Minimum session duration
- AFK threshold
- Window polling interval
- Session tracking preferences

---

## 📁 Project Structure

```
ownmon-ui/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ActivityFlowChart.tsx
│   │   ├── ActivityTimeline.tsx
│   │   ├── CategoryDistribution.tsx
│   │   ├── CurrentActivity.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Layout.tsx
│   │   ├── MediaPlayer.tsx
│   │   ├── SessionList.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatCard.tsx
│   │   ├── TopApps.tsx
│   │   └── TrendChart.tsx
│   ├── pages/               # Route pages
│   │   ├── AnalyticsPage.tsx
│   │   ├── CategoriesPage.tsx
│   │   ├── SessionsPage.tsx
│   │   └── SettingsPage.tsx
│   ├── services/            # API & WebSocket services
│   │   ├── api.ts
│   │   └── websocket.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── cn.ts
│   │   └── index.ts
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Application entry point
├── docs/
│   └── API.md               # Backend API documentation
├── public/                  # Static assets
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🎨 Design System

### Color Scheme
- **Primary**: Blue (`#3B82F6`)
- **Surface**: Dark gray with transparency
- **Border**: Light gray with low opacity
- **Text**: White/gray variants for hierarchy

### Components
- **Glass Cards**: Backdrop blur with semi-transparent backgrounds
- **Toggle Switches**: Custom animated checkboxes
- **Charts**: Color-coded based on activity categories
- **Tooltips**: Context-aware hover information

---

## 🔌 API Integration

The dashboard integrates with the OwnMon backend API. See [API.md](./docs/API.md) for complete endpoint documentation.

### Key Endpoints
- `GET /api/sessions` - Query activity sessions
- `GET /api/media` - Query media playback history
- `GET /api/stats` - Get real-time statistics
- `GET /api/stats/timeline` - Get historical trends
- `GET /api/categories` - Get activity categories
- `GET /api/config` - Get configuration settings
- `WS /ws` - WebSocket for real-time updates

---

## 🐛 Known Issues

- Settings persistence not yet implemented (changes reset on page reload)
- Export functionality is a placeholder
- Some configuration options are read-only

---

## 🗺️ Roadmap

- [ ] Settings persistence (localStorage/backend)
- [ ] Export sessions to CSV/JSON
- [ ] Custom date range picker
- [ ] Dark/light theme toggle
- [ ] Advanced filtering options
- [ ] Session editing capabilities
- [ ] Mobile responsive improvements
- [ ] Keyboard shortcuts

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Recharts** for beautiful chart components
- **Lucide** for clean, consistent icons
- **Tailwind CSS** for rapid UI development
- **React** ecosystem for powerful frontend capabilities

---

<div align="center">

**Built with ❤️ for productivity enthusiasts**

</div>
