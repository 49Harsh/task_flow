import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabelDto } from './dto/create-label.dto';

@Injectable()
export class LabelsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.label.findMany({
      where: { workspace: { ownerId: userId } },
      orderBy: { name: 'asc' },
    });
  }

  async create(userId: string, dto: CreateLabelDto) {
    const workspace = await this.prisma.workspace.findUnique({ where: { ownerId: userId } });
    if (!workspace) throw new NotFoundException('Workspace not found');
    const duplicate = await this.prisma.label.findFirst({
      where: { workspaceId: workspace.id, name: dto.name.trim() },
    });
    if (duplicate) throw new ConflictException('A label with this name already exists');
    return this.prisma.label.create({
      data: { name: dto.name.trim(), color: dto.color, workspaceId: workspace.id },
    });
  }
}