import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommentType, TaskPriority, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GuestLoginDto } from './dto/guest-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createGuest(dto: GuestLoginDto) {
    const suffix = crypto.randomUUID().slice(0, 8);
    const fullName = dto.fullName?.trim() || 'Dexter Morgan';
    const user = await this.prisma.user.create({
      data: {
        email: `guest-${suffix}@taskflow.local`,
        fullName,
        username: fullName.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20),
        title: 'Product designer',
        isGuest: true,
      },
    });
    const workspace = await this.prisma.workspace.create({
      data: { name: `${fullName.split(' ')[0]}'s Workspace`, ownerId: user.id },
    });
    const project = await this.prisma.project.create({
      data: { name: 'Website launch', workspaceId: workspace.id },
    });
    const labels = await Promise.all(
      [
        ['Design', '#5f6fef'],
        ['Development', '#1f9d72'],
        ['Deployment', '#e06a37'],
        ['Research', '#d3486c'],
      ].map(([name, color]) =>
        this.prisma.label.create({
          data: { name, color, workspaceId: workspace.id },
        }),
      ),
    );
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const taskSeeds = [
      {
        title: 'Finalize landing page direction',
        description:
          'Review the latest concepts and confirm the final visual direction before development begins.',
        status: TaskStatus.todo,
        priority: TaskPriority.high,
        dueDate: tomorrow,
        label: labels[0],
      },
      {
        title: 'Build responsive navigation',
        description:
          'Implement desktop and mobile navigation with accessible focus and menu states.',
        status: TaskStatus.doing,
        priority: TaskPriority.urgent,
        dueDate: nextWeek,
        label: labels[1],
      },
      {
        title: 'Map the guest onboarding flow',
        description: 'Document the minimum steps needed to enter and understand the workspace.',
        status: TaskStatus.doing,
        priority: TaskPriority.medium,
        dueDate: nextWeek,
        label: labels[3],
      },
      {
        title: 'Prepare production environment',
        description: 'Configure production environment variables and verify the deployment pipeline.',
        status: TaskStatus.on_hold,
        priority: TaskPriority.high,
        dueDate: nextWeek,
        label: labels[2],
      },
      {
        title: 'Approve product requirements',
        description: 'Requirements reviewed and approved by the launch team.',
        status: TaskStatus.completed,
        priority: TaskPriority.low,
        dueDate: tomorrow,
        label: labels[0],
      },
    ];

    for (const [position, seed] of taskSeeds.entries()) {
      const task = await this.prisma.task.create({
        data: {
          title: seed.title,
          description: seed.description,
          status: seed.status,
          priority: seed.priority,
          dueDate: seed.dueDate,
          position,
          projectId: project.id,
          reporterId: user.id,
          members: { connect: { id: user.id } },
          labels: { connect: { id: seed.label.id } },
          resourceLinks: [],
          teams: ['Launch team'],
        },
      });
      await this.prisma.comment.create({
        data: {
          taskId: task.id,
          authorId: user.id,
          content:
            seed.status === TaskStatus.completed
              ? 'marked this task as completed'
              : `set priority to ${seed.priority}`,
          type: CommentType.system_update,
        },
      });
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return { accessToken, user, workspace, project };
  }
}