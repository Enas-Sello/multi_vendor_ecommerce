import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
import { Model } from 'mongoose';
import { User } from '../customer/user.schema.js';
import type { CreateUserDto, UpdateUserDto } from './admin.dto.js';
const scrypt = promisify(scryptCallback);

@Injectable()
export class AdminService {
  constructor(@InjectModel(User.name) private readonly users: Model<User>) {}
  list(excludeUserId: string) {
    return this.users
      .find({ _id: { $ne: excludeUserId } })
      .select('-passwordHash -refreshTokenHash -refreshTokenExpiresAt')
      .sort({ createdAt: -1 });
  }
  async create(dto: CreateUserDto) {
    const email = dto.email.toLowerCase().trim();
    if (await this.users.exists({ email }))
      throw new ConflictException('Email is already registered');
    const salt = randomBytes(16).toString('hex');
    const passwordHash = `${salt}:${((await scrypt(dto.password, salt, 64)) as Buffer).toString('hex')}`;
    try {
      const user = await this.users.create({
        name: dto.name.trim(),
        email,
        passwordHash,
        role: dto.role,
      });
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      };
    } catch (e) {
      if ((e as { code?: number }).code === 11000)
        throw new ConflictException('Email is already registered');
      throw e;
    }
  }
  async update(id: string, dto: UpdateUserDto) {
    const user = await this.users
      .findByIdAndUpdate(
        id,
        {
          $set: {
            ...dto,
            ...(dto.email ? { email: dto.email.toLowerCase() } : {}),
          },
        },
        { new: true, runValidators: true },
      )
      .select('-passwordHash');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async remove(id: string) {
    const user = await this.users.findByIdAndDelete(id).select('-passwordHash');
    if (!user) throw new NotFoundException('User not found');
    return { id: user.id, deleted: true };
  }
}
