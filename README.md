# STEP-BY-STEP GUIDE for Testing the Spaceport Locally

## 1. Set Up PostgreSQL Database

### Create the Database
```bash
psql -U postgres
```
Inside the `psql` shell:
```bash
CREATE DATABASE spaceport
\dt
```
Verify DB Created
```
psql -U postgres -d spaceport
\dt
```

## 2. Configure `.env` in `/backend`
Create a `.env` file inside `/backendn` and add:
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=spaceport
DATABASE_SSL=false
DATABASE_DEBUG=false

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d
```

## 3. Install Dependencies & Run Backend
Navigate to `/backend`
```
cd backend
yarn install   # or npm install
yarn start:dev # or npm run start:dev
```
### Verify: 
Backend should run on:
```
http://localhost:4000
```

## 4. Set Up Frontendd
### Navigate to `/frontend`
```
cd ../frontend
yarn install
yarn dev
```
### Verify:
Frontend should run on:
```
http://localhost:3000
```

## 5. Test Features
### Sign Up
- Go to `/signup`
- Fill out form > Submit|
- Check terminal for backend log or DB for new user

### Login
- Go to `/login`
- Enter valid credentials
- You should be redirected to `/overview`

### Forgot Password
- Go to `/forgot-passowrd`
- Enter your email
- You will receive a **reset link** (inresponse JSON)
- Open the link: `/reset-passowrd?token=...`
- Enter new password > Submit

### Reset Password
- You should be redirected to login with a success message
- Login using new password


