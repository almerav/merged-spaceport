import { EntityManager } from '@mikro-orm/core';
import {
  Campaign,
  CampaignStatus,
  CampaignType,
} from '../campaigns/entities/campaign.entity';
import { BaseSeeder } from './BaseSeeder';
import { User } from '../users/entities/user.entity';
import {
  CampaignContent,
  ContentType,
} from '../campaigns/entities/campaign-content.entity';

export class CampaignSeeder extends BaseSeeder {
  async run(em: EntityManager): Promise<void> {
    // Prevent running in production
    this.checkEnvironment();

    this.logStart('Campaign');

    // First, check if we have users to associate campaigns with
    const usersCount = await em.count(User, {});

    if (usersCount === 0) {
      this.logger.warn('No users found. Skipping campaign seeding.');
      return;
    }

    // Get all users to distribute campaigns among them
    const users = await em.find(User, {});

    const campaignTemplates = [
      {
        name: 'Summer Sale 2024',
        description: 'Promotional campaign for summer products',
        status: CampaignStatus.ACTIVE,
        type: CampaignType.EMAIL,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-08-31'),
        budget: 5000,
        contents: [
          {
            title: 'Summer Sale Announcement',
            content:
              'Get ready for our biggest summer sale ever! Starting June 1st.',
            contentType: ContentType.TEXT,
            displayOrder: 0,
          },
          {
            title: 'Summer Products Showcase',
            mediaUrl: 'https://example.com/images/summer-products.jpg',
            contentType: ContentType.IMAGE,
            displayOrder: 1,
          },
        ],
      },
      {
        name: 'New Product Launch',
        description: 'Campaign for launching our new flagship product',
        status: CampaignStatus.SCHEDULED,
        type: CampaignType.SOCIAL,
        startDate: new Date('2024-07-15'),
        endDate: new Date('2024-08-15'),
        budget: 10000,
        contents: [
          {
            title: 'Product Teaser',
            mediaUrl: 'https://example.com/videos/product-teaser.mp4',
            contentType: ContentType.VIDEO,
            displayOrder: 0,
          },
          {
            title: 'Product Features',
            content:
              '<h1>Introducing Our New Product</h1><p>Check out these amazing features...</p>',
            contentType: ContentType.HTML,
            displayOrder: 1,
          },
        ],
      },
      {
        name: 'Holiday Promotion',
        description: 'End of year holiday promotional campaign',
        status: CampaignStatus.DRAFT,
        type: CampaignType.DISPLAY,
        startDate: new Date('2024-11-15'),
        endDate: new Date('2024-12-31'),
        budget: 7500,
        contents: [
          {
            title: 'Holiday Banner',
            mediaUrl: 'https://example.com/images/holiday-banner.jpg',
            contentType: ContentType.IMAGE,
            displayOrder: 0,
          },
          {
            title: 'Holiday Catalog',
            mediaUrl: 'https://example.com/documents/holiday-catalog.pdf',
            contentType: ContentType.DOCUMENT,
            displayOrder: 1,
          },
        ],
      },
      {
        name: 'Customer Retention',
        description: 'Campaign targeting existing customers',
        status: CampaignStatus.ACTIVE,
        type: CampaignType.SMS,
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-12-31'),
        budget: 3000,
        contents: [
          {
            title: 'Loyalty Rewards',
            content:
              "Thank you for being a valued customer! Here's a special offer just for you.",
            contentType: ContentType.TEXT,
            displayOrder: 0,
          },
        ],
      },
      {
        name: 'App Engagement',
        description: 'Campaign to increase mobile app engagement',
        status: CampaignStatus.ACTIVE,
        type: CampaignType.PUSH,
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-10-31'),
        budget: 2500,
        contents: [
          {
            title: 'New Features Alert',
            content: 'Check out the new features in our latest app update!',
            contentType: ContentType.TEXT,
            displayOrder: 0,
          },
        ],
      },
      {
        name: 'Brand Awareness',
        description: 'General brand awareness campaign',
        status: CampaignStatus.PAUSED,
        type: CampaignType.OTHER,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-09-30'),
        budget: 15000,
        contents: [
          {
            title: 'Brand Story',
            mediaUrl: 'https://example.com/videos/brand-story.mp4',
            contentType: ContentType.VIDEO,
            displayOrder: 0,
          },
          {
            title: 'Brand Values',
            content:
              '<h1>Our Values</h1><p>At our company, we believe in...</p>',
            contentType: ContentType.HTML,
            displayOrder: 1,
          },
        ],
      },
    ];

    let campaignsCreated = 0;
    let contentsCreated = 0;

    // Distribute campaigns among users
    for (let i = 0; i < campaignTemplates.length; i++) {
      const template = campaignTemplates[i];

      // Assign to a random user
      const randomUserIndex = Math.floor(Math.random() * users.length);
      const owner = users[randomUserIndex];

      // Create a unique name to avoid duplicates
      const campaignName = `${template.name} - ${owner.firstName}`;

      // Check if campaign already exists to make seeder idempotent
      const exists = await this.exists(em, Campaign, {
        name: campaignName,
        owner: owner.id,
      });

      if (!exists) {
        // Create the campaign
        const campaign = em.create(Campaign, {
          name: campaignName,
          description: template.description,
          status: template.status,
          type: template.type,
          startDate: template.startDate,
          endDate: template.endDate,
          budget: template.budget,
          owner,
        });

        campaignsCreated++;

        // Create campaign contents
        for (const contentTemplate of template.contents) {
          em.create(CampaignContent, {
            ...contentTemplate,
            campaign,
          });

          contentsCreated++;
        }
      } else {
        this.logger.verbose(
          `Campaign with name ${campaignName} for user ${owner.firstName} already exists, skipping`,
        );
      }
    }

    this.logComplete('Campaign', campaignsCreated);
    this.logger.log(`Created ${contentsCreated} campaign contents`);
  }
}
