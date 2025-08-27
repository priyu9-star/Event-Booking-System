# Smart Event Booking System

A full-stack web application to browse, book, and manage event tickets efficiently, with real-time seat availability and dynamic pricing.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Design](#database-design)
- [APIs](#apis)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### User Features
- Browse upcoming events with search and filter by location/date.
- View event details including description, images, Google Maps location, ticket categories, and dynamic pricing.
- Book tickets through an animated checkout form.
- View booking confirmation with animated success screen and downloadable QR code.

### Admin Features
- Create, update, and delete events.
- Track all bookings with status (confirmed/cancelled).

---

## Tech Stack
- **Frontend:** React.js, Tailwind CSS, Framer Motion, Parallax
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Optional:** Socket.IO for real-time seat locking

---

## Database Design (MySQL)

### `events` Table
| Column        | Type         | Description                  |
|---------------|-------------|------------------------------|
| id            | INT (PK)    | Event ID                     |
| title         | VARCHAR     | Event title                  |
| description   | TEXT        | Event description            |
| location      | VARCHAR     | Event location               |
| date          | DATETIME    | Event date & time            |
| total_seats   | INT         | Total available seats        |
| available_seats | INT       | Remaining seats              |
| price         | DECIMAL     | Ticket price                 |
| img           | VARCHAR     | Image URL                    |

### `bookings` Table
| Column        | Type        | Description                     |
|---------------|------------|---------------------------------|
| id            | INT (PK)   | Booking ID                      |
| event_id      | INT (FK)   | References `events.id`          |
| name          | VARCHAR    | Customer name                   |
| email         | VARCHAR    | Customer email                  |
| mobile        | VARCHAR    | Customer mobile number          |
| quantity      | INT        | Number of tickets booked        |
| total_amount  | DECIMAL    | Total booking amount            |
| booking_date  | DATETIME   | Booking date                    |
| status        | ENUM       | Booking status (`confirmed`, `cancelled`) |

---

## APIs

- **Event CRUD**
  - `POST /events` – Create an event
  - `GET /events` – Get all events
  - `GET /events/:id` – Get event details
  - `PUT /events/:id` – Update event
  - `DELETE /events/:id` – Delete event

- **Booking**
  - `POST /bookings` – Book tickets

---

## Project Structure

smart-event-system/
├── client/ # React Frontend
├── server/ # Node.js + Express Backend
├── README.md
└── .gitignore


**Frontend Highlights**
- Pages: Home, Events, EventDetails, Booking, AdminDashboard
- Components: Navbar, Footer, EventCard, BookingForm, QRCodeModal

**Backend Highlights**
- Models: Event.js, Booking.js, db.js
- Routes: events.js, bookings.js
- Controllers: eventsController.js, bookingsController.js
- Middleware: errorHandler.js

---

## Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Event Details
![Event Details](screenshots/event-details.png)

### Booking Page
![Booking Page](screenshots/booking.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin.png)

---

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/priyu9-star/Event-Booking-System.git
cd Event-Booking-System

Backend Setup:
cd server
npm install
cp .env.example .env    # Set your DB credentials
npm run dev

Frontend Setup:
cd ../client
npm install
npm run dev
