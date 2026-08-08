import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.findMe(userId);
    return this.prisma.user.update({ where: { id: userId }, data: dto });
  }

  async updateSettings(userId: string, dto: UpdateSettingsDto) {
    await this.findMe(userId);
    return this.prisma.user.update({ where: { id: userId }, data: dto });
  }
}