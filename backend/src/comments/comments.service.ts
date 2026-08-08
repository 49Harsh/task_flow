import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findForTask(userId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, project: { workspace: { ownerId: userId } } },
    });
    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.comment.findMany({
      where: { taskId },
      include: { author: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(userId: string, taskId: string, dto: CreateCommentDto) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, project: { workspace: { ownerId: userId } } },
    });
    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.comment.create({
      data: {
        taskId,
        authorId: userId,
        content: dto.content.trim(),
        type: CommentType.comment,
      },
      include: { author: true },
    });
  }
}
