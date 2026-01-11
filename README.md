# SamajikWorld  🌐

## [A Video Sharing and Microblogging Platform]
[Live Demo](https://samajik-world.vercel.app/)

**SamajikWorld** is a production-oriented micro-blogging and video-sharing platform. Unlike standard "tutorial projects," this was engineered as a deep-dive into system design, cloud infrastructure, and DevOps practices to simulate real-world enterprise development.

---

## 🚀 Project Overview

SamajikWorld enables users to engage in a modern social ecosystem with features including:

* **Secure Authentication:** Robust user registration and login.
* **Micro-blogging:** Create, like, and comment on text-based posts.
* **Media Streaming:** Upload and stream videos using HTTP range requests.
* **Real-time Interaction:** Designed for low-latency content engagement.
* **Production-Ready Infrastructure:** Built with containerization and CI/CD at its core.

---

## 🏗️ Tech Stack

### **Frontend**

* **Library:** React.js
* **State Management:** Hooks & Context API
* **Communication:** Axios (REST API consumption)

### **Backend**

* **Runtime:** Node.js
* **Framework:** Express.js
* **Security:** JWT (JSON Web Tokens) & Bcrypt

### **Database**

* **Engine:** MongoDB
* **Modeling:** Mongoose ODM
* **Optimization:** Indexed collections for high-speed queries

### **DevOps & Cloud**

* **Containerization:** Docker & Docker Compose
* **Cloud Provider:** AWS (EC2, ECS, S3)
* **Automation:** GitHub Actions / AWS CodePipeline

---

## 📐 System Architecture

The application follows a decoupled architecture to ensure separation of concerns and independent scalability.

### **The Flow:**

1. **Client (React):** Communicates via RESTful endpoints.
2. **Logic Layer (Express/Node):** Controllers handle business logic while Middleware manages auth.
3. **Data Layer (MongoDB):** Persistent storage for users and posts.
4. **Storage (S3/Local):** Binary large objects (videos/images) are served separately to reduce server load.

---

## 🔐 Security & Media Handling

### **Security First**

* **Stateless Auth:** Uses JWT for secure, scalable session management.
* **Route Guarding:** Private routes and custom middleware prevent unauthorized data access.
* **Secret Management:** Strict use of `.env` files and environment-based configurations.

### **Video Engineering**

* Supported **HTTP Range Requests**, allowing users to seek through videos without downloading the entire file first.
* Designed for an easy transition from local storage to **AWS S3 + CloudFront (CDN)** for global low-latency delivery.

---

## ⚙️ Setup & Installation

### **Prerequisites**

* Node.js (v16+)
* MongoDB (Local or Atlas)
* Docker (Recommended)

### **Local Development**

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/samajikworld.git

```


2. **Backend Setup:**
```bash
cd backend
npm install
# Create a .env file with MONGO_URI and JWT_SECRET
npm start

```


3. **Frontend Setup:**
```bash
cd frontend
npm install
npm start

```



---

## 📈 Roadmap & Scalability

To transition from a MVP to a high-traffic platform, the following optimizations are planned:

* [ ] **Caching:** Implement Redis for frequently accessed social feeds.
* [ ] **Real-time:** Integrate WebSockets (Socket.io) for instant notifications.
* [ ] **Global Delivery:** Move media to AWS S3 with a CloudFront CDN layer.
* [ ] **Elasticity:** Configure AWS Auto-scaling groups to handle traffic spikes.

---

## 👨‍💻 Author

**Ashutosh Shukla**
*Full-Stack Engineer & System Design Enthusiast*

> "This project represents my philosophy of depth over quantity—understanding how software is truly built, secured, and scaled in an enterprise environment."

---
