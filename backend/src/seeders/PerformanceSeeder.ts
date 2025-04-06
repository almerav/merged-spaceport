import { EntityManager } from '@mikro-orm/core';
import { BaseSeeder } from './BaseSeeder';
import { Performance } from '../performance/entities/performance.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';

export class PerformanceSeeder extends BaseSeeder {
  async run(em: EntityManager): Promise<void> {
    // Prevent running in production
    this.checkEnvironment();

    this.logStart('Performance');

    // First, check if we have campaigns to associate performance data with
    const campaignsCount = await em.count(Campaign, {});

    if (campaignsCount === 0) {
      this.logger.warn('No campaigns found. Skipping performance seeding.');
      return;
    }

    // Get all active campaigns to add performance data
    const campaigns = await em.find(Campaign, {});

    let createdCount = 0;

    // Generate performance data for the last 30 days for each campaign
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 30);

    for (const campaign of campaigns) {
      // Generate daily performance data
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        // Format date as YYYY-MM-DD for idempotent checking
        const dateString = date.toISOString().split('T')[0];

        // Check if performance data already exists for this campaign and date
        const exists = await this.exists(em, Performance, {
          campaign: campaign.id,
          date: {
            $gte: new Date(`${dateString}T00:00:00Z`),
            $lt: new Date(`${dateString}T23:59:59Z`),
          },
        });

        if (!exists) {
          // Generate random performance metrics
          const impressions = Math.floor(Math.random() * 10000) + 1000;
          const clicks = Math.floor(impressions * (Math.random() * 0.1 + 0.01)); // 1-11% CTR
          const conversions = Math.floor(clicks * (Math.random() * 0.1 + 0.01)); // 1-11% conversion rate
          const spend = parseFloat((Math.random() * 500 + 50).toFixed(2)); // $50-$550
          const revenue = parseFloat(
            (conversions * (Math.random() * 50 + 20)).toFixed(2),
          ); // $20-$70 per conversion

          // Additional metrics specific to campaign type
          const additionalMetrics: Record<string, any> = {};

          switch (campaign.type) {
            case 'email':
              additionalMetrics.opens = Math.floor(
                impressions * (Math.random() * 0.3 + 0.2),
              ); // 20-50% open rate
              additionalMetrics.unsubscribes = Math.floor(
                impressions * (Math.random() * 0.01),
              ); // 0-1% unsubscribe rate
              break;
            case 'social':
              additionalMetrics.shares = Math.floor(
                clicks * (Math.random() * 0.2 + 0.05),
              ); // 5-25% share rate
              additionalMetrics.comments = Math.floor(
                clicks * (Math.random() * 0.1 + 0.02),
              ); // 2-12% comment rate
              break;
            case 'display':
              additionalMetrics.viewability = parseFloat(
                (Math.random() * 0.3 + 0.6).toFixed(2),
              ); // 60-90% viewability
              additionalMetrics.frequency = parseFloat(
                (Math.random() * 3 + 1).toFixed(1),
              ); // 1-4 frequency
              break;
            default:
              // No additional metrics for other campaign types
              break;
          }

          // Create performance record
          em.create(Performance, {
            date,
            impressions,
            clicks,
            conversions,
            spend,
            revenue,
            additionalMetrics:
              Object.keys(additionalMetrics).length > 0
                ? additionalMetrics
                : undefined,
            campaign,
          });

          createdCount++;
        } else {
          this.logger.verbose(
            `Performance data for campaign ${campaign.name} on ${dateString} already exists, skipping`,
          );
        }
      }
    }

    this.logComplete('Performance', createdCount);
  }
}
