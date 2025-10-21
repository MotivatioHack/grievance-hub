# GrievanceHub - Online Complaint & Grievance Portal

This project is a full-stack web application built with React, TypeScript, Vite, shadcn/ui, Tailwind CSS for the frontend, and Node.js, Express, Sequelize (MySQL) for the backend. It provides a platform for users to submit, track, and manage complaints or grievances, with an admin interface for resolution and analytics.

---

## ✨ Features

* **User Portal:** Submit complaints, view status, add comments.
* **Admin Dashboard:** View all complaints, respond, change status, escalate.
* **Real-time Tracking:** Users and admins can track complaint progress.
* **File Uploads:** Attach supporting documents to complaints.
* **Authentication:** Secure user and admin login/registration.
* **Analytics:** Admins can view complaint statistics and trends.
* **Export:** Admins can export complaints to CSV/PDF.
* **Timeline:** Visual timeline of actions taken on a complaint.
* **Responsive Design:** Works on desktop, tablet, and mobile.
* **Modern UI:** Built with shadcn/ui and Tailwind CSS, featuring a glassmorphism theme.

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

* **Node.js:** >= v18 (Check with `node -v`)
* **npm:** (Usually comes with Node.js, check with `npm -v`)
* **MySQL:** A running MySQL database instance.
* **Git:** To clone the repository.

### Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone [YOUR_REPOSITORY_URL]
    cd grievancehub-project # Or your project's root directory name
    ```

2.  **Set up Backend:**
    * Navigate to the backend directory:
        ```bash
        cd backend
        ```
    * Install backend dependencies:
        ```bash
        npm install
        ```
    * **Create Environment File:** Copy the `.env.example` (if you have one) or create a new file named `.env` in the `backend` directory. Fill in your database credentials, JWT secret, and email settings:
        ```dotenv
        PORT=5000
        DB_HOST=localhost
        DB_USER=your_db_user         # Replace with your MySQL username
        DB_PASSWORD=your_db_password   # Replace with your MySQL password
        DB_NAME=grievancehub        # Replace with your database name
        JWT_SECRET=YOUR_STRONG_JWT_SECRET # Replace with a strong random string
        JWT_EXPIRES_IN=1d

        # Optional: Email settings for Nodemailer (if using email features)
        EMAIL_HOST=your_smtp_host
        EMAIL_PORT=your_smtp_port
        EMAIL_USER=your_email_user
        EMAIL_PASSWORD=your_email_password
        ```
    * **Database Setup:** Ensure you have created the database specified in `DB_NAME` in your MySQL instance. The tables will be created automatically when the server starts (due to `sequelize.sync()`).

3.  **Set up Frontend:**
    * Navigate back to the project root directory:
        ```bash
        cd ..
        ```
    * Install frontend dependencies:
        ```bash
        npm install
        ```

### Running the Application

1.  **Start the Backend Server:**
    * Make sure you are in the `backend` directory.
    * Run the development server (uses nodemon for auto-restarts):
        ```bash
        npm run dev
        ```
    * Or, start the server directly:
        ```bash
        npm start
        ```
    * The backend should now be running, typically on `http://localhost:5000`.

2.  **Start the Frontend Development Server:**
    * Make sure you are in the project's **root** directory.
    * Run the Vite development server:
        ```bash
        npm run dev
        ```
    * The frontend should now be running, typically on `http://localhost:8080`.

3.  **Access the Application:** Open your web browser and navigate to the frontend URL (e.g., `http://localhost:8080`).

---

## 🛠️ Built With

* **Frontend:** React, TypeScript, Vite, shadcn/ui, Tailwind CSS, Framer Motion, Recharts
* **Backend:** Node.js, Express, Sequelize, MySQL2, JWT, Bcryptjs, Multer, Nodemailer
* **Database:** MySQL

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## ©️ Copyright

© 2025 . All rights reserved.
Unauthorized copying, distribution, or modification of this project is prohibited.

