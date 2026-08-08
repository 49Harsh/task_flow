import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentType, Prisma, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

const taskInclude = {
  members: true,
  labels: true,
  reporter: true,
  project: true,
  subtasks: { include: { members: true }, orderBy: { position: 'asc' as const } },
  comments: {
    include: { author: true },
    orderBy: { createdAt: 'asc' as const },
  },
} satisfies Prisma.TaskInclude;

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string, projectId?: string, status?: TaskStatus) {
    return this.prisma.task.findMany({
      where: {
        project: { workspace: { ownerId: userId } },
        ...(projectId ? { projectId } : {}),
        ...(status ? { status } : {}),
      },
      include: { members: true, labels: true, reporter: true, project: true },
      orderBy: [{ status: 'asc' }, { position: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, project: { workspace: { ownerId: userId } } },
      include: taskInclude,
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(userId: string, dto: CreateTaskDto) {
    await this.assertRelations(userId, dto.projectId, dto.labelIds, dto.memberIds);
    const status = dto.status ?? TaskStatus.todo;
    const aggregate = await this.prisma.task.aggregate({
      where: { projectId: dto.projectId, status },
      _max: { position: true },
    });
    return this.prisma.task.create({
      data: {
        title: dto.title.trim(),
        description: dto.description?.trim() ?? '',
        status,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        position: (aggregate._max.position ?? -1) + 1,
        projectId: dto.projectId,
        reporterId: userId,
        memberIds: dto.memberIds ?? [userId],
        labelIds: dto.labelIds ?? [],
        resourceLinks: dto.resourceLinks ?? [],
        teams: dto.teams ?? [],
      },
      include: { members: true, labels: true, reporter: true, project: true },
    });
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    const existing = await this.findOne(userId, id);
    const projectId = dto.projectId ?? existing.projectId;
    await this.assertRelations(userId, projectId, dto.labelIds, dto.memberIds);
    const data: Prisma.TaskUpdateInput = {
      title: dto.title?.trim(),
      description: dto.description?.trim(),
      status: dto.status,
      priority: dto.priority,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      resourceLinks: dto.resourceLinks,
      teams: dto.teams,
      ...(dto.projectId ? { project: { connect: { id: dto.projectId } } } : {}),
      ...(dto.memberIds ? { members: { set: dto.memberIds.map((memberId) => ({ id: memberId })) } } : {}),
      ...(dto.labelIds ? { labels: { set: dto.labelIds.map((labelId) => ({ id: labelId })) } } : {}),
    };
    const updated = await this.prisma.task.update({
      where: { id },
      data,
      include: taskInclude,
    });
    const changes: string[] = [];
    if (dto.status && dto.status !== existing.status) {
      changes.push(`changed status from ${existing.status} to ${dto.status}`);
    }
    if (dto.priority && dto.priority !== existing.priority) {
      changes.push(`changed priority from ${existing.priority} to ${dto.priority}`);
    }
    if (changes.length) {
      await this.prisma.comment.create({
        data: {
          taskId: id,
          authorId: userId,
          content: changes.join(' and '),
          type: CommentType.system_update,
        },
      });
    }
    return updated;
  }

  async updatePosition(userId: string, id: string, dto: UpdatePositionDto) {
    const task = await this.findOne(userId, id);
    const targetTasks = await this.prisma.task.findMany({
      where: { projectId: task.projectId, status: dto.status, id: { not: id } },
      orderBy: { position: 'asc' },
    });
    targetTasks.splice(Math.min(dto.position, targetTasks.length), 0, task);
    await Promise.all(
      targetTasks.map((item, index) =>
        this.prisma.task.update({
          where: { id: item.id },
          data: { status: dto.status, position: index },
        }),
      ),
    );
    if (task.status !== dto.status) {
      await this.prisma.comment.create({
        data: {
          taskId: id,
          authorId: userId,
          content: `moved this task from ${task.status} to ${dto.status}`,
          type: CommentType.system_update,
        },
      });
    }
    return this.findOne(userId, id);
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.comment.deleteMany({ where: { taskId: id } });
    await this.prisma.subtask.deleteMany({ where: { taskId: id } });
    await this.prisma.task.delete({ where: { id } });
    return { deleted: true };
  }

  async createSubtask(userId: string, taskId: string, dto: CreateSubtaskDto) {
    await this.findOne(userId, taskId);
    await this.assertMembers(userId, dto.memberIds);
    const aggregate = await this.prisma.subtask.aggregate({
      where: { taskId },
      _max: { position: true },
    });
    return this.prisma.subtask.create({
      data: {
        taskId,
        title: dto.title.trim(),
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        position: (aggregate._max.position ?? -1) + 1,
        memberIds: dto.memberIds ?? [userId],
      },
      include: { members: true },
    });
  }

  async updateSubtask(userId: string, id: string, dto: UpdateSubtaskDto) {
    const subtask = await this.findOwnedSubtask(userId, id);
    await this.assertMembers(userId, dto.memberIds);
    return this.prisma.subtask.update({
      where: { id: subtask.id },
      data: {
        title: dto.title?.trim(),
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        ...(dto.memberIds ? { members: { set: dto.memberIds.map((memberId) => ({ id: memberId })) } } : {}),
      },
      include: { members: true },
    });
  }

  async removeSubtask(userId: string, id: string) {
    await this.findOwnedSubtask(userId, id);
    await this.prisma.subtask.delete({ where: { id } });
    return { deleted: true };
  }

  private async findOwnedSubtask(userId: string, id: string) {
    const subtask = await this.prisma.subtask.findFirst({
      where: { id, task: { project: { workspace: { ownerId: userId } } } },
    });
    if (!subtask) throw new NotFoundException('Subtask not found');
    return subtask;
  }

  private async assertRelations(
    userId: string,
    projectId: string,
    labelIds?: string[],
    memberIds?: string[],
  ) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspace: { ownerId: userId } },
    });
    if (!project) throw new NotFoundException('Project not found');
    if (labelIds?.length) {
      const count = await this.prisma.label.count({
        where: { id: { in: labelIds }, workspace: { ownerId: userId } },
      });
      if (count !== new Set(labelIds).size) throw new NotFoundException('One or more labels not found');
    }
    await this.assertMembers(userId, memberIds);
  }

  private async assertMembers(userId: string, memberIds?: string[]) {
    if (!memberIds?.length) return;
    const allowedIds = new Set([userId]);
    if (memberIds.some((memberId) => !allowedIds.has(memberId))) {
      throw new NotFoundException('One or more members not found');
    }
  }
}