import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ActiveCampaign } from './entities/active-campaign.entity';
import { CreateActiveCampaignDto } from './dto/create-active-campaign.dto';

@Injectable()
export class ActiveCampaignService {
  constructor(
    @InjectRepository(ActiveCampaign)
    private readonly activeCampaignRepo: EntityRepository<ActiveCampaign>,
    private readonly em: EntityManager,
  ) { }

  async findAll() {
    return await this.activeCampaignRepo.findAll();
  }

  async findOne(id: string) {  // Change from number to string
    return await this.activeCampaignRepo.findOne({ id });
  }

  async create(data: CreateActiveCampaignDto) {
    try {
      const campaign = this.activeCampaignRepo.create({
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      });

      await this.em.persistAndFlush(campaign);
      return campaign;
    } catch (error) {
      console.error('Error creating campaign:', error); // Log full error
      throw new InternalServerErrorException(error.message); // Return real error message
    }
  }


  async update(id: string, data: Partial<ActiveCampaign>) {  // Change from number to string
    const activeCampaign = await this.findOne(id);
    if (!activeCampaign) throw new NotFoundException(`Campaign with ID ${id} not found`);

    this.activeCampaignRepo.assign(activeCampaign, data);
    await this.em.flush();
    return activeCampaign;
  }


  async delete(id: string): Promise<void> {
    const campaign = await this.activeCampaignRepo.findOne({ id }); // Fix findOne
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    await this.em.removeAndFlush(campaign);
  }

}
