import { Module } from '@nestjs/common';
import { Project, ProjectActiveTime, ProjectActiveTimeSchema, ProjectSchema } from './project.model';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  providers: [ProjectService, ProjectResolver],
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: ProjectActiveTime.name, schema: ProjectActiveTimeSchema }
    ])
  ]
})
export class ProjectModule {}
