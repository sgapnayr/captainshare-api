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
      certificationsRequired: ['AdvancedSailing'],
      ownerIds: ['owner123'],
      rateWillingToPay: 100,
    };

    const createdBoat = service.create(boat);
    expect(createdBoat).toMatchObject(boat);
    expect(createdBoat.id).toBeDefined();
  });

  it('should throw an error when creating a duplicate boat for the same owner', () => {
    const boat: Partial<Boat> = {
      name: 'Sea Breeze',
      type: 'Yacht',
      capacity: 10,
      location: 'Miami',
      licenseRequired: ['USCG'],
      certificationsRequired: ['AdvancedSailing'],
      ownerIds: ['owner123'],
      rateWillingToPay: 100,
    };

    service.create(boat);

    expect(() => service.create(boat)).toThrowError(
      'Boat with the same name already exists for this owner.',
    );
  });

  it('should find a boat by ID', () => {
    const boat = service.create({
      name: 'Ocean Explorer',
      type: 'Fishing Boat',
      capacity: 6,
      location: 'San Diego',
      licenseRequired: ['USCG'],
      certificationsRequired: ['AdvancedSailing'],
      ownerIds: ['owner456'],
      rateWillingToPay: 200,
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
      licenseRequired: ['USCG'],
      certificationsRequired: ['AdvancedSailing'],
      ownerIds: ['owner123'],
      rateWillingToPay: 150,
    });

    service.create({
      name: 'Boat 2',
      type: 'Fishing Boat',
      capacity: 6,
      location: 'San Diego',
      licenseRequired: ['USCG'],
      certificationsRequired: ['ExpertSailing'],
      ownerIds: ['owner456'],
      rateWillingToPay: 250,
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
      licenseRequired: ['USCG'],
      certificationsRequired: ['AdvancedSailing'],
      ownerIds: ['owner789'],
      rateWillingToPay: 180,
    });

    const result = service.delete(boat.id);
    expect(result).toBe(true);
    expect(service.findOne(boat.id)).toBeUndefined();
  });

  it('should filter boats by captain qualifications', () => {
    service.create({
      name: 'Sea Breeze',
      type: 'Yacht',
      capacity: 10,
      location: 'Miami',
      licenseRequired: ['USCG'],
      certificationsRequired: ['AdvancedSailing'],
      ownerIds: ['owner1'],
      rateWillingToPay: 100,
    });

    service.create({
      name: 'Ocean Explorer',
      type: 'Fishing Boat',
      capacity: 6,
      location: 'San Diego',
      licenseRequired: ['USCG', 'ProSailing'],
      certificationsRequired: ['ExpertSailing'],
      ownerIds: ['owner2'],
      rateWillingToPay: 150,
    });

    const result = service.filterByCaptain(['AdvancedSailing'], ['USCG']);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Sea Breeze');
  });
});
