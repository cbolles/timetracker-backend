import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query, ResolveField, Parent } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ProjectCreate, ProjectCreatePipe } from './project.dto';
import { Project } from './project.model';
import { ProjectService } from './project.service';
import { UserContext } from '../auth/user.decorator';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService, private readonly userService: UserService) {}

  @Mutation(() => Project)
  @UseGuards(JwtAuthGuard)
  async createProject(@Args('projectCreate', { type: () => ProjectCreate }, ProjectCreatePipe)
                      projectCreate: ProjectCreate,
                      @UserContext() user: User): Promise<Project> {
    return this.projectService.create(projectCreate, user)
  }

  @Query(() => [Project])
  @UseGuards(JwtAuthGuard)
  async getProjects(@UserContext() user: User): Promise<Project[]> {
    return this.projectService.findAllForUser(user);
  }

  @ResolveField()
  async user(@Parent() project: Project): Promise<User> {
    const user = await this.userService.findByID(project.user);
    if (user === null) {
      throw new Error(`No valid user found on project ${project._id}`);
    }
    return user;
  }
}
