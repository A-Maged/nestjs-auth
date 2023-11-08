import { Injectable } from '@nestjs/common';
import { CreateClientDTO } from './dtos/create-client.dto';
import { Client } from './entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './types';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
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
}