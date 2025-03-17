import { EntityManager } from '@mikro-orm/core';
import { Tag } from '../tags/entities/tag.entity';
import { BaseSeeder } from './BaseSeeder';

export class TagSeeder extends BaseSeeder {
  async run(em: EntityManager): Promise<void> {
    // Prevent running in production
    this.checkEnvironment();

    this.logStart('Tag');

    const tags = [
      {
        name: 'Marketing',
        description: 'Marketing related campaigns',
        color: '#FF5733',
      },
      {
        name: 'Sales',
        description: 'Sales promotion campaigns',
        color: '#33FF57',
      },
      {
        name: 'Product Launch',
        description: 'Campaigns for new product launches',
        color: '#3357FF',
      },
      {
        name: 'Brand Awareness',
        description: 'Campaigns focused on brand awareness',
        color: '#F033FF',
      },
      {
        name: 'Seasonal',
        description: 'Seasonal promotional campaigns',
        color: '#FF9933',
      },
      {
        name: 'Holiday',
        description: 'Holiday-specific campaigns',
        color: '#33FFF9',
      },
      {
        name: 'Social Media',
        description: 'Campaigns for social media platforms',
        color: '#9933FF',
      },
      {
        name: 'Email',
        description: 'Email marketing campaigns',
        color: '#FF3393',
      },
      {
        name: 'Display',
        description: 'Display advertising campaigns',
        color: '#33FF93',
      },
      {
        name: 'Mobile',
        description: 'Mobile-specific campaigns',
        color: '#9333FF',
      },
    ];

    let createdCount = 0;

    for (const tagData of tags) {
      // Check if tag already exists to make seeder idempotent
      const exists = await this.exists(em, Tag, { name: tagData.name });

      if (!exists) {
        em.create(Tag, tagData);
        createdCount++;
      } else {
        this.logger.verbose(
          `Tag with name ${tagData.name} already exists, skipping`,
        );
      }
    }

    this.logComplete('Tag', createdCount);
  }
}
