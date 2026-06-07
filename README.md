# Eventful API

A robust event ticketing and management backend built with NestJS, MongoDB, Redis, and Paystack.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Running Tests](#running-tests)

---

## Overview

Eventful is a full-featured event ticketing platform API that allows users to create and manage events, purchase tickets, process payments via Paystack, generate QR codes for ticket verification, set reminders, and share events on social media.

---

## Tech Stack

- **Framework:** NestJS (Node.js)
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose)
- **Cache:** Redis (BullMQ)
- **Queue:** BullMQ
- **Storage:** Cloudinary
- **Payments:** Paystack
- **Authentication:** JWT (Access + Refresh tokens)
- **Testing:** Jest + Supertest (E2E)

---

## Features

- JWT authentication with access and refresh tokens
- User profile management and notification preferences
- Event creation, listing, updating, and deletion
- Ticket purchasing with QR code generation and verification
- Payment processing via Paystack with webhook support
- Event reminders via email, SMS, and push notifications
- Event analytics tracking (views, tickets sold, revenue)
- Social media sharing (Twitter, Facebook, WhatsApp)
- Redis caching and BullMQ job queues
- Cloudinary file storage
- Global exception handling and response formatting
- Full E2E test coverage

---

## Project Structure

```
src/
├── modules/
│   ├── auth/          # Authentication (register, login, refresh token)
│   ├── users/         # User profiles and notification preferences
│   ├── events/        # Event CRUD operations
│   ├── tickets/       # Ticket purchasing and management
│   ├── qrcode/        # QR code generation and verification
│   ├── payments/      # Paystack payment integration
│   ├── notifications/ # Reminders via email, SMS, push
│   ├── analytics/     # Event analytics
│   └── sharing/       # Social media sharing
│
└── shared/
    ├── database/      # MongoDB connection
    ├── cache/         # Redis cache service
    ├── queue/         # BullMQ queue setup
    ├── storage/       # Cloudinary storage service
    ├── event-bus/     # Internal event bus
    ├── filters/       # Global exception filter
    ├── interceptors/  # Logging and response interceptors
    └── config/        # Environment config module
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (Atlas or local)
- Redis (Docker or local)
- Paystack account


### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/eventful.git
cd eventful

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Fill in your values in .env

# Start Redis
docker run -d -p 6379:6379 --name redis --restart always redis

# Start the server
npm run start:dev
```

Server runs on `http://localhost:5000/api/v1`

---

## Environment Variables

```env
# Server
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eventful

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Paystack
PAYSTACK_SECRET_KEY=sk_test_your_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## API Endpoints

Base URL: `http://localhost:5000/api/v1`

All protected routes require: `Authorization: Bearer <accessToken>`

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | None | Register a new user |
| POST | `/auth/login` | None | Login and get tokens |
| POST | `/auth/refresh` | None | Refresh access token |

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/profile` | Required | Get current user profile |
| PATCH | `/users/profile` | Required | Update profile |
| PATCH | `/users/notifications` | Required | Update notification preferences |

### Events

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/events` | Required | Create an event |
| GET | `/events` | None | Get all events |
| GET | `/events/:id` | None | Get event by ID |
| PATCH | `/events/:id` | Required | Update event (creator only) |
| DELETE | `/events/:id` | Required | Delete event (creator only) |

### Tickets

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/tickets/purchase` | Required | Purchase a ticket |
| GET | `/tickets/my-tickets` | Required | Get my tickets |
| GET | `/tickets/:id` | Required | Get ticket by ID |

### Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments/initialize` | Required | Initialize Paystack payment |
| GET | `/payments/verify/:reference` | None | Verify payment |
| POST | `/payments/webhook` | None | Paystack webhook handler |

### Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/notifications/reminder` | Required | Set event reminder |
| GET | `/notifications` | Required | Get my notifications |

### Analytics

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/analytics` | None | Create analytics record |
| GET | `/analytics` | None | Get all analytics |
| GET | `/analytics/:eventId` | None | Get event analytics |
| PATCH | `/analytics/:eventId` | None | Update analytics |

### Sharing

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/sharing/:eventId/link` | None | Generate share link |
| GET | `/sharing/:eventId/social?platform=twitter` | None | Share to social media |

### QR Code

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/qrcode/:ticketId` | Required | Generate QR code |
| PATCH | `/qrcode/verify` | Required | Verify QR code |


## API Documentation

[![Run in Postman](https://run.pstmn.io/button.svg)] 
https://documenter.getpostman.com/view/50459101/2sBXwqrATe

Or view the full API documentation here: [Eventful API Docs] 
https://documenter.getpostman.com/view/50459101/2sBXwqrATe


## Running Tests

```bash
# E2E tests
npm run test:e2e

# Unit tests
npm run test

# Test coverage
npm run test:cov
```

The E2E tests use an in-memory MongoDB instance so no database setup is required.

Author

Paschal Nnamdi Okoronkwo

Capstone Project – Eventful Event Management Platform