import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtUser } from '../common/types/auth.types';
import { WorkspacesService } from './workspaces.service';

@Controller('workspace')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  findCurrent(@CurrentUser() user: JwtUser) {
    return this.workspacesService.findCurrent(user.userId);
  }
}