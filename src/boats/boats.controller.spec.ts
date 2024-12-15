import { Test, TestingModule } from '@nestjs/testing';
import { BoatsController } from './boats.controller';
import { BoatsService } from './boats.service';
import { Boat } from './entities/boat.entity';
import { CreateBoatDto } from './dto/create-boat.dto';

describe('BoatsController', () => {
  let controller: BoatsController;
  let service: jest.Mocked<BoatsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoatsController],
      providers: [
        {
          provide: BoatsService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            list: jest.fn(),
            delete: jest.fn(),
            filterByCaptain: jest.fn(),
            updatePreferredCaptains: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BoatsController>(BoatsController);
    service = module.get<BoatsService>(
      BoatsService,
    ) as jest.Mocked<BoatsService>;
  });

  it('should create a boat', () => {
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
      commercialUse: false,
      hin: undefined,
      userRole: 'OWNER',
      userId: 'owner123', // Ensure userId is set here
    };

    const createdBoat: Boat = {
      ...boatDto,
      id: 'boat123',
      ownerIds: [boatDto.userId],
      createdAt: new Date(),
      updatedAt: new Date(),
      commercialUse: false,
    };

    service.create.mockReturnValue(createdBoat);

    const result = controller.create(boatDto);
    expect(result).toEqual(createdBoat);
    expect(service.create).toHaveBeenCalledWith(boatDto.userId, boatDto);
  });

  it('should get a boat by ID', () => {
    const boat: Boat = {
      id: 'boat123',
      name: 'Sea Breeze',
      type: 'Yacht',
      capacity: 10,
      location: 'Miami',
      licenseRequired: ['USCG'],
      captainShareCertificationsRequired: ['AdvancedSailing'],
      ownerIds: ['owner123'],
      rateWillingToPay: 100,
      make: 'Yamaha',
      model: 'SX210',
      year: 2021,
      color: 'White',
      createdAt: new Date(),
      updatedAt: new Date(),
      commercialUse: false,
    };

    service.findOne.mockReturnValue(boat);

    const result = controller.findOne('boat123');
    expect(result).toEqual(boat);
    expect(service.findOne).toHaveBeenCalledWith('boat123');
  });

  it('should list all boats', () => {
    const boats: Boat[] = [
      {
        id: 'boat1',
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
        ownerIds: ['owner1'],
        createdAt: new Date(),
        updatedAt: new Date(),
        commercialUse: false,
      },
      {
        id: 'boat2',
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
        ownerIds: ['owner2'],
        createdAt: new Date(),
        updatedAt: new Date(),
        commercialUse: false,
      },
    ];

    service.list.mockReturnValue(boats);

    const result = controller.list();
    expect(result).toEqual(boats);
    expect(service.list).toHaveBeenCalled();
  });

  it('should delete a boat', () => {
    const boatId = 'boat123';
    const userId = 'owner123';
    const boat: Boat = {
      id: boatId,
      name: 'Boat to Delete',
      type: 'Fishing Boat',
      capacity: 8,
      location: 'Key West',
      licenseRequired: ['USCG'],
      captainShareCertificationsRequired: ['AdvancedSailing'],
      ownerIds: [userId],
      rateWillingToPay: 180,
      make: 'Bayliner',
      model: 'Element E18',
      year: 2019,
      color: 'Red',
      createdAt: new Date(),
      updatedAt: new Date(),
      commercialUse: false,
    };

    service.findOne.mockReturnValue(boat);
    service.delete.mockReturnValue(true);

    const result = controller.delete(boatId, userId);
    expect(result).toBe(true);
    expect(service.findOne).toHaveBeenCalledWith(boatId);
    expect(service.delete).toHaveBeenCalledWith(boatId);
  });

  it('should update preferred captains for a boat', () => {
    const boatId = 'boat123';
    const captains = ['captain1', 'captain2'];
    const userId = 'owner123';

    const updatedBoat: Boat = {
      id: boatId,
      name: 'Sea Breeze',
      type: 'Yacht',
      capacity: 10,
      location: 'Miami',
      licenseRequired: ['USCG'],
      captainShareCertificationsRequired: ['AdvancedSailing'],
      ownerIds: [userId],
      rateWillingToPay: 100,
      make: 'Yamaha',
      model: 'SX210',
      year: 2021,
      color: 'White',
      preferredCaptains: captains,
      createdAt: new Date(),
      updatedAt: new Date(),
      commercialUse: false,
    };

    service.findOne.mockReturnValue(updatedBoat);
    service.updatePreferredCaptains.mockReturnValue(updatedBoat);

    const result = controller.updatePreferredCaptains(boatId, {
      captains,
      userId,
    });

    expect(result).toEqual(updatedBoat);
    expect(service.findOne).toHaveBeenCalledWith(boatId);
    expect(service.updatePreferredCaptains).toHaveBeenCalledWith(
      boatId,
      captains,
    );
  });
});
