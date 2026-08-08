import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async findCurrent(userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { ownerId: userId },
      include: { projects: { orderBy: { createdAt: 'asc' } } },
    });
    if (!workspace) throw new NotFoundException('Workspace not found');
    return workspace;
  }
}