import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import * as request from 'supertest';
import { TripStatus } from './entities/trip.entity';
import { NotFoundException } from '@nestjs/common';

describe('TripsController', () => {
  let app: INestApplication;
  let service: TripsService;

  const mockTrip = {
    id: '1',
    boatId: 'boat1',
    ownerId: 'owner1',
    captainId: 'captain1',
    status: TripStatus.PROPOSED,
    bookingType: 'OWNER_TRIP',
    createdAt: new Date('2024-12-14T23:50:03.547Z').toISOString(), // Convert Date to ISO string
    updatedAt: new Date('2024-12-14T23:50:03.547Z').toISOString(), // Convert Date to ISO string
    location: { latitude: 30.2672, longitude: -97.7431 },
  };

  const mockCreateTripDto = {
    boatId: 'boat1',
    ownerId: 'owner1',
    bookingType: 'OWNER_TRIP',
    startTime: '2024-12-10T10:00:00Z',
    endTime: '2024-12-10T12:00:00Z',
    location: { latitude: 30.2672, longitude: -97.7431 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripsController],
      providers: [
        {
          provide: TripsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockTrip),
            findOne: jest.fn().mockResolvedValue(mockTrip),
            update: jest.fn().mockResolvedValue(mockTrip),
            delete: jest.fn().mockResolvedValue(undefined),
            assignCaptain: jest.fn().mockResolvedValue(mockTrip),
            handleCounterOffer: jest.fn().mockResolvedValue(mockTrip),
            updateStatus: jest.fn().mockResolvedValue(mockTrip),
            filter: jest.fn().mockResolvedValue([mockTrip]),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    service = module.get<TripsService>(TripsService);
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('POST /trips', () => {
    it('should create a new trip', async () => {
      const response = await request(app.getHttpServer())
        .post('/trips')
        .send(mockCreateTripDto)
        .expect(201);

      expect(response.body).toEqual(mockTrip);
    });

    it('should handle errors on create', async () => {
      service.create = jest
        .fn()
        .mockRejectedValue(new Error('Internal Server Error'));

      const response = await request(app.getHttpServer())
        .post('/trips')
        .send(mockCreateTripDto)
        .expect(500);

      expect(response.body.message).toBe(
        'Error occurred while creating the trip.',
      );
    });

    it('should return a 404 if trip not found', async () => {
      service.findOne = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Trip not found'));

      const response = await request(app.getHttpServer())
        .get('/trips/1')
        .expect(404);

      expect(response.body.message).toBe('Trip not found.');
    });

    it('should return a 404 if trip not found on delete', async () => {
      service.delete = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Trip not found'));

      const response = await request(app.getHttpServer())
        .delete('/trips/1')
        .expect(404);

      expect(response.body.message).toBe('Trip with ID 1 not found.');
    });
  });

  describe('GET /trips/:id', () => {
    it('should return a trip by id', async () => {
      const response = await request(app.getHttpServer())
        .get('/trips/1')
        .expect(200);

      expect(response.body).toEqual(mockTrip);
    });

    it('should return a 404 if trip not found', async () => {
      service.findOne = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Trip not found'));

      const response = await request(app.getHttpServer())
        .get('/trips/1')
        .expect(404);

      expect(response.body.message).toBe('Trip not found.');
    });
  });

  describe('DELETE /trips/:id', () => {
    it('should delete a trip', async () => {
      const response = await request(app.getHttpServer())
        .delete('/trips/1')
        .expect(200);

      // Assuming deletion returns nothing, you can check for an empty response
      expect(response.body).toEqual({});
    });

    it('should return a 404 if trip not found', async () => {
      service.delete = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Trip not found'));

      const response = await request(app.getHttpServer())
        .delete('/trips/1')
        .expect(404);

      expect(response.body.message).toBe('Trip with ID 1 not found.');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
