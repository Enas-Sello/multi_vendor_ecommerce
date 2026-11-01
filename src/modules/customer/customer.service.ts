import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema.js';
import type { UpdateProfileDto } from './customer.dto.js';

@Injectable()
export class CustomerService {
  constructor(@InjectModel(User.name) private readonly users: Model<User>) {}

  async profile(id: string) {
    const user = await this.users.findById(id).select('-passwordHash');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateProfileDto) {
    if (
      dto.email &&
      (await this.users.exists({
        email: dto.email.toLowerCase(),
        _id: { $ne: id },
      }))
    )
      throw new ConflictException('Email is already registered');
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

  async deactivate(id: string) {
    const user = await this.users
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .select('-passwordHash');
    if (!user) throw new NotFoundException('User not found');
    return { id: user.id, isActive: user.isActive };
  }
}
