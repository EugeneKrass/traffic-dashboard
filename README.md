# Traffic Dashboard - Fullstack Web Application

A modern, responsive traffic analytics dashboard built with React, Redux, Firebase, and Tailwind CSS. This application demonstrates proficiency in fullstack development with real-time data management, authentication, and cloud deployment.

🔗 **Live Demo**: [https://traffic-dashboard-eugenek.web.app](https://traffic-dashboard-eugenek.web.app)

## 🚀 Features

### Core Functionality

- **📊 Interactive Dashboard**: Real-time traffic data visualization with charts and tables
- **🔐 Secure Authentication**: Firebase Authentication with email/password
- **📈 Data Visualization**: Dynamic charts with daily, weekly, and monthly views
- **🔍 Advanced Filtering**: Sort by date/visits, filter by date range
- **✏️ CRUD Operations**: Create, read, update, and delete traffic entries
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS

### Technical Highlights

- **State Management**: Redux Toolkit for scalable state management
- **Form Validation**: React Hook Form with custom validation rules
- **API Layer**: Separated API service layer for clean architecture
- **Error Handling**: Comprehensive error handling with user feedback
- **Code Organization**: Modular architecture with barrel exports
- **Performance**: Optimized rendering and data aggregation

## 🛠️ Tech Stack

### Frontend

- **React** (v18.2.0) - UI library
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling and validation
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend

- **Firebase Cloud Functions** - Serverless backend
- **Firebase Firestore** - NoSQL database
- **Firebase Authentication** - User management
- **Firebase Hosting** - Deployment

### Development Tools

- **Git & GitHub** - Version control
- **Firebase CLI** - Deployment and local development
- **ESLint** - Code quality

## 📁 Project Structure

```
traffic-dashboard/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Auth/          # Authentication components
│   │   │   ├── Dashboard/     # Dashboard components
│   │   │   └── UI/            # Common UI components
│   │   ├── redux/             # Redux store and slices
│   │   │   ├── slices/        # Auth and traffic slices
│   │   │   └── store.js       # Store configuration
│   │   ├── services/          # API and Firebase services
│   │   ├── utils/             # Constants and helpers
│   │   ├── App.js             # Main app component
│   │   └── index.js           # Entry point
│   └── package.json
├── functions/                   # Firebase Cloud Functions
│   ├── index.js                # API endpoints
│   └── package.json
├── firebase.json               # Firebase configuration
├── firestore.rules             # Security rules
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/EugeneKrass/traffic-dashboard.git
   cd traffic-dashboard
   ```

2. **Install dependencies**

   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install functions dependencies
   cd ../functions
   npm install
   ```

3. **Environment Setup**

   Create `.env` file in `frontend` directory:

   ```env
   REACT_APP_API_KEY=your-firebase-api-key
   REACT_APP_AUTH_DOMAIN=your-firebase-auth-domain
   REACT_APP_PROJECT_ID=your-firebase-project-id
   REACT_APP_STORAGE_BUCKET=your-firebase-storage-bucket
   REACT_APP_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   REACT_APP_APP_ID=your-firebase-app-id
   REACT_APP_API_URL=http://127.0.0.1:5001/your-project-id/us-central1/api
   ```

4. **Firebase Setup**
   ```bash
   firebase login
   firebase use your-project-id
   ```

### Running Locally

1. **Start Firebase Emulators**

   ```bash
   cd functions
   npm run serve
   ```

2. **Start React Development Server**

   ```bash
   cd frontend
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Emulator UI: http://localhost:4000

## 🌐 Deployment

### Deploy to Firebase

1. **Build the React app**

   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy everything**

   ```bash
   firebase deploy
   ```

   Or deploy specific services:

   ```bash
   firebase deploy --only functions
   firebase deploy --only hosting
   firebase deploy --only firestore:rules
   ```

## 📊 API Documentation

### Endpoints

All endpoints require Firebase Authentication token in the header:

```
Authorization: Bearer <firebase-id-token>
```

#### GET /api/traffic

Fetch all traffic entries

- Response: `200 OK` - Array of traffic entries

#### POST /api/traffic

Create new traffic entry

- Body: `{ date: "YYYY-MM-DD", visits: number }`
- Response: `201 Created` - Created entry with ID

#### PUT /api/traffic/:id

Update existing traffic entry

- Body: `{ date: "YYYY-MM-DD", visits: number }`
- Response: `200 OK` - Updated entry

#### DELETE /api/traffic/:id

Delete traffic entry

- Response: `204 No Content`

### Error Responses

- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Entry already exists
- `500 Internal Server Error` - Server error

## 🔒 Security

- **Authentication**: All routes protected with Firebase Auth
- **Authorization**: Role-based access control (viewer/editor)
- **Firestore Rules**: Secure database access rules
- **Input Validation**: Server-side validation for all inputs
- **CORS**: Configured for production environment

## 🧪 Testing

### Manual Testing Checklist

- [x] User registration and login
- [x] Data fetching and display
- [x] Create new entries
- [x] Edit existing entries
- [x] Delete entries
- [x] Date range filtering
- [x] Sorting functionality
- [x] View mode switching
- [x] Responsive design
- [x] Error handling

## 🎯 Performance Optimizations

- **Data Aggregation**: Efficient weekly/monthly data aggregation
- **Memoization**: Redux selectors for computed values
- **Lazy Loading**: Components loaded on demand
- **Debouncing**: Search and filter operations
- **Caching**: API responses cached in Redux

## 📈 Future Enhancements

- [ ] User profile management
- [ ] Export data to CSV/PDF
- [ ] Real-time updates with Firestore listeners
- [ ] Advanced analytics (trends, predictions)
- [ ] Multi-language support
- [ ] Dark mode
- [ ] PWA capabilities
- [ ] Automated testing suite

## 🤝 Architecture Decisions

### Why Redux?

- **Scalability**: Prepared for enterprise-level state management
- **Predictability**: Single source of truth for application state
- **DevTools**: Excellent debugging capabilities
- **Middleware**: Easy integration of async operations

### Why React Hook Form?

- **Performance**: Minimal re-renders
- **Developer Experience**: Simple API
- **Validation**: Built-in validation support
- **Size**: Lightweight library

### Why Modular Architecture?

- **Maintainability**: Easy to locate and update code
- **Reusability**: Components can be reused across projects
- **Testing**: Isolated components are easier to test
- **Team Collaboration**: Clear separation of concerns

## 👨‍💻 Author

**Eugene Krass**

- GitHub: [@EugeneKrass](https://github.com/EugeneKrass)

Built with ❤️ using React and Firebase
