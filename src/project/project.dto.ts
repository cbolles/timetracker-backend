import { BadRequestException, Inject, Injectable, PipeTransform, Scope} from '@nestjs/common';
import { CONTEXT, InputType, OmitType } from '@nestjs/graphql';
import { User } from '../user/user.model';
import { Project } from './project.model';
import { ProjectService } from './project.service';

@InputType({ description: 'Information required to make a new project' })
export class ProjectCreate extends OmitType(Project, ['_id', 'user'] as const, InputType) {}

/** Validates that the project is unique for the user */
@Injectable({ scope: Scope.REQUEST })
export class ProjectCreatePipe implements PipeTransform {
  constructor(@Inject(CONTEXT) private readonly context: any, private readonly projectService: ProjectService) {}

  async transform(value: ProjectCreate): Promise<ProjectCreate> {
    const user: User = this.context.req.user;

    // Verify no project exists for the user with the given name already
    const project = await this.projectService.findForUser(user, value.name);
    if (project !== null) {
      throw new BadRequestException(`Project already exists with the name ${value.name}`);
    }

    return value;
  }
}
