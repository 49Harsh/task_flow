import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtUser } from '../common/types/auth.types';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('tasks/:taskId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findForTask(@CurrentUser() user: JwtUser, @Param('taskId') taskId: string) {
    return this.commentsService.findForTask(user.userId, taskId);
  }

  @Post()
  create(
    @CurrentUser() user: JwtUser,
    @Param('taskId') taskId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(user.userId, taskId, dto);
  }
}
