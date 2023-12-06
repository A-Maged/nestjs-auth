import { Injectable } from '@nestjs/common';
import { CreateClientDTO } from './dtos/create-client.dto';
import { Client } from './entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './types';
import { Photo } from './entities/photo.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async create(createClientDTO: CreateClientDTO) {
    const newClient = {
      ...createClientDTO,
      role: UserRole.client,
    };

    return this.clientRepository.save(newClient);
  }

  async findOneByEmail(email: Client['email']) {
    return this.clientRepository.findOneBy({ email });
  }

  async getPhotosUrls(clientId: Client['id']) {
    if (!clientId) {
      throw new Error('clientId is required');
    }

    return this.photoRepository.find({
      where: {
        client: {
          id: clientId,
        },
      },
    });
  }
}
