# MassBook - Parish Administration System
## Technical Documentation

---

## Document Control

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | May 24, 2026 | Development Team | Initial release of MassBook technical documentation |

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [System Architecture](#system-architecture)
4. [User Guide](#user-guide)
5. [Technical Specifications](#technical-specifications)
6. [API Documentation](#api-documentation)
7. [Database Schema](#database-schema)
8. [Installation and Deployment](#installation-and-deployment)
9. [Maintenance and Support](#maintenance-and-support)

---

## Executive Summary

MassBook is a comprehensive parish administration system designed to streamline the management of sacramental events, mass schedules, and parish communications. The system provides a web-based platform that serves both parishioners and administrators, offering intuitive interfaces for booking sacraments, viewing schedules, and managing parish operations.

### Key Objectives

- Simplify the sacramental booking process for parishioners
- Provide administrators with efficient tools for managing parish operations
- Improve communication between the parish and its members
- Automate routine administrative tasks
- Ensure data security and user privacy

### Target Users

- **Parishioners**: Individuals seeking to book sacramental events, view mass schedules, and receive parish announcements
- **Parish Administrators**: Staff responsible for managing bookings, schedules, and parish communications
- **Priests**: Clergy members who preside over masses and sacraments

---

## System Overview

### Purpose

MassBook serves as a centralized platform for parish administration, replacing manual processes with a digital solution that improves efficiency, accuracy, and accessibility.

### Scope

The system encompasses the following functional areas:

1. **Sacramental Booking Management**
2. **Mass Schedule Administration**
3. **User Authentication and Authorization**
4. **Announcement and Communication System**
5. **Reporting and Analytics**

### System Capabilities

- Multi-step event booking with validation
- Real-time schedule viewing (daily, weekly, monthly)
- Role-based access control
- Automated approval workflows
- Feast date recognition and special pricing
- Document requirement tracking
- Secure data storage and transmission

---

## System Architecture

### Technology Stack

#### Frontend Architecture

- **Framework**: React 18.3.1
- **Language**: TypeScript 5.6.2
- **Routing**: React Router DOM 6.17.0
- **Build Tool**: Vite 5.4.1
- **UI Components**: Custom components with Lucide React icons

#### Backend Architecture

- **Server Framework**: Express 4.18.3
- **Database**: MySQL with MySQL2 driver 3.3.5
- **Security**: CORS 2.8.5
- **Environment Management**: Dotenv 16.3.1

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                            │
│  (React Frontend - TypeScript)                              │
│  - User Interface Components                                 │
│  - State Management                                         │
│  - Client-side Routing                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                          │
│  (Express Server - Node.js)                                  │
│  - API Endpoints                                            │
│  - Request Processing                                       │
│  - Business Logic                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
│  (MySQL Database)                                            │
│  - User Data                                                │
│  - Event Records                                            │
│  - Schedules                                                │
│  - Announcements                                            │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Registration/Login**: Client → API → Database
2. **Event Booking**: Client → API → Database → Email Notification
3. **Schedule Viewing**: Database → API → Client
4. **Approval Process**: Admin Client → API → Database → User Notification

---

## User Guide

### User Roles and Permissions

#### Regular User

**Permissions:**
- View mass schedules
- Create event booking requests
- View personal dashboard
- View parish announcements
- Submit support tickets

**Access Level:**
- Personal data only
- Public schedule information
- General announcements

#### Administrator

**Permissions:**
- All regular user permissions
- Manage mass schedules
- Approve/decline booking requests
- Create and manage announcements
- View reports and analytics
- Access all user data (as needed for administration)

**Access Level:**
- Full system access
- Administrative functions
- Management capabilities

### User Workflows

#### Event Booking Process

1. **Navigation**: User navigates to Event Booking from dashboard
2. **Step 1 - Event Selection**:
   - Select sacrament type (Wedding, Baptism, Funeral, Mass Intention)
   - Select variant (Normal/Special)
   - System displays relevant information
3. **Step 2 - Date and Location**:
   - Select date from calendar
   - Select time slot
   - Choose location
   - System detects feast dates automatically
4. **Step 3 - Document Requirements**:
   - Upload required documents
   - System validates document types
   - Progress tracking
5. **Step 4 - Review and Submit**:
   - Review all entered information
   - Confirm submission
   - Receive confirmation message

#### Mass Schedule Viewing

1. **Access**: Navigate to Mass Schedule page
2. **View Selection**: Choose Today, Weekly, or Monthly view
3. **Navigation**: Use arrow buttons to navigate months (in Monthly view)
4. **Information Display**: View mass times, locations, and presiding priests

#### Dashboard Usage

1. **Login**: Authenticate with email and password
2. **Dashboard View**: 
   - View personal welcome message
   - Check announcements section
   - Review booking requests with status
   - Access quick actions

### Administrator Workflows

#### Booking Approval Process

1. **Access Admin Dashboard**: Navigate to admin dashboard
2. **View Pending Approvals**: Review list of pending requests
3. **Review Details**: Click on request to view full details
4. **Decision**: Approve or decline request
5. **Notification**: System automatically notifies user

#### Announcement Creation

1. **Access Quick Actions**: Click "Create Announcement" in Quick Actions
2. **Modal Opens**: Announcement creation modal appears
3. **Enter Details**:
   - Title
   - Type (General/Feast)
   - Message
4. **Submit**: Click "Create Announcement" button
5. **Confirmation**: System confirms creation and closes modal

#### Schedule Management

1. **Access Schedule Page**: Navigate to Admin Mass Schedule
2. **View Current Schedule**: Review existing schedule
3. **Add/Edit Schedule**: Use interface to modify schedule
4. **Save Changes**: Commit changes to database

---

## Technical Specifications

### Frontend Specifications

#### Component Architecture

The frontend follows a component-based architecture with clear separation of concerns:

- **Layout Components**: MainLayout, HeaderBar, Sidebar
- **Page Components**: Individual page components for each route
- **UI Components**: Reusable components (TopBar, Modals, Cards)
- **Utility Components**: Helper functions and utilities

#### State Management

- React Hooks (useState, useEffect, useMemo, useRef)
- Local state for component-specific data
- localStorage for booking draft persistence
- API calls for server communication

#### Routing

- React Router DOM for client-side routing
- Protected routes for authenticated users
- Admin-only routes for administrative functions

### Backend Specifications

#### API Design

RESTful API architecture with the following principles:

- Resource-based URLs
- HTTP methods for operations (GET, POST, PUT, DELETE)
- JSON request/response format
- Standard HTTP status codes
- CORS enabled for cross-origin requests

#### Security Measures

- Password hashing (bcrypt)
- Environment variable configuration
- CORS policy configuration
- SQL injection prevention (parameterized queries)
- Input validation on both client and server

#### Error Handling

- Try-catch blocks for error capture
- Meaningful error messages
- Graceful degradation
- User-friendly error displays

### Performance Considerations

- Lazy loading of components
- Optimized database queries
- Efficient state updates
- Minimal re-renders
- Image optimization

---

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User

**Endpoint**: `POST /register`

**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string"
}
```

**Response**: 
- `201 Created`: User successfully registered
- `400 Bad Request`: Invalid input data
- `409 Conflict`: Email already exists

#### Login User

**Endpoint**: `POST /login`

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response**:
- `200 OK`: Login successful, returns user data
- `401 Unauthorized`: Invalid credentials

### Booking Endpoints

#### Get All Booking Requests

**Endpoint**: `GET /requests`

**Response**:
```json
[
  {
    "id": number,
    "title": "string",
    "type": "string",
    "requester_name": "string",
    "event_date": "string",
    "location": "string",
    "status": "string"
  }
]
```

#### Get Specific Booking Request

**Endpoint**: `GET /requests/:id`

**Response**:
```json
{
  "id": number,
  "title": "string",
  "type": "string",
  "requester_name": "string",
  "event_date": "string",
  "location": "string",
  "status": "string"
}
```

#### Create Booking

**Endpoint**: `POST /bookings`

**Request Body**:
```json
{
  "event_type_id": number,
  "requester_name": "string",
  "email": "string",
  "contact_number": "string",
  "event_date": "string",
  "start_time": "string",
  "end_time": "string",
  "notes": "string"
}
```

**Response**:
- `201 Created`: Booking successfully created
- `400 Bad Request`: Invalid input data

#### Approve Booking Request

**Endpoint**: `PUT /requests/:id/approve`

**Response**:
- `200 OK`: Booking approved
- `404 Not Found`: Booking not found

#### Decline Booking Request

**Endpoint**: `PUT /requests/:id/decline`

**Response**:
- `200 OK`: Booking declined
- `404 Not Found`: Booking not found

### Schedule Endpoints

#### Get Mass Schedules

**Endpoint**: `GET /schedules`

**Response**:
```json
[
  {
    "id": number,
    "day": "string",
    "time": "string",
    "title": "string",
    "date": "string"
  }
]
```

#### Create Mass Schedule

**Endpoint**: `POST /schedules`

**Request Body**:
```json
{
  "day": "string",
  "time": "string",
  "title": "string",
  "date": "string"
}
```

**Response**:
- `201 Created`: Schedule created
- `400 Bad Request`: Invalid input data

### Announcement Endpoints

#### Get Active Announcements

**Endpoint**: `GET /announcements`

**Response**:
```json
[
  {
    "id": number,
    "title": "string",
    "message": "string",
    "type": "string",
    "is_active": boolean,
    "created_at": "string",
    "updated_at": "string"
  }
]
```

#### Create Announcement

**Endpoint**: `POST /announcements`

**Request Body**:
```json
{
  "title": "string",
  "message": "string",
  "type": "string"
}
```

**Response**:
- `201 Created`: Announcement created
- `400 Bad Request`: Invalid input data

#### Update Announcement

**Endpoint**: `PUT /announcements/:id`

**Request Body**:
```json
{
  "title": "string",
  "message": "string",
  "type": "string",
  "is_active": boolean
}
```

**Response**:
- `200 OK`: Announcement updated
- `404 Not Found`: Announcement not found

#### Delete Announcement

**Endpoint**: `DELETE /announcements/:id`

**Response**:
- `200 OK`: Announcement deleted
- `404 Not Found`: Announcement not found

### Appointment Endpoints

#### Get Appointments

**Endpoint**: `GET /appointments`

**Response**:
```json
[
  {
    "id": number,
    "day": "string",
    "time": "string",
    "title": "string"
  }
]
```

---

## Database Schema

### Database: massbook

### Table: users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| name | VARCHAR(255) | NOT NULL | User's full name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| phone | VARCHAR(20) | | User's phone number |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| role | VARCHAR(20) | DEFAULT 'user' | User role (user/admin) |

### Table: event_types

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Event type identifier |
| name | VARCHAR(100) | NOT NULL | Event type name |
| description | TEXT | | Event type description |

### Table: events

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Event identifier |
| event_type_id | INT | FOREIGN KEY (event_types.id) | Reference to event type |
| requester_name | VARCHAR(255) | NOT NULL | Name of requester |
| email | VARCHAR(255) | NOT NULL | Requester's email |
| contact_number | VARCHAR(20) | | Contact phone number |
| event_date | DATE | | Scheduled event date |
| start_time | TIME | | Event start time |
| end_time | TIME | | Event end time |
| notes | TEXT | | Additional notes |
| status | VARCHAR(20) | DEFAULT 'pending' | Event status |

### Table: schedules

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Schedule identifier |
| day | VARCHAR(10) | NOT NULL | Day of week |
| time | TIME | NOT NULL | Mass time |
| title | VARCHAR(255) | | Mass title |
| date | DATE | | Specific date |

### Table: support_tickets

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Ticket identifier |
| subject | VARCHAR(255) | NOT NULL | Ticket subject |
| message | TEXT | NOT NULL | Ticket message |
| status | VARCHAR(20) | DEFAULT 'open' | Ticket status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### Table: announcements

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Announcement identifier |
| title | VARCHAR(255) | NOT NULL | Announcement title |
| message | TEXT | NOT NULL | Announcement message |
| type | VARCHAR(50) | DEFAULT 'general' | Announcement type |
| is_active | BOOLEAN | DEFAULT true | Active status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

---

## Installation and Deployment

### Prerequisites

- Node.js v18 or higher
- MySQL 5.7 or higher
- npm or yarn package manager
- Git (for cloning repository)

### Development Environment Setup

#### 1. Clone Repository

```bash
git clone <repository-url>
cd MassBook
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=massbook
```

#### 4. Database Setup

The database tables will be automatically created on first server startup. Ensure MySQL is running and the specified database exists.

#### 5. Start Development Server

```bash
npm start
```

This starts both the frontend (port 5173) and backend (port 3000) servers.

### Production Deployment

#### Build Frontend

```bash
npm run build
```

This creates optimized production files in the `dist/` directory.

#### Backend Deployment

1. Set production environment variables
2. Install production dependencies
3. Start backend server:

```bash
npm run server
```

#### Deployment Considerations

- Use process manager (PM2) for backend
- Configure reverse proxy (nginx) for frontend
- Enable HTTPS for production
- Set up database backups
- Configure logging and monitoring

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| DB_HOST | Database host | Yes | localhost |
| DB_PORT | Database port | Yes | 3306 |
| DB_USER | Database username | Yes | - |
| DB_PASSWORD | Database password | Yes | - |
| DB_NAME | Database name | Yes | massbook |

---

## Maintenance and Support

### System Maintenance

#### Regular Tasks

- Database backups (daily)
- Log file rotation (weekly)
- Security updates (monthly)
- Performance monitoring (continuous)

#### Database Maintenance

- Index optimization
- Query performance analysis
- Data cleanup
- Archive old records

### Troubleshooting

#### Common Issues

**Server won't start**
- Check if port 3000 is available
- Verify database connection
- Review environment variables

**Database connection errors**
- Verify MySQL is running
- Check database credentials
- Ensure database exists

**Frontend build errors**
- Clear node_modules and reinstall
- Check TypeScript configuration
- Verify all dependencies are installed

### Support Channels

- **Technical Support**: Contact development team
- **User Support**: Use in-app support page
- **Documentation**: Refer to this document

### System Updates

#### Update Procedure

1. Backup current database
2. Stop running services
3. Pull latest code
4. Install new dependencies
5. Run database migrations (if applicable)
6. Restart services
7. Verify functionality

### Security Considerations

- Regular security audits
- Keep dependencies updated
- Monitor for vulnerabilities
- Implement rate limiting
- Use HTTPS in production
- Regular password policy reviews

---

## Appendix

### Feast Dates Configuration

The system recognizes the following feast dates for special pricing:

| Date | Feast Name | Special Pricing |
|------|------------|-----------------|
| June 24 | St. John the Baptist | Free weddings/baptisms |
| November 1 | All Saints Day | Free weddings/baptisms |
| November 2 | All Souls Day | Free weddings/baptisms |
| November 30 | St. Andrew | Free weddings/baptisms |
| December 25 | Christmas | Free weddings/baptisms |

### Document Requirements by Sacrament

#### Wedding
- Baptismal Certificate
- Confirmation Certificate
- Birth Certificate (PSA)
- Marriage License
- CENOMAR
- Pre-Cana Seminar Certificate
- Wedding Banns
- Valid IDs

#### Baptism
- Child's Birth Certificate
- Parents' Marriage Certificate
- Baptismal Seminar Certificate
- Valid IDs of Parents
- Valid IDs of Godparents

#### Funeral
- Death Certificate
- Burial Permit
- Valid ID of Family Representative

#### Mass Intention
- Mass Intention Form
- Valid ID (optional)

### Glossary

- **Sacrament**: Religious ceremony regarded as a means of grace
- **Feast Day**: Religious celebration day
- **Parishioner**: Member of a parish
- **Presiding**: Leading a religious ceremony
- **CENOMAR**: Certificate of No Marriage

---

**Document End**

*This document is confidential and intended for authorized personnel only.*
