# Digital Wallet System

A full-stack digital wallet application built with Spring Boot backend and React TypeScript frontend.

## Overview

This project implements a complete digital wallet system that allows users to:
- Register and authenticate securely
- Create and manage digital wallets
- Transfer money between wallets
- View transaction history
- Monitor wallet balances

## Architecture

- **Backend**: Spring Boot REST API with JWT authentication
- **Frontend**: React TypeScript SPA
- **Database**: H2 in-memory database
- **Security**: JWT tokens with Spring Security

## Quick Start

### Prerequisites
- Java 11+
- Node.js 14+
- Maven 3.6+

### 1. Start the Backend
```bash
cd digital-wallet-system
./mvnw spring-boot:run
```
Backend will run on `http://localhost:8080`

### 2. Start the Frontend
```bash
cd digital-wallet-frontend
npm install
npm start
```
Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Wallet Operations
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/transfer` - Transfer money

### Transactions
- `GET /api/transactions` - Get transaction history

## Features

✅ User registration and login  
✅ JWT-based authentication  
✅ Wallet creation and management  
✅ Money transfers between users  
✅ Transaction history tracking  
✅ Real-time balance updates  
✅ Responsive web interface  

## Tech Stack

**Backend:**
- Spring Boot 2.7+
- Spring Security
- Spring Data JPA
- H2 Database
- JWT Authentication
- Maven

**Frontend:**
- React 18
- TypeScript
- CSS3
- Axios for API calls

## Database

Uses H2 in-memory database. Data is stored in `/data` directory and persists between restarts.

## Security

- Passwords are encrypted using BCrypt
- JWT tokens for stateless authentication
- CORS configured for frontend integration