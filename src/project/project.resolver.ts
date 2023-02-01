import {UseGuards} from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import {JwtAuthGuard} from '../auth/jwt.guard';
import { ProjectCreate, ProjectCreatePipe } from './project.dto';
import { Project } from './project.model';
import { ProjectService } from './project.service';
import { UserContext } from '../auth/user.decorator';
import { User } from '../user/user.model';


@Resolver()
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation(() => Project)
  @UseGuards(JwtAuthGuard)
  async createProject(@Args('projectCreate', { type: () => ProjectCreate }, ProjectCreatePipe)
                      projectCreate: ProjectCreate,
                      @UserContext() user: User): Promise<Project> {
    return this.projectService.create(projectCreate, user)
  }
}
