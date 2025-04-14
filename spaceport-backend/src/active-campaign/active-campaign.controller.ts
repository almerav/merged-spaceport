import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ActiveCampaignService } from './active-campaign.service';
import { CreateActiveCampaignDto } from './dto/create-active-campaign.dto';
import { UpdateActiveCampaignDto } from './dto/update-active-campaign.dto';

@Controller('active-campaigns')
export class ActiveCampaignController {
  constructor(private readonly activeCampaignService: ActiveCampaignService) {}

  @Get()
  findAll() {
    return this.activeCampaignService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Change from number to string
    return this.activeCampaignService.findOne(id);
  }

  @Post()
  create(@Body() createActiveCampaignDto: CreateActiveCampaignDto) {
    return this.activeCampaignService.create(createActiveCampaignDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateActiveCampaignDto: UpdateActiveCampaignDto,
  ) {
    // Change type
    return this.activeCampaignService.update(id, updateActiveCampaignDto);
  }

  @Delete(':id')
  async deleteCampaign(@Param('id') id: string) {
    return this.activeCampaignService.delete(id);
  }
}
