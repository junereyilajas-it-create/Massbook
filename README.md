# MassBook - Parish Administration System

## Introduction

MassBook is a comprehensive parish administration system designed to help manage sacraments, mass schedules, event bookings, and parish announcements with peace and clarity. This modern web application provides both parishioners and administrators with an intuitive interface to streamline parish operations, from booking sacramental events to managing mass schedules and communicating important announcements.

Built with React, TypeScript, Express, and MySQL, MassBook offers a secure, scalable, and user-friendly solution for parishes of all sizes. The system supports multiple user roles, automated workflows, and special features like feast date handling to accommodate the unique needs of Catholic parish administration.

## Body

### Features

MassBook offers a comprehensive set of features designed to meet the needs of both parishioners and parish administrators.

#### User Features

- **Event Booking System**: A multi-step booking process for sacramental events including weddings, baptisms, funerals, and mass intentions. The system guides users through event selection, date and location selection, document requirements, and final review before submission.

- **Mass Schedule Viewer**: Users can view mass schedules in three different views - Today, Weekly, and Monthly. The monthly view includes a calendar grid showing all scheduled masses with easy navigation between months.

- **Personal Dashboard**: A personalized dashboard for each user that displays their booking requests with status tracking, parish announcements, and quick access to booking new events.

- **Secure Authentication**: A robust login and registration system with email validation and password management. Users can securely access their accounts and manage their bookings.

- **Announcement System**: Users can view parish announcements including general announcements and feast day notifications. Announcements are displayed in a dedicated section on the dashboard with color-coded borders for different types.

#### Admin Features

- **Admin Dashboard**: A comprehensive dashboard that provides an overview of parish operations, including pending approvals, quick actions, and priest assignments. The dashboard displays the current presiding priest and emergency contact information.

- **Mass Schedule Management**: Administrators can create, edit, and manage mass schedules. The system supports scheduling masses for different days and times with the ability to specify mass titles and descriptions.

- **Booking Approval Workflow**: Admins can review all booking requests, view detailed information about each request, and approve or decline them. The system tracks the status of each request (pending, approved, declined).

- **Announcement Management**: Through a modal interface, administrators can create new announcements with titles, messages, and types (general or feast/special event). Announcements can be created to inform parishioners about important events, schedule changes, or feast day celebrations.

- **Reports and Analytics**: The system provides reports on parish activities, booking statistics, and other relevant metrics to help administrators make informed decisions.

#### Special Features

- **Feast Date Support**: The system recognizes specific feast dates where wedding and baptism bookings are free. Currently supported feast dates include:
  - June 24 - St. John the Baptist
  - November 1 - All Saints Day
  - November 2 - All Souls Day
  - November 30 - St. Andrew
  - December 25 - Christmas

- **"To Be Announced" Scheduling**: When booking events for feast dates, the schedule displays "To be announced" with the feast name in parentheses, indicating that the exact timing will be determined later.

- **Document Requirements Tracking**: Each sacrament type has specific document requirements. The system tracks required documents such as baptismal certificates, marriage licenses, and seminar certificates, ensuring all necessary paperwork is collected.

- **Multi-step Booking Process**: The booking process is divided into 4 clear steps with validation at each stage:
  1. Event Selection - Choose the type of sacrament
  2. Date & Location - Select date, time, and venue
  3. Requirements - Upload required documents
  4. Review & Submit - Review all details before final submission

### Tech Stack

#### Frontend
- **React 18.3.1**: Modern UI framework for building interactive user interfaces
- **TypeScript 5.6.2**: Type-safe JavaScript for improved code quality and developer experience
- **React Router DOM 6.17.0**: Client-side routing for seamless navigation
- **Vite 5.4.1**: Fast build tool and development server
- **Lucide React 1.16.0**: Beautiful icon library for consistent UI elements

#### Backend
- **Express 4.18.3**: Fast and minimalist web framework for building RESTful APIs
- **MySQL2 3.3.5**: MySQL database driver with promise support
- **CORS 2.8.5**: Cross-origin resource sharing middleware
- **Dotenv 16.3.1**: Environment variable management for secure configuration

### Project Structure

```
MassBook/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── DailyGospelCard.tsx
│   │   ├── HeaderBar.tsx
│   │   ├── HeaderSearch.tsx
│   │   ├── MainLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TermsAndPrivacyModal.tsx
│   │   └── TopBar.tsx
│   ├── pages/              # Page components
│   │   ├── AdminDashboardPage.tsx
│   │   ├── AdminMassSchedulePage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── EventBookingStep1Page.tsx
│   │   ├── EventBookingStep2Page.tsx
│   │   ├── EventBookingStep3Page.tsx
│   │   ├── EventBookingStep4Page.tsx
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── MassSchedulePage.tsx
│   │   ├── PendingApprovalsPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── RequestDetailsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── SupportPage.tsx
│   ├── utils/              # Utility functions
│   │   ├── api.ts
│   │   ├── bookingStorage.ts
│   │   └── searchRecords.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── styles.css          # Global styles
├── server/
│   ├── db.js               # Database configuration and initialization
│   └── index.js            # Express server and API endpoints
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

### Setup Instructions

#### Prerequisites
- Node.js (v18 or higher)
- MySQL database
- npm or yarn

#### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MassBook
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory with the following variables:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=massbook
```

4. Set up the database:
The database tables will be automatically created when you start the server for the first time. The following tables are created:
- `users`: User accounts
- `event_types`: Event type definitions
- `events`: Event records
- `schedules`: Mass schedules
- `support_tickets`: Support ticket records
- `announcements`: Parish announcements

#### Running the Application

1. Start the development server (both frontend and backend):
```bash
npm start
```

Or run them separately:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

#### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### API Endpoints

#### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user

#### Bookings
- `GET /api/requests` - Get all booking requests
- `GET /api/requests/:id` - Get specific booking request
- `POST /api/bookings` - Create a new booking
- `PUT /api/requests/:id/approve` - Approve a booking request
- `PUT /api/requests/:id/decline` - Decline a booking request

#### Schedules
- `GET /api/schedules` - Get mass schedules
- `POST /api/schedules` - Create a new mass schedule

#### Announcements
- `GET /api/announcements` - Get active announcements
- `POST /api/announcements` - Create a new announcement
- `PUT /api/announcements/:id` - Update an announcement
- `DELETE /api/announcements/:id` - Delete an announcement

#### Appointments
- `GET /api/appointments` - Get appointments

### Database Schema

#### users
- `id` (INT, Primary Key, Auto Increment)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `phone` (VARCHAR)
- `password` (VARCHAR)
- `role` (VARCHAR, Default: 'user')

#### event_types
- `id` (INT, Primary Key, Auto Increment)
- `name` (VARCHAR)
- `description` (TEXT)

#### events
- `id` (INT, Primary Key, Auto Increment)
- `event_type_id` (INT, Foreign Key)
- `requester_name` (VARCHAR)
- `email` (VARCHAR)
- `contact_number` (VARCHAR)
- `event_date` (DATE)
- `start_time` (TIME)
- `end_time` (TIME)
- `notes` (TEXT)
- `status` (VARCHAR, Default: 'pending')

#### schedules
- `id` (INT, Primary Key, Auto Increment)
- `day` (VARCHAR)
- `time` (TIME)
- `title` (VARCHAR)
- `date` (DATE)

#### support_tickets
- `id` (INT, Primary Key, Auto Increment)
- `subject` (VARCHAR)
- `message` (TEXT)
- `status` (VARCHAR, Default: 'open')
- `created_at` (TIMESTAMP)

#### announcements
- `id` (INT, Primary Key, Auto Increment)
- `title` (VARCHAR)
- `message` (TEXT)
- `type` (VARCHAR, Default: 'general')
- `is_active` (BOOLEAN, Default: true)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Event Booking Process

The event booking process consists of 4 steps with validation at each stage:

1. **Step 1 - Event Selection**: Choose the event type (Wedding, Baptism, Funeral, Mass Intention)
2. **Step 2 - Date & Location**: Select date, time, and location. Feast dates are automatically detected and marked as "To be announced"
3. **Step 3 - Requirements**: Upload required documents specific to the sacrament type
4. **Step 4 - Review & Submit**: Review all details and submit the booking for approval

### User Roles

#### Regular User
- View mass schedules in Today, Weekly, or Monthly views
- Book sacramental events through the multi-step booking process
- View personal dashboard with booking status and announcements
- View parish announcements
- Submit support tickets for assistance

#### Admin
- View comprehensive admin dashboard with pending approvals
- Create and manage mass schedules
- Review, approve, or decline booking requests
- Create and manage parish announcements
- View reports and parish statistics
- Manage all parish activities and operations

## Conclusion

MassBook provides a complete solution for parish administration, combining modern web technologies with intuitive design to streamline sacramental booking, mass scheduling, and parish communication. The system's special features, such as feast date support and "to be announced" scheduling, demonstrate its attention to the unique needs of Catholic parish administration.

With its secure authentication, role-based access control, and comprehensive feature set, MassBook empowers parishes to efficiently manage their operations while providing parishioners with a user-friendly experience for booking sacraments and staying informed about parish activities.

The system is designed to be scalable and maintainable, with clear separation of concerns between frontend and backend components, comprehensive API documentation, and a well-structured database schema. Whether you're a small parish or a large diocese, MassBook can be customized to meet your specific needs.

### Support

For support or questions, please use the support page in the application or contact the parish administration directly.

### License

This project is private and confidential.

### Version

Current version: 0.0.0
