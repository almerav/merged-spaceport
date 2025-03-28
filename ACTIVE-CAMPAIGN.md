# Active Campaign API Documentation

## Overview
The **Active Campaign API** provides endpoints for managing marketing campaigns. This includes creating, updating, retrieving, and deleting campaigns. The API is built using **NestJS** and **Mikro-ORM**, leveraging DTOs for validation and structured data handling.

## Technologies Used
- **NestJS** (Framework for building efficient and scalable server-side applications)
- **Mikro-ORM** (Object Relational Mapper for database operations)
- **Class Validator & Transformer** (Validation and data transformation)
- **TypeScript** (Strongly typed JavaScript for better maintainability)

## Entity: `ActiveCampaign`
The `ActiveCampaign` entity represents a marketing campaign. It contains the following properties:

| Field       | Type     | Description |
|------------|---------|-------------|
| `id`       | `string (UUID)` | Unique identifier for the campaign |
| `name`     | `string` | Name of the campaign |
| `status`   | `enum`   | Status of the campaign (`draft`, `scheduled`, `active`, `paused`, `completed`, `cancelled`) |
| `type`     | `enum`   | Type of campaign (`email`, `social`, `display`, `sms`, `push`, `other`) |
| `budget`   | `number` | (Optional) Budget allocated for the campaign |
| `startDate`| `Date`   | (Optional) Start date of the campaign |
| `endDate`  | `Date`   | (Optional) End date of the campaign |
| `createdAt`| `Date`   | Timestamp when the campaign was created |
| `updatedAt`| `Date`   | Timestamp when the campaign was last updated |
| `isDeleted`| `boolean` | Flag indicating if the campaign is deleted |

## API Endpoints

### **1. Retrieve All Campaigns**
**Endpoint:** `GET /active-campaigns`

**Description:** Fetches all active campaigns from the database.

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Spring Sale Campaign",
    "status": "active",
    "type": "email",
    "budget": 1000,
    "startDate": "2025-04-01T00:00:00.000Z",
    "endDate": "2025-04-30T00:00:00.000Z"
  }
]
```

---

### **2. Retrieve a Single Campaign**
**Endpoint:** `GET /active-campaigns/:id`

**Description:** Fetches details of a specific campaign.

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Spring Sale Campaign",
  "status": "active",
  "type": "email",
  "budget": 1000,
  "startDate": "2025-04-01T00:00:00.000Z",
  "endDate": "2025-04-30T00:00:00.000Z"
}
```

---

### **3. Create a Campaign**
**Endpoint:** `POST /active-campaigns`

**Description:** Creates a new campaign.

**Request Body:**
```json
{
  "name": "Winter Sale",
  "status": "scheduled",
  "type": "sms",
  "budget": 5000,
  "startDate": "2025-12-01T00:00:00.000Z",
  "endDate": "2025-12-31T00:00:00.000Z"
}
```

**Response:**
```json
{
  "id": "987e4567-e89b-12d3-a456-426614174999",
  "name": "Winter Sale",
  "status": "scheduled",
  "type": "sms",
  "budget": 5000,
  "startDate": "2025-12-01T00:00:00.000Z",
  "endDate": "2025-12-31T00:00:00.000Z"
}
```

---

### **4. Update a Campaign**
**Endpoint:** `PUT /active-campaigns/:id`

**Description:** Updates a campaign's details.

**Request Body:**
```json
{
  "status": "active"
}
```

**Response:**
```json
{
  "id": "987e4567-e89b-12d3-a456-426614174999",
  "name": "Winter Sale",
  "status": "active",
  "type": "sms",
  "budget": 5000,
  "startDate": "2025-12-01T00:00:00.000Z",
  "endDate": "2025-12-31T00:00:00.000Z"
}
```

---

### **5. Delete a Campaign**
**Endpoint:** `DELETE /active-campaigns/:id`

**Description:** Deletes a campaign by ID.

**Response:**
```json
{
  "message": "Campaign deleted successfully"
}
```

---

## Flow and Functionalities

### **1. Data Flow**
- Requests are received by the **ActiveCampaignController**.
- Validation is handled using DTOs before data reaches the service layer.
- The **ActiveCampaignService** interacts with the database via Mikro-ORM.
- Responses are returned to the client after processing.

### **2. Validations**
- The `CreateActiveCampaignDto` ensures that required fields are provided.
- Optional fields (`budget`, `startDate`, `endDate`) are validated using `class-validator`.
- The `UpdateActiveCampaignDto` allows partial updates using `PartialType`.

### **3. Error Handling**
- If a campaign is not found, a `NotFoundException` is thrown.
- If a database operation fails, an `InternalServerErrorException` is thrown.

## Conclusion
This API provides a structured way to manage active campaigns, ensuring data integrity through validation and error handling. It follows RESTful principles and integrates Mikro-ORM for efficient database operations.

