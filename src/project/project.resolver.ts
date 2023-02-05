import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query, ResolveField, Parent, ID } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ProjectCreate, ProjectCreatePipe, ProjectPipe, ProjectTime } from './project.dto';
import { Project } from './project.model';
import { ActiveProjectService, ProjectService, ProjectActiveTimeService } from './project.service';
import { UserContext } from '../auth/user.decorator';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { UserPipe } from '../user/user.pipe';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService,
              private readonly userService: UserService,
              private readonly activeProjectService: ActiveProjectService) {}

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

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async setActiveProject(@Args('project', { type: () => ID }, ProjectPipe) project: Project): Promise<boolean> {
    await this.activeProjectService.setActive(project);
    return true;
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

/** Resolver for information on how long a project has been worked on */
@Resolver(() => ProjectTime)
export class ProjectActiveTimeResolver {
  constructor(private readonly activeTimeService: ProjectActiveTimeService,
              private readonly projectService: ProjectService) {}

  @Query(() => [ProjectTime])
  async getProjectTimeForUser(@Args('user', { type: () => ID }, UserPipe) user: User,
                              @Args('start') start: Date,
                              @Args('end') end: Date): Promise<ProjectTime[]> {
    return this.activeTimeService.getProjectTimeForUser(user, start, end);
  }

  @ResolveField(() => Project)
  async project(@Parent() projectTime: ProjectTime): Promise<Project> {
    const project = await this.projectService.findByID(projectTime.project);
    if (project === null) {
      throw new Error(`No valid project found for ID: ${projectTime.project}`);
    }
    return project;
  }
}
