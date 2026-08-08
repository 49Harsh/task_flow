import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.project.findMany({
      where: { workspace: { ownerId: userId } },
      include: { _count: { select: { tasks: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(userId: string, dto: CreateProjectDto) {
    const workspace = await this.prisma.workspace.findUnique({ where: { ownerId: userId } });
    if (!workspace) throw new NotFoundException('Workspace not found');
    return this.prisma.project.create({
      data: { name: dto.name.trim(), workspaceId: workspace.id },
    });
  }
}