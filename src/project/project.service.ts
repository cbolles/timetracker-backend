import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Project } from './project.model';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/user.model';
import { ProjectCreate } from './project.dto';

@Injectable()
export class ProjectService {
  constructor(@InjectModel(Project.name) private readonly projectModel: Model<Project>) {}

  async create(projectCreate: ProjectCreate, user: User): Promise<Project> {
    return this.projectModel.create({ ...projectCreate, user: user._id });
  }

  /** Find a project for a user with the given project name */
  async findForUser(user: User, name: string): Promise<Project | null> {
    return this.projectModel.findOne({ user: user._id, name: name });
  }

}
