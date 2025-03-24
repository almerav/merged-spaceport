import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { Campaign } from './entities/campaign.entity';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  findAll() {
    return this.campaignsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.campaignsService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Campaign>) {
    return this.campaignsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Campaign>) {
    return this.campaignsService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.campaignsService.delete(id);
  }
}
