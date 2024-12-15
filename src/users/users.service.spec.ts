import { UsersService } from './users.service';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService();
  });

  it('should create a user successfully', () => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      roles: ['CAPTAIN' as 'CAPTAIN' | 'OWNER' | 'ADMIN'],
    };

    const createdUser = usersService.create(user);
    expect(createdUser).toBeDefined();
    expect(createdUser.email).toBe(user.email);
    expect(createdUser.id).toBeDefined();
  });

  it('should throw a ConflictException if email already exists', () => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      roles: ['CAPTAIN' as 'CAPTAIN' | 'OWNER' | 'ADMIN'],
    };

    usersService.create(user);
    expect(() => usersService.create(user)).toThrow(ConflictException);
  });

  it('should find a user by ID', () => {
    const user = usersService.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      roles: ['OWNER'],
    });

    const foundUser = usersService.findOne(user.id);
    expect(foundUser).toBeDefined();
    expect(foundUser.id).toBe(user.id);
  });

  it('should throw NotFoundException if user does not exist', () => {
    expect(() => usersService.findOne('non-existent-id')).toThrow(
      NotFoundException,
    );
  });

  it('should update a user successfully', () => {
    const user = usersService.create({
      firstName: 'Mark',
      lastName: 'Smith',
      email: 'mark.smith@example.com',
      roles: ['CAPTAIN'],
    });

    const updatedUser = usersService.update(user.id, {
      firstName: 'Updated Mark',
    });
    expect(updatedUser.firstName).toBe('Updated Mark');
  });

  it('should throw NotFoundException when updating a non-existent user', () => {
    expect(() =>
      usersService.update('non-existent-id', { firstName: 'Updated Name' }),
    ).toThrow(NotFoundException);
  });

  it('should throw BadRequestException for invalid role updates', () => {
    const user = usersService.create({
      firstName: 'Alice',
      lastName: 'Brown',
      email: 'alice.brown@example.com',
      roles: ['OWNER'],
    });

    expect(() =>
      usersService.update(user.id, { roles: ['INVALID_ROLE' as any] }),
    ).toThrow(BadRequestException);
  });

  it('should soft delete a user', () => {
    const user = usersService.create({
      firstName: 'Anna',
      lastName: 'Taylor',
      email: 'anna.taylor@example.com',
      roles: ['OWNER'],
    });

    usersService.delete(user.id);
    expect(() => usersService.findOne(user.id)).toThrow(NotFoundException);
  });

  it('should prevent updates to soft-deleted users', () => {
    const user = usersService.create({
      firstName: 'Soft Deleted',
      email: 'softdeleted@example.com',
      roles: ['CAPTAIN'],
    });

    usersService.delete(user.id);

    expect(() =>
      usersService.update(user.id, { firstName: 'Updated Name' }),
    ).toThrow(NotFoundException);
  });

  it('should return an empty list when no users match the filter', () => {
    usersService.create({
      firstName: 'John',
      email: 'john@example.com',
      roles: ['CAPTAIN'],
    });

    const result = usersService.list({ roles: ['OWNER'], isDeleted: false });
    expect(result).toEqual([]);
  });

  it('should exclude deleted users by default in list', () => {
    const user1 = usersService.create({
      firstName: 'Active User',
      email: 'active@example.com',
      roles: ['CAPTAIN'],
    });

    const user2 = usersService.create({
      firstName: 'Deleted User',
      email: 'deleted@example.com',
      roles: ['OWNER'],
    });

    usersService.delete(user2.id);
    const users = usersService.list();
    expect(users.length).toBe(1);
    expect(users[0].id).toBe(user1.id);
  });

  it('should return a paginated list of users', () => {
    for (let i = 0; i < 15; i++) {
      usersService.create({
        firstName: `User${i + 1}`,
        email: `user${i + 1}@example.com`,
        roles: ['CAPTAIN'],
      });
    }

    const page1 = usersService.listWithPagination({}, 1, 5);
    const page2 = usersService.listWithPagination({}, 2, 5);
    const page3 = usersService.listWithPagination({}, 4, 5);

    expect(page1.length).toBe(5);
    expect(page1[0].firstName).toBe('User1');
    expect(page2[0].firstName).toBe('User6');
    expect(page3.length).toBe(0);
  });

  it('should add availability for captains', () => {
    const captain = usersService.create({
      firstName: 'Captain',
      email: 'captain@example.com',
      roles: ['CAPTAIN'],
    });

    const availability = {
      day: 'Monday',
      startTime: '09:00',
      endTime: '17:00',
      validateTimeRange: function ():
        | true
        | 'endTime must be greater than startTime.' {
        const start = parseInt(this.startTime.replace(':', ''), 10);
        const end = parseInt(this.endTime.replace(':', ''), 10);
        return start < end || 'endTime must be greater than startTime.';
      },
    };

    const updatedUser = usersService.addAvailability(captain.id, availability);
    expect(updatedUser.availability).toContainEqual(availability);
  });

  it('should throw BadRequestException if non-CAPTAIN adds availability', () => {
    const user = usersService.create({
      firstName: 'Owner',
      email: 'owner@example.com',
      roles: ['OWNER'],
    });

    expect(() =>
      usersService.addAvailability(user.id, {
        day: 'Monday',
        startTime: '09:00',
        endTime: '17:00',
        validateTimeRange: function ():
          | true
          | 'endTime must be greater than startTime.' {
          throw new Error('Function not implemented.');
        },
      }),
    ).toThrow(BadRequestException);
  });

  it.skip('should update preferred captains for an owner', () => {
    const owner = usersService.create({
      firstName: 'Owner',
      lastName: 'User',
      email: 'owner@example.com',
      roles: ['OWNER'],
    });

    const captain1 = usersService.create({
      firstName: 'Captain1',
      lastName: 'User',
      email: 'captain1@example.com',
      roles: ['CAPTAIN'],
    });

    const captain2 = usersService.create({
      firstName: 'Captain2',
      lastName: 'User',
      email: 'captain2@example.com',
      roles: ['CAPTAIN'],
    });

    console.log('Captains created:', captain1, captain2);

    const updatedOwner = usersService.updatePreferredCaptains(owner.id, [
      captain1.id,
      captain2.id,
    ]);

    expect(updatedOwner.preferredCaptains).toEqual([captain1.id, captain2.id]);
  });

  it('should throw BadRequestException if a non-owner updates preferred captains', () => {
    const captain = usersService.create({
      firstName: 'Captain',
      email: 'captain@example.com',
      roles: ['CAPTAIN'],
    });

    expect(() =>
      usersService.updatePreferredCaptains(captain.id, ['some-owner-id']),
    ).toThrow(BadRequestException);
  });

  it('should query captains by availability and certifications', () => {
    const captain = usersService.create({
      firstName: 'Captain',
      email: 'captain@example.com',
      roles: ['CAPTAIN'],
      certifications: ['CPR', 'Boating Safety'],
      ratePerHour: 50,
      availability: [
        {
          day: 'Monday',
          startTime: '09:00',
          endTime: '17:00',
        },
      ],
    });

    const captains = usersService.queryCaptainsByAvailability(
      {
        day: 'Monday',
        startTime: '10:00',
        endTime: '11:00',
        validateTimeRange: function ():
          | true
          | 'endTime must be greater than startTime.' {
          throw new Error('Function not implemented.');
        },
      },
      ['CPR'],
      { min: 40, max: 60 },
    );

    expect(captains.length).toBe(1);
    expect(captains[0].id).toBe(captain.id);
  });
});
