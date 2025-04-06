# Spaceport Backend - Campaign Management Platform

## Entity Structure

### Base Entity

All entities extend from the `BaseEntity` class which provides common fields:

- `id`: UUID primary key
- `createdAt`: Timestamp when the record was created
- `updatedAt`: Timestamp when the record was last updated
- `deletedAt`: Timestamp when the record was soft deleted (nullable)
- `isDeleted`: Boolean flag indicating if the record is soft deleted

### User Entity

Represents users of the platform:

- `email`: Unique email address
- `firstName`: User's first name
- `lastName`: User's last name
- `password`: Hashed password (hidden from API responses)
- `avatar`: Optional URL to user's avatar image

### Campaign Entity

Represents marketing campaigns:

- `name`: Campaign name
- `description`: Optional campaign description
- `status`: Campaign status (draft, scheduled, active, paused, completed, cancelled)
- `type`: Campaign type (email, social, display, sms, push, other)
- `startDate`: Optional campaign start date
- `endDate`: Optional campaign end date
- `budget`: Campaign budget amount
- `owner`: Reference to the User who owns the campaign
- `contents`: Collection of CampaignContent entities
- `tags`: Collection of Tag entities

### CampaignContent Entity

Represents content pieces within a campaign:

- `title`: Content title
- `content`: Optional text content
- `mediaUrl`: Optional URL to media (image, video, etc.)
- `contentType`: Type of content (text, image, video, html, document)
- `displayOrder`: Order in which content should be displayed
- `campaign`: Reference to the Campaign this content belongs to

### Tag Entity

Represents tags for categorizing campaigns:

- `name`: Unique tag name
- `description`: Optional tag description
- `color`: Optional color code for UI display
- `campaigns`: Collection of Campaign entities

### Target Entity

Represents targeting criteria for campaigns:

- `name`: Target name
- `description`: Optional target description
- `type`: Target type (demographic, geographic, behavioral, interest, custom)
- `criteria`: JSON object containing targeting criteria
- `campaign`: Reference to the Campaign this target belongs to

### Performance Entity

Represents performance metrics for campaigns:

- `date`: Date of the performance record
- `impressions`: Number of impressions
- `clicks`: Number of clicks
- `conversions`: Number of conversions
- `spend`: Amount spent
- `revenue`: Amount of revenue generated
- `additionalMetrics`: Optional JSON object containing additional metrics
- `campaign`: Reference to the Campaign these metrics belong to

## Entity Relationships

- A User can own multiple Campaigns (one-to-many)
- A Campaign can have multiple CampaignContents (one-to-many)
- A Campaign can have multiple Targets (one-to-many)
- A Campaign can have multiple Performance records (one-to-many)
- Campaigns and Tags have a many-to-many relationship

## Database Schema

The database schema includes appropriate indexes and constraints for performance and data integrity:

- Foreign key constraints to maintain referential integrity
- Unique constraints on fields like email and tag name
- Indexes on frequently queried fields and relationships
- Soft delete functionality for all entities
