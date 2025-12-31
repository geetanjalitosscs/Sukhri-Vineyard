# Sukhri Vineyard ERP - Complete Features List

## 📋 Table of Contents
1. [Core System Features](#core-system-features)
2. [User Roles & Access Control](#user-roles--access-control)
3. [Authentication & Security](#authentication--security)
4. [Dashboard Features](#dashboard-features)
5. [IoT & Device Integration](#iot--device-integration)
6. [Attendance Management](#attendance-management)
7. [CO₂ Barrel Management](#co₂-barrel-management)
8. [Temperature & Weather Monitoring](#temperature--weather-monitoring)
9. [Inventory Management](#inventory-management)
10. [Vendor & Procurement Management](#vendor--procurement-management)
11. [Task Management](#task-management)
12. [Camera Monitoring](#camera-monitoring)
13. [AI Assistant (TOAI)](#ai-assistant-toai)
14. [Reports & Analytics](#reports--analytics)
15. [User Management](#user-management)
16. [Communication & Notifications](#communication--notifications)
17. [UI/UX Features](#uiux-features)
18. [Technical Features](#technical-features)

---

## Core System Features

### 1. Enterprise-Grade ERP System
- Complete vineyard operations management
- Web and Mobile-first platform
- Real-time data synchronization
- Centralized data management
- Scalable architecture

### 2. Role-Based Access Control (RBAC)
- Granular permission system
- Role-specific dashboards
- Protected routes and modules
- Dynamic navigation based on role
- Secure API endpoints

### 3. Multi-Role Support
- 9 distinct user roles
- Customized workflows per role
- Role-specific features and views
- Hierarchical access control

---

## User Roles & Access Control

### Owner (Super Admin)
- Full system access
- Purchase order approvals
- Aggregated dashboard view
- TOAI AI assistant access
- Reports and exports
- User management oversight
- System configuration access

### Administrator
- Master data management
- Device & camera mapping
- User & role creation (HR, GM, Staff, Cleaner, Caretaker, Gas Filler)
- System configuration
- Device registration (IoT, cameras, biometric)
- Threshold settings
- Camera mapping

### HR Manager
- Attendance management (biometric/face/QR)
- Staff list and profiles
- Leave management
- Attendance reports generation
- Salary inputs
- Staff performance tracking

### General Manager (GM)
- Operations control
- Temperature monitoring
- CO₂ compliance tracking
- Inventory alerts management
- Task assignment to staff
- Staff task status monitoring
- View user management (read-only, cannot create users)

### Staff Roles

#### Cleaner
- Cleaning tasks management
- Attendance via biometric/face/QR
- Task completion tracking
- Attendance history

#### Caretaker
- Vineyard care operations
- Temperature monitoring access
- Task management
- Attendance tracking

#### Gas Filler (CO₂ Manager)
- CO₂ barrel refills
- QR code scanning
- CO₂ fill checklist
- Refill history tracking

### Vendor
- Limited portal access
- Purchase order viewing
- Delivery status updates
- Invoice upload
- Dispatch management
- Application submission for posts
- View active requests/requirements

---

## Authentication & Security

### 1. Multiple Authentication Methods

#### Email/Password Login
- Available for: Owner, Admin, HR, GM, Vendor
- Standard email and password authentication
- Secure password validation
- Session management

#### Biometric Login
- Available for: Staff (Cleaner, Caretaker, Gas Filler)
- Fingerprint scanning via biometric devices
- Device sync required
- Secure biometric data handling

#### Face Recognition Login
- Available for: Staff
- Face recognition via camera devices
- Device sync required
- Advanced facial recognition technology

### 2. Security Features
- JWT (JSON Web Token) authentication
- Role-based authorization
- Protected API endpoints
- Secure data transmission
- Session management
- Password encryption

---

## Dashboard Features

### Owner Dashboard
- **KPI Cards**: Temperature, CO₂, Staff, Inventory, Vendors, Alerts
- **Live Temperature Graph**: Real-time vineyard temperature (7 AM - 10 PM)
- **CO₂ Barrel Compliance Table**: Status of all barrels
- **Attendance Summary**: Combined biometric + face + QR attendance
- **Low Stock Alerts**: Inventory threshold warnings
- **Purchase Order Approvals**: Approve/reject purchase requests
- **Vendor Overview**: Active vendors and orders
- **TOAI AI Assistant**: Integrated AI widget
- **Real-time Alerts**: Temperature breaches, missed CO₂ filling
- **Export Reports**: Daily / Weekly / Monthly reports

### Admin Dashboard
- **User Management**: Create and manage all user types
- **Device Registration**: IoT, cameras, biometric devices
- **System Configuration**: Global settings
- **Camera Mapping**: Assign cameras to zones
- **Threshold Settings**: Temperature and inventory limits
- **Device Status Monitoring**: Health of all connected devices

### HR Dashboard
- **Attendance by Method**: Biometric/face/QR breakdown
- **Staff List and Profiles**: Complete staff directory
- **Attendance Reports**: Detailed attendance analytics
- **Leave Management**: Leave requests and approvals
- **Salary Inputs**: Payroll data entry
- **Attendance Trends**: Historical data visualization

### GM Dashboard
- **Temperature Monitoring**: Live temperature tiles
- **CO₂ Compliance Tracking**: Barrel due list
- **Task Assignment**: Assign tasks to staff members
- **Inventory Alerts**: Low stock notifications
- **Staff Task Status**: Monitor task completion
- **User Management View**: Read-only access to user data

### Staff Dashboard
- **Assigned Tasks**: View and manage tasks
- **CO₂ Fill Checklist**: For Gas Filler role
- **Temperature Logs**: For Caretaker role
- **Attendance History**: Personal attendance records
- **Task Completion**: Mark tasks as complete

### Vendor Dashboard
- **Active Requests**: View all posted requirements
- **Purchase Orders**: View assigned orders
- **Application Status**: Track application submissions
- **Delivery Management**: Update delivery status
- **Invoice Management**: Upload and manage invoices

---

## IoT & Device Integration

### 1. Temperature Sensors
- **Device Options**:
  - Davis Vantage Pro2 (Industry Standard)
  - Netatmo Pro Weather Station (Mid-range)
  - ESP32 / Raspberry Pi (Custom IoT - Recommended)
- **Sensors**: DS18B20 / DHT22
- **Data Collection**: Minimum 7 times per day
- **Real-time Updates**: Live data streaming
- **Threshold Alerts**: Automatic notifications on breach

### 2. CO₂ Sensors
- **MH-Z19 CO₂ Sensor** (NDIR Technology)
- **Range**: 0–5000 ppm
- **Accuracy**: ±50 ppm + 5%
- **Resistant to alcohol vapors**
- **Mounting**: Near barrel bung (10–30 cm)
- **Validation**: Sensor validates CO₂ concentration after refill

### 3. Biometric Devices
- Fingerprint scanning devices
- Device registration and sync
- Attendance data collection
- Multi-device support

### 4. Face Recognition Devices
- Camera-based face recognition
- Device registration and sync
- Attendance data collection
- Real-time recognition

### 5. Camera Devices
- CCTV camera integration
- Live feed viewing
- Recorded footage access
- Zone-based camera mapping
- Staff activity monitoring

### 6. Device Management
- Device registration
- Device status monitoring
- Device mapping to locations
- Sync status tracking
- Health monitoring

---

## Attendance Management

### 1. Multi-Method Attendance
- **Biometric Attendance**: Fingerprint scanning
- **Face Recognition Attendance**: Camera-based recognition
- **QR Code Attendance**: Mobile QR scanning (fallback)

### 2. Attendance Features
- **Real-time Capture**: Instant attendance recording
- **Method Tracking**: Records which method was used
- **Location Tracking**: GPS-based location (optional)
- **Time Stamping**: Accurate entry/exit times
- **Late/Early Detection**: Automatic calculation

### 3. Attendance Reports
- **Daily Reports**: Day-wise attendance summary
- **Weekly Reports**: Weekly attendance trends
- **Monthly Reports**: Monthly attendance analytics
- **Method-wise Breakdown**: Attendance by method type
- **Staff-wise Reports**: Individual attendance history
- **Export Options**: PDF/Excel export

### 4. Leave Management
- **Leave Requests**: Staff can request leaves
- **Leave Approvals**: HR can approve/reject
- **Leave Balance**: Track available leave days
- **Leave History**: Complete leave records

### 5. Salary Integration
- **Salary Inputs**: HR can input salary data
- **Attendance-based Calculation**: Automatic salary calculation
- **Payroll Management**: Complete payroll system

---

## CO₂ Barrel Management

### 1. QR-Based Tracking
- **Unique QR Codes**: Each barrel has unique QR
- **QR Scanning**: Mobile app scanning
- **Barrel Identification**: Instant barrel details
- **Location Tracking**: Barrel location mapping

### 2. Refill Workflow
- **Auto-calculation**: System calculates refill due dates
- **Task Assignment**: CO₂ Manager receives tasks
- **QR Scanning**: Worker scans QR at barrel location
- **Refill Recording**: Quantity, time, status update
- **Sensor Validation**: Optional CO₂ sensor validation (ppm)

### 3. Compliance Tracking
- **Due Date Calculation**: Automatic next refill date
- **Compliance Status**: Real-time compliance tracking
- **Overdue Alerts**: Notifications for missed refills
- **Compliance Reports**: Detailed compliance analytics

### 4. Barrel History
- **Refill History**: Complete refill records
- **Sensor Reading History**: Historical CO₂ readings
- **Audit Trail**: Full audit and compliance ready
- **Performance Tracking**: Barrel performance metrics

### 5. Dashboard Integration
- **Owner View**: Overall compliance status
- **GM View**: Due list and alerts
- **Staff View**: Assigned refill tasks

---

## Temperature & Weather Monitoring

### 1. Real-time Monitoring
- **Live Temperature Graph**: 7 AM - 10 PM monitoring
- **Multiple Sensor Support**: Multiple vineyard locations
- **Data Visualization**: Interactive charts and graphs
- **Historical Data**: Temperature trends over time

### 2. Alert System
- **Threshold Breach Alerts**: Automatic notifications
- **Alert Recipients**: GM and Owner notifications
- **TOAI Integration**: AI highlights temperature issues
- **Real-time Updates**: Instant alert delivery

### 3. Data Collection
- **Minimum 7 Readings/Day**: Regular data collection
- **Timestamp Recording**: Accurate time tracking
- **Location Tagging**: Sensor location mapping
- **Data Storage**: Historical data retention

### 4. Weather Integration
- **Weather Station Support**: Professional weather stations
- **API Integration**: WeatherLink API, Netatmo API
- **Custom IoT Support**: ESP32/Raspberry Pi integration

---

## Inventory Management

### 1. Auto-Updates
- **CO₂ Usage Tracking**: Automatic inventory deduction
- **Cleaning Material Usage**: Auto-update on usage
- **Real-time Stock Levels**: Live inventory status

### 2. Threshold Management
- **Low Stock Alerts**: Automatic notifications
- **Threshold Configuration**: Customizable limits
- **Alert Recipients**: GM and Owner notifications

### 3. Purchase Workflow
- **Purchase Requests**: GM raises requests
- **Owner Approval**: Owner approves/rejects
- **Vendor Processing**: Vendor processes orders
- **Delivery Updates**: Inventory updated on delivery

### 4. Inventory Tracking
- **Item Management**: Add, edit, delete items
- **Stock Levels**: Real-time stock tracking
- **Usage History**: Complete usage records
- **Category Management**: Organize by categories

### 5. Reports
- **Stock Reports**: Current stock levels
- **Usage Reports**: Consumption analytics
- **Reorder Reports**: Items needing reorder
- **Historical Reports**: Usage trends over time

---

## Vendor & Procurement Management

### 1. Vendor Portal
- **Limited Access**: Role-based vendor access
- **Purchase Order Viewing**: View assigned orders
- **Delivery Status Updates**: Update delivery status
- **Invoice Upload**: Upload invoices
- **Dispatch Management**: Manage dispatches

### 2. Post/Request System
- **Create Posts**: Owner/HR/Admin/GM create requirements
- **Email Notifications**: Automatic email to all vendors
- **Post Details**: Title, description, requirements
- **Status Tracking**: Active, closed, pending status

### 3. Application System
- **Vendor Applications**: Vendors apply to posts
- **Offer Submission**: Vendors submit offers and quotes
- **Application Status**: Pending, accepted, rejected
- **Email Notifications**: Owner notified on application

### 4. Purchase Order Management
- **PO Creation**: Create purchase orders
- **PO Approval**: Owner approval workflow
- **PO Tracking**: Track order status
- **Delivery Management**: Update delivery status

### 5. Vendor Performance
- **Vendor Rating**: Star-based rating system
- **Order History**: Complete order records
- **Performance Logging**: Track vendor performance
- **Active/Inactive Status**: Vendor status management

### 6. Vendor Dashboard
- **Active Vendors**: View all active vendors
- **Open POs**: Track open purchase orders
- **Closed POs**: View completed orders
- **Total Orders**: Order statistics

---

## Task Management

### 1. Task Assignment
- **GM Assignment**: GM assigns tasks to staff
- **Task Types**: CO₂ refill, cleaning, maintenance
- **Priority Levels**: High, medium, low priority
- **Due Dates**: Task deadline management

### 2. Task Tracking
- **Task Status**: Pending, in-progress, completed
- **Staff Task View**: Staff see assigned tasks
- **Completion Tracking**: Mark tasks as complete
- **Task History**: Complete task records

### 3. Task Types
- **CO₂ Refill Tasks**: For Gas Filler role
- **Cleaning Tasks**: For Cleaner role
- **Maintenance Tasks**: For Caretaker role
- **Custom Tasks**: Flexible task creation

### 4. Notifications
- **Task Assignment Notifications**: Alert on new tasks
- **Due Date Reminders**: Reminder notifications
- **Completion Notifications**: Alert on completion

---

## Camera Monitoring

### 1. Live Monitoring
- **Live Feed Viewing**: Real-time camera feeds
- **Multiple Camera Support**: View multiple cameras
- **Zone-based Viewing**: Camera mapping to zones
- **Full-screen Mode**: Expanded viewing

### 2. Recorded Footage
- **Recorded Feed Access**: View past recordings
- **Time-based Search**: Search by time window
- **Staff-linked Footage**: Link footage to staff ID
- **Download Options**: Download recordings

### 3. Staff Accountability
- **Attendance Cross-check**: Verify attendance vs activity
- **Activity Monitoring**: Monitor staff activities
- **Zone Assignment**: Assign cameras to zones
- **Time Window Tracking**: Track activity time windows

### 4. Camera Management
- **Camera Registration**: Register new cameras
- **Camera Mapping**: Map to locations/zones
- **Camera Status**: Monitor camera health
- **Camera Configuration**: Configure camera settings

---

## AI Assistant (TOAI)

### 1. Real-time Data Analysis
- **ERP Data Reading**: Reads only ERP data (no manual entry)
- **Real-time Analysis**: Instant data processing
- **Intelligent Insights**: AI-powered insights
- **Alert Detection**: Automatic issue detection

### 2. Query Capabilities
- **Natural Language Queries**: Ask questions in plain language
- **Example Queries**:
  - "Today's temperature violations"
  - "Which staff missed attendance"
  - "Inventory to reorder this week"
  - "Which barrels need CO₂?"
  - "Any risk today?"
  - "Today's attendance status"

### 3. Response Features
- **Summary Generation**: Concise summaries
- **Alert Highlighting**: Important alerts highlighted
- **Insights Delivery**: Actionable insights
- **Data Visualization**: Charts and graphs in responses

### 4. Integration
- **Dashboard Widget**: Integrated TOAI widget
- **Dedicated Page**: Full-page AI assistant
- **Role-based Access**: Owner, HR, GM, Admin access
- **Context Awareness**: Understands user role and context

---

## Reports & Analytics

### 1. Report Types
- **Daily Reports**: Day-wise summaries
- **Weekly Reports**: Weekly analytics
- **Monthly Reports**: Monthly comprehensive reports
- **Custom Reports**: Date range selection

### 2. Report Categories
- **Attendance Reports**: Staff attendance analytics
- **Temperature Reports**: Temperature trends
- **CO₂ Compliance Reports**: Barrel compliance status
- **Inventory Reports**: Stock and usage reports
- **Vendor Reports**: Vendor performance reports
- **Task Reports**: Task completion reports

### 3. Export Options
- **PDF Export**: Download as PDF
- **Excel Export**: Download as Excel
- **Print Options**: Direct printing
- **Email Reports**: Send via email

### 4. Analytics Features
- **Data Visualization**: Charts and graphs
- **Trend Analysis**: Historical trends
- **Comparative Analysis**: Compare periods
- **KPI Tracking**: Key performance indicators

---

## User Management

### 1. User Creation
- **Role-based Creation**: Create users by role
- **Multiple Roles Supported**: HR, GM, Staff, Cleaner, Caretaker, Gas Filler
- **User Profiles**: Complete user information
- **Bulk Operations**: Create multiple users

### 2. User Management
- **Edit Users**: Update user information
- **Deactivate Users**: Disable user accounts
- **User Search**: Search and filter users
- **User Profiles**: View detailed profiles

### 3. Access Control
- **Role Assignment**: Assign roles to users
- **Permission Management**: Granular permissions
- **Access Logs**: Track user access
- **Security Management**: Password reset, etc.

### 4. User Views
- **Admin View**: Full user management
- **GM View**: Read-only user view
- **HR View**: Staff management focus
- **Owner View**: Complete oversight

---

## Communication & Notifications

### 1. Email Notifications
- **Vendor Post Notifications**: Email sent to all vendors when post created
- **Application Notifications**: Email sent to owner when vendor applies
- **File Upload Notifications**: Email sent on file upload (client name, email, file name, upload time)
- **Alert Notifications**: Temperature breaches, low stock, etc.

### 2. In-App Notifications
- **Real-time Alerts**: Instant in-app notifications
- **Task Notifications**: Task assignment alerts
- **Status Updates**: Order status, task status
- **System Notifications**: System-wide announcements

### 3. Notification Preferences
- **Email Preferences**: Configure email notifications
- **In-App Preferences**: Configure in-app notifications
- **Alert Thresholds**: Customize alert triggers

---

## UI/UX Features

### 1. Theme Support
- **Dark Mode**: Full dark theme support
- **Light Mode**: Clean light theme
- **Theme Toggle**: Easy theme switching
- **Persistent Theme**: Theme preference saved

### 2. Responsive Design
- **Desktop First**: Optimized for desktop
- **Mobile Adaptive**: Responsive mobile design
- **Tablet Support**: Tablet-optimized layouts
- **Cross-device Compatibility**: Works on all devices

### 3. Professional UI
- **Clean Design**: Modern, clean interface
- **Premium Look**: Professional appearance
- **Data-Dense**: Information-rich displays
- **Readable Layout**: Easy to read and navigate

### 4. Interactive Elements
- **Smooth Animations**: Hover effects and transitions
- **Interactive Charts**: Tooltips and legends
- **Dynamic Updates**: Real-time data updates
- **Loading States**: Smooth loading indicators

### 5. Navigation
- **Role-Based Sidebar**: Filtered by user role
- **Breadcrumbs**: Clear navigation path
- **Quick Actions**: Fast access to common tasks
- **Search Functionality**: Quick search features

---

## Technical Features

### 1. Frontend Technology
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **ShadCN UI**: High-quality component library
- **Recharts**: Data visualization library
- **Lucide Icons**: Modern icon library
- **Zustand**: Lightweight state management
- **next-themes**: Theme management

### 2. Backend Technology
- **NestJS**: Enterprise Node.js framework
- **TypeScript**: Type-safe backend
- **REST APIs**: RESTful API architecture
- **JWT Authentication**: Secure token-based auth
- **RBAC**: Role-based access control
- **PostgreSQL**: Relational database
- **TypeORM**: Object-relational mapping

### 3. Architecture
- **MVC Pattern**: Model-View-Controller architecture
- **Modular Structure**: Organized codebase
- **API-First Design**: RESTful API design
- **Scalable Architecture**: Enterprise-grade scalability

### 4. Data Management
- **Real-time Sync**: Live data synchronization
- **Caching Support**: Redis caching (planned)
- **Data Validation**: Input validation
- **Error Handling**: Comprehensive error handling

### 5. Development Features
- **Type Safety**: Full TypeScript coverage
- **Code Quality**: ESLint configuration
- **Formatting**: Prettier support
- **Mock Data**: Development mock data
- **Hot Reload**: Fast development experience

---

## Additional Features

### 1. File Upload System
- **File Upload**: Upload files to dashboard
- **Email Notifications**: Automatic email on upload
- **File Management**: Organize and manage files
- **Client Tracking**: Track uploads by client

### 2. Profile Management
- **User Profiles**: Edit personal information
- **Password Change**: Secure password updates
- **Profile Picture**: Upload profile images
- **Preferences**: User preferences management

### 3. Settings
- **System Settings**: Configure system parameters
- **User Settings**: Personal user settings
- **Notification Settings**: Configure notifications
- **Theme Settings**: Appearance preferences

### 4. Hardware Requirements Page
- **Device Specifications**: View required hardware
- **Compatibility Guide**: Device compatibility info
- **Setup Instructions**: Hardware setup guide

### 5. Vineyard Management
- **Multi-Vineyard Support**: Manage multiple vineyards
- **Vineyard Selection**: Switch between vineyards
- **Location-based Data**: Location-specific data

---

## Summary Statistics

### Total Features: 150+
### User Roles: 9
### Authentication Methods: 3
### Dashboard Types: 6
### IoT Device Types: 5
### Attendance Methods: 3
### Report Types: 6+
### Notification Types: 4+

---

**This comprehensive feature list covers all aspects of the Sukhri Vineyard ERP system, organized for easy presentation and documentation purposes.**

