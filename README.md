# User Management Dashboard

A modern, responsive React application for user management with authentication, built with TypeScript and Tailwind CSS.

## 🌐 Live Demo

You can view the live version of the project here: [Live Demo](https://user-auth-crud.vercel.app/)

## 🚀 Features

- **User Authentication**
  - Login/Register with JWT tokens
  - Secure cookie-based session management
  - Password validation with security requirements

- **User Management**
  - View all users in a beautiful table
  - Add new users with form validation
  - Edit existing user information
  - Delete users with confirmation dialog

- **Modern UI/UX**
  - Responsive design that works on all devices
  - Beautiful gradients and animations
  - Real-time form validation
  - Toast notifications for user feedback
  - Loading states and error handling

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Controller
- **Styling**: Tailwind CSS
- **State Management**: React Context + useState
- **Authentication**: JWT tokens with cookie storage
- **HTTP Client**: Native Fetch API
- **Icons**: Heroicons (SVG)
- **Notifications**: React Toastify

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd user-management-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── UserActions.tsx  # Edit/Delete user buttons
│   ├── UserForm.tsx     # Add/Edit user modal
│   ├── UserTable.tsx    # Users display table
│   └── DeleteConfirmation.tsx # Delete confirmation modal
├── pages/               # Page components
│   ├── LoginPage.tsx    # Login form
│   ├── RegisterPage.tsx # Registration form
│   └── DashboardPage.tsx # Main dashboard
├── context/             # React Context
│   └── UserContext.tsx  # User data management
├── hooks/               # Custom React hooks
│   └── useAuth.ts       # Authentication logic
├── service/             # API services
│   └── apiService.ts    # HTTP requests
├── types/               # TypeScript definitions
│   ├── auth.ts          # Authentication types
│   └── user.ts          # User data types
├── utils/               # Utility functions
│   ├── cookies.ts       # Cookie management
│   └── toast.ts         # Notification utilities
└── App.tsx             # Main app component
```

## 🔐 Authentication Flow

1. **Registration**: Users create account with name, email, and password
2. **Login**: Users sign in with email and password
3. **Token Storage**: JWT token stored in secure HTTP-only cookies
4. **Protected Routes**: Dashboard requires valid authentication
5. **Auto-logout**: Token expiration and invalid token handling

## 📱 Form Validation

### Login/Register Forms
- **Email**: Valid email format, required field
- **Password**: 
  - Minimum 6 characters (Login)
  - Minimum 8 characters (Register)
  - Requires uppercase, lowercase, number, and special character
  - No leading/trailing spaces

### User Management Forms
- **Name**: Letters and spaces only, 2-50 characters
- **Email**: Valid email format, 100 character limit
- **Department**: Alphanumeric with spaces, hyphens, and ampersands

## 🎨 UI Components

### UserTable
- Responsive table with user information
- Action buttons for edit/delete operations
- Empty state with helpful message
- Professional styling with gradients

### UserForm
- Modal-based form for add/edit operations
- Real-time validation feedback
- Success/error states with icons
- Keyboard navigation support

### DeleteConfirmation
- Safety confirmation dialog
- User information preview
- Loading states during deletion

## 🔧 API Integration

The app integrates with a RESTful API for:
- User authentication (login/register)
- CRUD operations on user data
- Token validation and refresh

## 🚦 Error Handling

- **Form Errors**: Real-time validation with user-friendly messages
- **API Errors**: Graceful error handling with toast notifications
- **Network Errors**: Automatic retry and user feedback
- **Auth Errors**: Automatic logout on token expiration

## 📊 Performance Features

- Optimized re-renders with React Context
- Efficient form validation with React Hook Form
- Lazy loading ready component structure
- Minimal bundle size with tree-shaking

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔒 Security Features

- JWT token authentication
- Secure cookie storage
- Password strength validation
- XSS protection through React
- CSRF protection via same-site cookies

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Vatsal Patel

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Heroicons for the beautiful SVG icons
- React Hook Form for excellent form management

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
