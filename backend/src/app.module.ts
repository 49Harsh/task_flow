import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { GuestAuthGuard } from './common/guards/guest-auth.guard';
import { HealthModule } from './health/health.module';
import { LabelsModule } from './labels/labels.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    WorkspacesModule,
    ProjectsModule,
    TasksModule,
    LabelsModule,
    CommentsModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GuestAuthGuard,
    },
  ],
})
export class AppModule {}
