import { Injectable } from '@nestjs/common';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Contribution } from './contribution.model';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectModel(Contribution)
    private contributionModel: typeof Contribution,
  ) {}

  create(_createContributionDto: CreateContributionDto) {
    return 'This action adds a new contribution';
  }

  findAll() {
    return `This action returns all contributions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contribution`;
  }

  findValidOneByCircuitIdAndParticipantId(circuitId: number, participantId: number) {
    return this.contributionModel.findOne({
      where: {
        circuitId: circuitId,
        participantId: participantId,
        valid: true,
      },
    });
  }

  update(id: number, _updateContributionDto: UpdateContributionDto) {
    return `This action updates a #${id} contribution`;
  }

  remove(id: number) {
    return `This action removes a #${id} contribution`;
  }
}
