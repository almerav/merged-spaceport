# Users Module Documentation

## Overview
This module handles user registration, authentication, and password management using **NestJS**, **MikroORM**, and **JWT** for secure token management.

---

## 📚 **Entities**

### `User`
- `id` (UUID) – Primary key.
- `email` (string) – Unique email address.
- `firstName` (string) – User's first name.
- `lastName` (string) – User's last name.
- `password` (string) – Hashed password.
- `avatar` (string, optional) – Avatar URL.
- `createdAt` (Date) – Timestamp when the record is created.
- `updatedAt` (Date, optional) – Timestamp when the record is updated.

---

## 🚀 **Controllers**

### `UsersController`
- **`POST /users/register`**  
  - Registers a new user.
  - **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "password": "password123",
      "avatar": "avatar-url"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "User registered successfully"
    }
    ```

- **`POST /users/login`**  
  - Authenticates user and returns JWT token.
  - **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Response:**
    ```json
    {
      "accessToken": "jwt-token",
      "user": {
        "id": "uuid",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "avatar-url"
      }
    }
    ```

- **`POST /users/reset-password`**  
  - Resets user password.
  - **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "newPassword": "newPassword123"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Password reset successfully"
    }
    ```

- **`GET /users`** _(Protected)_  
  - Retrieves a list of all registered users.

- **`GET /users/profile`** _(Protected)_  
  - Retrieves the authenticated user's profile.

---

## 🛠️ **Services**

### `UsersService`
- **`register(createUserDto: CreateUserDto)`**
  - Registers a new user and hashes the password automatically.
- **`validateUser(email: string, password: string)`**
  - Validates user credentials and returns the user if valid.
- **`login(loginDto: LoginDto)`**
  - Generates JWT token upon successful login.
- **`findAll()`**
  - Fetches all registered users.
- **`resetPassword(resetPasswordDto: ResetPasswordDto)`**
  - Resets user password after validation.

---

## 🛡️ **Guards**

### `JwtAuthGuard`
- Protects routes that require authentication using JWT tokens.

---

## 🗂️ **DTOs**

### `CreateUserDto`
```typescript
{
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  avatar?: string;
}
