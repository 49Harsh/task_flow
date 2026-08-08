import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtUser } from '../common/types/auth.types';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

class TaskQueryDto {
  @IsOptional()
  @IsMongoId()
  projectId?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('tasks')
  findAll(@CurrentUser() user: JwtUser, @Query() query: TaskQueryDto) {
    return this.tasksService.findAll(user.userId, query.projectId, query.status);
  }

  @Post('tasks')
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(user.userId, dto);
  }

  @Get('tasks/:id')
  findOne(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.tasksService.findOne(user.userId, id);
  }

  @Patch('tasks/:id')
  update(@CurrentUser() user: JwtUser, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(user.userId, id, dto);
  }

  @Patch('tasks/:id/position')
  updatePosition(
    @CurrentUser() user: JwtUser,
    @Param('id') id: string,
    @Body() dto: UpdatePositionDto,
  ) {
    return this.tasksService.updatePosition(user.userId, id, dto);
  }

  @Delete('tasks/:id')
  remove(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.tasksService.remove(user.userId, id);
  }

  @Post('tasks/:id/subtasks')
  createSubtask(
    @CurrentUser() user: JwtUser,
    @Param('id') id: string,
    @Body() dto: CreateSubtaskDto,
  ) {
    return this.tasksService.createSubtask(user.userId, id, dto);
  }

  @Patch('subtasks/:id')
  updateSubtask(
    @CurrentUser() user: JwtUser,
    @Param('id') id: string,
    @Body() dto: UpdateSubtaskDto,
  ) {
    return this.tasksService.updateSubtask(user.userId, id, dto);
  }

  @Delete('subtasks/:id')
  removeSubtask(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.tasksService.removeSubtask(user.userId, id);
  }
}