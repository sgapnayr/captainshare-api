import { Test, TestingModule } from '@nestjs/testing';
import { BoatsService } from './boats.service';
import { Boat } from './entities/boat.entity';

describe('BoatsService', () => {
  let service: BoatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoatsService],
    }).compile();

    service = module.get<BoatsService>(BoatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a boat', () => {
    const boat: Partial<Boat> = {
      name: 'Sea Breeze',
      type: 'Yacht',
      capacity: 10,
      location: 'Miami',
      licenseRequired: ['USCG'],
      ownerIds: ['owner123'],
    };

    const createdBoat = service.create(boat);
    expect(createdBoat).toMatchObject(boat);
    expect(createdBoat.id).toBeDefined();
  });

  it('should find a boat by ID', () => {
    const boat = service.create({
      name: 'Ocean Explorer',
      type: 'Fishing Boat',
      capacity: 6,
      location: 'San Diego',
      licenseRequired: ['USCG'],
      ownerIds: ['owner456'],
    });

    const foundBoat = service.findOne(boat.id);
    expect(foundBoat).toEqual(boat);
  });

  it('should list all boats', () => {
    service.create({
      name: 'Boat 1',
      type: 'Yacht',
      capacity: 10,
      location: 'Miami',
      ownerIds: ['owner123'],
    });
    service.create({
      name: 'Boat 2',
      type: 'Fishing Boat',
      capacity: 6,
      location: 'San Diego',
      ownerIds: ['owner456'],
    });

    const boats = service.list();
    expect(boats.length).toBe(2);
  });

  it('should delete a boat', () => {
    const boat = service.create({
      name: 'Boat to Delete',
      type: 'Fishing Boat',
      capacity: 8,
      location: 'Key West',
      ownerIds: ['owner789'],
    });

    const result = service.delete(boat.id);
    expect(result).toBe(true);
    expect(service.findOne(boat.id)).toBeUndefined();
  });
});
