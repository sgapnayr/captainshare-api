import { Test, TestingModule } from '@nestjs/testing';
import { BoatsService } from './boats.service';
import { CreateBoatDto } from './dto/create-boat.dto';

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
    const userId = 'owner123';
    const boatDto: CreateBoatDto = {
      name: 'Sea Breeze',
      type: 'Yacht',
      capacity: 10,
      location: 'Miami',
      licenseRequired: ['USCG'],
      captainShareCertificationsRequired: ['AdvancedSailing'],
      rateWillingToPay: 100,
      make: 'Yamaha',
      model: 'SX210',
      year: 2021,
      color: 'White',
      userRole: 'OWNER',
      userId,
    };

    const createdBoat = service.create(userId, boatDto);

    expect(createdBoat).toMatchObject({
      name: 'Sea Breeze',
      ownerIds: [userId],
    });
    expect(createdBoat.id).toBeDefined();
    expect(createdBoat.createdAt).toBeInstanceOf(Date);
  });

  it('should throw an error for duplicate boats', () => {
    const userId = 'owner123';
    const boatDto: CreateBoatDto = {
      name: 'Sea Breeze',
      type: 'Yacht',
      capacity: 10,
      location: 'Miami',
      licenseRequired: ['USCG'],
      captainShareCertificationsRequired: ['AdvancedSailing'],
      rateWillingToPay: 100,
      make: 'Yamaha',
      model: 'SX210',
      year: 2021,
      color: 'White',
      userRole: 'OWNER',
      userId,
    };

    service.create(userId, boatDto);

    expect(() => service.create(userId, boatDto)).toThrowError(
      'A boat with similar details already exists for this owner.',
    );
  });

  it('should find a boat by ID', () => {
    const userId = 'owner123';
    const boatDto: CreateBoatDto = {
      name: 'Ocean Explorer',
      type: 'Fishing Boat',
      capacity: 6,
      location: 'San Diego',
      licenseRequired: ['USCG'],
      captainShareCertificationsRequired: ['AdvancedSailing'],
      rateWillingToPay: 200,
      make: 'Boston Whaler',
      model: 'Montauk',
      year: 2020,
      color: 'Blue',
      userRole: 'OWNER',
      userId,
    };

    const createdBoat = service.create(userId, boatDto);

    const foundBoat = service.findOne(createdBoat.id);
    expect(foundBoat).toEqual(createdBoat);
  });

  it('should list all boats', () => {
    service.create('owner1', {
      name: 'Boat 1',
      type: 'Yacht',
      capacity: 10,
      location: 'Miami',
      licenseRequired: ['USCG'],
      captainShareCertificationsRequired: ['AdvancedSailing'],
      rateWillingToPay: 150,
      make: 'Yamaha',
      model: 'SX210',
      year: 2021,
      color: 'White',
      userRole: 'OWNER',
      userId: 'owner1',
    });

    service.create('owner2', {
      name: 'Boat 2',
      type: 'Fishing Boat',
      capacity: 6,
      location: 'San Diego',
      licenseRequired: ['USCG'],
      captainShareCertificationsRequired: ['ExpertSailing'],
      rateWillingToPay: 250,
      make: 'Boston Whaler',
      model: 'Montauk',
      year: 2020,
      color: 'Blue',
      userRole: 'OWNER',
      userId: 'owner2',
    });

    const boats = service.list();
    expect(boats.length).toBe(2);
  });

  it('should delete a boat', () => {
    const userId = 'owner123';
    const boatDto: CreateBoatDto = {
      name: 'Boat to Delete',
      type: 'Fishing Boat',
      capacity: 8,
      location: 'Key West',
      licenseRequired: ['USCG'],
      captainShareCertificationsRequired: ['AdvancedSailing'],
      rateWillingToPay: 180,
      make: 'Bayliner',
      model: 'Element E18',
      year: 2019,
      color: 'Red',
      userRole: 'OWNER',
      userId,
    };

    const createdBoat = service.create(userId, boatDto);

    const result = service.delete(createdBoat.id);
    expect(result).toBe(true);
    expect(() => service.findOne(createdBoat.id)).toThrowError(
      `Boat with ID ${createdBoat.id} not found.`,
    );
  });

  it('should filter boats by captain qualifications', () => {
    service.create('owner1', {
      name: 'Sea Breeze',
      type: 'Yacht',
      capacity: 10,
      location: 'Miami',
      licenseRequired: ['USCG'],
      captainShareCertificationsRequired: ['AdvancedSailing'],
      rateWillingToPay: 100,
      make: 'Yamaha',
      model: 'SX210',
      year: 2021,
      color: 'White',
      userRole: 'OWNER',
      userId: 'owner1',
    });

    service.create('owner2', {
      name: 'Ocean Explorer',
      type: 'Fishing Boat',
      capacity: 6,
      location: 'San Diego',
      licenseRequired: ['USCG', 'ProSailing'],
      captainShareCertificationsRequired: ['ExpertSailing'],
      rateWillingToPay: 150,
      make: 'Boston Whaler',
      model: 'Montauk',
      year: 2020,
      color: 'Blue',
      userRole: 'OWNER',
      userId: 'owner2',
    });

    const result = service.filterByCaptain(['AdvancedSailing'], ['USCG']);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Sea Breeze');
  });
});
