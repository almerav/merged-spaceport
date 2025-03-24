import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Campaign } from './entities/campaign.entity';
import { CampaignContent } from './entities/campaign-content.entity';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepo: EntityRepository<Campaign>,
    private readonly em: EntityManager,
  ) {}

  async findAll() {
    return await this.campaignRepo.findAll({ populate: ['contents', 'tags'] });
  }

  async findOne(id: number) {
    return await this.campaignRepo.findOne({ id: String(id) }, { populate: ['contents', 'tags'] });

  }

  async create(data: Partial<Campaign>) {
    const campaign = this.campaignRepo.create(data);
    await this.em.persistAndFlush(campaign);
    return campaign;
  }

  async update(id: number, data: Partial<Campaign>) {
    const campaign = await this.findOne(id);
    if (!campaign) throw new Error('Campaign not found');

    this.campaignRepo.assign(campaign, data);
    await this.em.flush();
    return campaign;
  }

  async delete(id: number) {
    await this.campaignRepo.nativeDelete({ id: String(id) });
}
}
