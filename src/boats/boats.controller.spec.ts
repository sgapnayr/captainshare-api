import { Test, TestingModule } from '@nestjs/testing';
import { BoatsController } from './boats.controller';
import { BoatsService } from './boats.service';
import { Boat } from './entities/boat.entity';

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
          },
        },
      ],
    }).compile();

    controller = module.get<BoatsController>(BoatsController);
    service = module.get<BoatsService>(
      BoatsService,
    ) as jest.Mocked<BoatsService>;
  });

  it('should create a boat', async () => {
    const boatDto = {
      name: 'Sea Breeze',
      type: 'Yacht',
      capacity: 10,
      location: 'Miami',
      licenseRequired: ['USCG'],
      certificationsRequired: ['AdvancedSailing'],
      ownerIds: ['owner123'],
      rateWillingToPay: 100,
    };

    const createdBoat: Boat = { ...boatDto, id: 'boat123' };
    service.create.mockReturnValue(createdBoat);

    const result = controller.create(boatDto);
    expect(result).toEqual(createdBoat);
    expect(service.create).toHaveBeenCalledWith(boatDto);
  });

  it('should get a boat by ID', async () => {
    const boat = {
      id: 'boat123',
      name: 'Sea Breeze',
      type: 'Yacht',
      capacity: 10,
      location: 'Miami',
      licenseRequired: ['USCG'],
      certificationsRequired: ['AdvancedSailing'],
      ownerIds: ['owner123'],
      rateWillingToPay: 100,
    };

    service.findOne.mockReturnValue(boat);

    const result = controller.findOne('boat123');
    expect(result).toEqual(boat);
    expect(service.findOne).toHaveBeenCalledWith('boat123');
  });

  it('should list all boats', async () => {
    const boats = [
      {
        id: 'boat1',
        name: 'Sea Breeze',
        type: 'Yacht',
        capacity: 10,
        location: 'Miami',
        licenseRequired: ['USCG'],
        certificationsRequired: ['AdvancedSailing'],
        ownerIds: ['owner1'],
        rateWillingToPay: 100,
      },
      {
        id: 'boat2',
        name: 'Ocean Explorer',
        type: 'Fishing Boat',
        capacity: 6,
        location: 'San Diego',
        licenseRequired: ['USCG', 'ProSailing'],
        certificationsRequired: ['ExpertSailing'],
        ownerIds: ['owner2'],
        rateWillingToPay: 150,
      },
    ];

    service.list.mockReturnValue(boats);

    const result = controller.list();
    expect(result).toEqual(boats);
    expect(service.list).toHaveBeenCalled();
  });

  it('should filter boats by captain qualifications', async () => {
    const filterDto = {
      certifications: ['AdvancedSailing'],
      licenses: ['USCG'],
    };
    const boats = [
      {
        id: 'boat1',
        name: 'Sea Breeze',
        type: 'Yacht',
        capacity: 10,
        location: 'Miami',
        licenseRequired: ['USCG'],
        certificationsRequired: ['AdvancedSailing'],
        ownerIds: ['owner1'],
        rateWillingToPay: 100,
      },
    ];

    service.filterByCaptain.mockReturnValue(boats);

    const result = await controller.filterByCaptain(filterDto);
    expect(result).toEqual(boats);
    expect(service.filterByCaptain).toHaveBeenCalledWith(
      filterDto.certifications,
      filterDto.licenses,
    );
  });
});
