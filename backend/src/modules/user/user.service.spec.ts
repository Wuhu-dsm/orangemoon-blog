import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { User, UserDocument } from './schemas/user.schema';
import {
  AdminUpdateUserDto,
  AdminUserRole,
  AdminUserStatus,
} from './dto/admin-update-user.dto';
import { UserService } from './user.service';

function createMockUser(overrides: Partial<User> = {}): UserDocument {
  return {
    _id: 'user-id',
    email: 'reader@example.com',
    username: 'reader',
    role: 'user',
    status: 'active',
    avatar: undefined,
    bio: undefined,
    location: undefined,
    website: undefined,
    socials: undefined,
    refreshTokenVersion: 0,
    level: 1,
    exp: 0,
    lastLoginAt: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as unknown as UserDocument;
}

interface MockQuery<T> {
  select: jest.Mock<MockQuery<T>, [string]>;
  sort: jest.Mock<MockQuery<T>, [Record<string, number>]>;
  skip: jest.Mock<MockQuery<T>, [number]>;
  limit: jest.Mock<MockQuery<T>, [number]>;
  exec: jest.Mock<Promise<T>, []>;
}

interface MockModelStatics {
  find: jest.Mock;
  findById: jest.Mock;
  findOne: jest.Mock;
  findOneAndUpdate: jest.Mock;
  findByIdAndUpdate: jest.Mock;
  countDocuments: jest.Mock;
}

type MockModel = jest.Mock & MockModelStatics;

function createMockQuery<T>(result: T): MockQuery<T> {
  const query = {
    select: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(result),
  } as MockQuery<T>;

  return query;
}

function createMockModel(): MockModel {
  const statics: MockModelStatics = {
    find: jest.fn().mockReturnValue(createMockQuery([])),
    findById: jest.fn().mockReturnValue(createMockQuery(null)),
    findOne: jest.fn().mockReturnValue(createMockQuery(null)),
    findOneAndUpdate: jest.fn().mockReturnValue(createMockQuery(null)),
    findByIdAndUpdate: jest.fn().mockReturnValue(createMockQuery(null)),
    countDocuments: jest.fn().mockReturnValue(createMockQuery(0)),
  };

  const constructor = jest.fn();
  Object.assign(constructor, statics);

  return constructor as MockModel;
}

describe('UserService', () => {
  let service: UserService;
  let model: MockModel;

  beforeEach(async () => {
    model = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('findAllAdmin', () => {
    it('excludes password from admin list responses', async () => {
      const users = [createMockUser()];
      const findQuery = createMockQuery(users);
      model.find.mockReturnValue(findQuery);
      model.countDocuments.mockReturnValue(createMockQuery(1));

      const result = await service.findAllAdmin({});

      expect(findQuery.select).toHaveBeenCalledWith('-password');
      expect(result.items).toEqual(users);
      expect(result.total).toBe(1);
    });

    it('filters users by status, role, and search', async () => {
      await service.findAllAdmin({
        status: AdminUserStatus.Banned,
        role: AdminUserRole.User,
        search: 'reader',
      });

      expect(model.find).toHaveBeenCalledWith({
        status: AdminUserStatus.Banned,
        role: AdminUserRole.User,
        $or: [
          { email: { $regex: 'reader', $options: 'i' } },
          { username: { $regex: 'reader', $options: 'i' } },
        ],
      });
    });
  });

  describe('updateAdmin', () => {
    it('updates user status and excludes password', async () => {
      const updated = createMockUser({ status: AdminUserStatus.Banned });
      const updateQuery = createMockQuery(updated);
      model.findByIdAndUpdate.mockReturnValue(updateQuery);

      const result = await service.updateAdmin('user-id', {
        status: AdminUserStatus.Banned,
      });

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        'user-id',
        { status: AdminUserStatus.Banned },
        { new: true, runValidators: true },
      );
      expect(updateQuery.select).toHaveBeenCalledWith('-password');
      expect(result.status).toBe(AdminUserStatus.Banned);
    });

    it('updates user role and excludes password', async () => {
      const updated = createMockUser({ role: AdminUserRole.Admin });
      model.findByIdAndUpdate.mockReturnValue(createMockQuery(updated));

      const result = await service.updateAdmin('user-id', {
        role: AdminUserRole.Admin,
      });

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        'user-id',
        { role: AdminUserRole.Admin },
        { new: true, runValidators: true },
      );
      expect(result.role).toBe(AdminUserRole.Admin);
    });

    it('throws when user is missing', async () => {
      model.findByIdAndUpdate.mockReturnValue(createMockQuery(null));

      await expect(
        service.updateAdmin('missing-id', {
          status: AdminUserStatus.Active,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('AdminUpdateUserDto', () => {
    it('rejects invalid status values', async () => {
      const dto = plainToInstance(AdminUpdateUserDto, {
        status: 'disabled',
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('status');
    });

    it('accepts allowed status and role values', async () => {
      const dto = plainToInstance(AdminUpdateUserDto, {
        status: AdminUserStatus.Active,
        role: AdminUserRole.Admin,
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });
});
