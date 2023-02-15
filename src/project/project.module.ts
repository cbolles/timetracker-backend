import { Module } from '@nestjs/common';
import {
  ActiveProject,
  ActiveProjectSchema,
  Project,
  ProjectActiveTime,
  ProjectActiveTimeSchema,
  ProjectSchema
} from './project.model';
import { ProjectActiveTimeResolver, ProjectResolver, ActiveProjectResolver } from './project.resolver';
import { ProjectService, ProjectActiveTimeService, ActiveProjectService } from './project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  providers: [
    ProjectService,
    ProjectResolver,
    ProjectActiveTimeService,
    ActiveProjectService,
    ProjectActiveTimeResolver,
    ActiveProjectResolver
  ],
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: ProjectActiveTime.name, schema: ProjectActiveTimeSchema },
      { name: ActiveProject.name, schema: ActiveProjectSchema }
    ])
  ]
})
export class ProjectModule {}
