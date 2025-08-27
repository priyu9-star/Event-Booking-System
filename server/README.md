# Smart Event Booking System - Backend

This is the **backend** of the Smart Event Booking System, built with **Node.js**, **Express**, and **MySQL**.  
It provides APIs for managing events and bookings, and connects to a React frontend.

---

## 🚀 Tech Stack

- **Node.js** – JavaScript runtime  
- **Express.js** – Web framework for REST APIs  
- **MySQL** – Relational database  
- **dotenv** – Environment variable management  
- **cors** – Cross-Origin Resource Sharing  

---

## 📂 Project Structure

backend/
├── src/
│ ├── config/ # Database connection
│ ├── models/ # Event and Booking models
│ ├── routes/ # API routes
│ ├── controllers/ # Route handlers
│ ├── migrations/ # SQL scripts for creating tables
│ └── index.js # Entry point
├── .env.example # Sample environment variables
├── package.json
└── README.md


---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd backend
npm install

Configure Environment Variables
cp .env.example .env

Update .env with your MySQL credentials:
DB_HOST=localhost
DB_USER=app_user
DB_PASSWORD=strongpassword
DB_NAME=smart_event_db
DB_PORT=3306
PORT=4000

Set Up MySQL Database:
mysql -u root -p
Enter your MySQL root password.

Create the database:
CREATE DATABASE smart_event_db;
USE smart_event_db;

Create the tables:
CREATE TABLE IF NOT EXISTS events (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  date DATETIME NOT NULL,
  total_seats INT UNSIGNED NOT NULL DEFAULT 0,
  available_seats INT UNSIGNED NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  img VARCHAR(512)
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  event_id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile VARCHAR(50),
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

Optional: Create Dedicated User
Instead of using root, create a new MySQL user for the app:

CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'strongpassword';
GRANT ALL PRIVILEGES ON smart_event_db.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;

cd server
npm run dev

If everything is correct, you should see:
DB connected
Server running on 4000