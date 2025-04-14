import { EntityManager } from '@mikro-orm/core';
import { Target, TargetType } from '../targets/entities/target.entity';
import { BaseSeeder } from './BaseSeeder';
import { Campaign } from '../campaigns/entities/campaign.entity';

export class TargetSeeder extends BaseSeeder {
  async run(em: EntityManager): Promise<void> {
    // Prevent running in production
    this.checkEnvironment();

    this.logStart('Target');

    // First, check if we have campaigns to associate targets with
    const campaignsCount = await em.count(Campaign, {});

    if (campaignsCount === 0) {
      this.logger.warn('No campaigns found. Skipping target seeding.');
      return;
    }

    // Get all campaigns to associate targets with
    const campaigns = await em.find(Campaign, {});

    const targetTemplates = [
      {
        name: 'Young Adults',
        description: 'Target audience of young adults aged 18-25',
        type: TargetType.DEMOGRAPHIC,
        criteria: {
          ageRange: { min: 18, max: 25 },
          gender: ['male', 'female', 'non-binary'],
          income: { min: 20000, max: 50000 },
        },
      },
      {
        name: 'Urban Professionals',
        description: 'Urban working professionals aged 25-40',
        type: TargetType.DEMOGRAPHIC,
        criteria: {
          ageRange: { min: 25, max: 40 },
          gender: ['male', 'female', 'non-binary'],
          income: { min: 50000, max: 120000 },
          occupation: ['professional', 'manager', 'executive'],
        },
      },
      {
        name: 'US West Coast',
        description: 'Users located in the US West Coast',
        type: TargetType.GEOGRAPHIC,
        criteria: {
          country: 'United States',
          regions: ['California', 'Oregon', 'Washington'],
          cityTypes: ['urban', 'suburban'],
        },
      },
      {
        name: 'Tech Enthusiasts',
        description: 'Users interested in technology and gadgets',
        type: TargetType.INTEREST,
        criteria: {
          interests: ['technology', 'gadgets', 'software', 'hardware'],
          behaviors: ['early adopter', 'high research before purchase'],
        },
      },
      {
        name: 'Recent Website Visitors',
        description: 'Users who visited the website in the last 7 days',
        type: TargetType.BEHAVIORAL,
        criteria: {
          websiteVisit: { days: 7 },
          pageViews: { min: 3 },
          productViews: { min: 1 },
        },
      },
      {
        name: 'Cart Abandoners',
        description: 'Users who abandoned their shopping cart',
        type: TargetType.BEHAVIORAL,
        criteria: {
          cartAbandonment: { days: 30 },
          cartValue: { min: 50 },
        },
      },
      {
        name: 'Custom Segment A',
        description: 'Custom user segment based on specific criteria',
        type: TargetType.CUSTOM,
        criteria: {
          customField1: 'value1',
          customField2: ['value2', 'value3'],
          customMetric: { min: 10, max: 100 },
        },
      },
    ];

    let createdCount = 0;

    // Distribute targets across campaigns
    for (let i = 0; i < campaigns.length; i++) {
      const campaign = campaigns[i];

      // Select 1-3 target templates for each campaign
      const numTargets = Math.floor(Math.random() * 3) + 1;
      const selectedIndices = new Set<number>();

      while (selectedIndices.size < numTargets) {
        const randomIndex = Math.floor(Math.random() * targetTemplates.length);
        selectedIndices.add(randomIndex);
      }

      for (const index of selectedIndices) {
        const template = targetTemplates[index];

        // Create a unique name for this target instance
        const targetName = `${template.name} - ${campaign.name}`;

        // Check if target already exists to make seeder idempotent
        const exists = await this.exists(em, Target, {
          name: targetName,
          campaign: campaign.id,
        });

        if (!exists) {
          em.create(Target, {
            ...template,
            name: targetName,
            campaign,
          });
          createdCount++;
        } else {
          this.logger.verbose(
            `Target with name ${targetName} for campaign ${campaign.name} already exists, skipping`,
          );
        }
      }
    }

    this.logComplete('Target', createdCount);
  }
}
