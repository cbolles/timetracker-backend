import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ActiveProject, Project, ProjectActiveTime } from './project.model';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/user.model';
import { ProjectCreate } from './project.dto';
import mongoose from 'mongoose';

@Injectable()
export class ProjectService {
  constructor(@InjectModel(Project.name) private readonly projectModel: Model<Project>) {}

  async create(projectCreate: ProjectCreate, user: User): Promise<Project> {
    return this.projectModel.create({ ...projectCreate, user: user._id });
  }

  async findByID(projectID: mongoose.Types.ObjectId): Promise<Project | null> {
    return await this.projectModel.findById(projectID);
  }

  /** Find a project for a user with the given project name */
  async findForUser(user: User, name: string): Promise<Project | null> {
    return this.projectModel.findOne({ user: user._id, name: name });
  }

  async findAllForUser(user: User): Promise<Project[]> {
    return this.projectModel.find({ user: user._id });
  }
}

@Injectable()
export class ProjectActiveTimeService {
  constructor(@InjectModel(ProjectActiveTime.name) private readonly projectTimeModel: Model<ProjectActiveTime>) {}

  async updateProjectTime(activeProject: ActiveProject): Promise<void> {
    const accumulatedTime = Date.now() - activeProject.activeStart.getTime();

    // Try to find existing data for the current day
    const day = this.getCurrentDay();
    const existingData = await this.projectTimeModel.findOne({
      user: activeProject.user,
      project: activeProject.project,
      day
    });

    // If there is existing data update it
    if (existingData) {
      await this.projectTimeModel.updateOne({ _id: existingData._id},
                                            { $set: { time: existingData.time + accumulatedTime } });
      return;
    }

    // Otherwise make new data
    await this.projectTimeModel.create({
      project: activeProject.project,
      user: activeProject.user,
      day: day,
      time: accumulatedTime
    });
  }

  private getCurrentDay(): Date {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }
}

@Injectable()
export class ActiveProjectService {
  constructor(@InjectModel(ActiveProject.name) private readonly activeProjectModel: Model<ActiveProject>,
              private readonly activeTimeService: ProjectActiveTimeService) {}

  async getActiveProject(user: mongoose.Types.ObjectId): Promise<ActiveProject | null> {
    return this.activeProjectModel.findOne({ user });
  }

  async setActive(project: Project): Promise<void> {
    // Get the current active project
    const activeProject = await this.getActiveProject(project.user);

    // If there is an active project, save the active project time for the day
    if (activeProject !== null) {
      // Accumulate the time
      await this.activeTimeService.updateProjectTime(activeProject);

      // Remove the current active time from the database
      await this.activeProjectModel.deleteOne({ _id: activeProject._id });
    }

    // Make a new active project entry for the current time
    await this.activeProjectModel.create({
      project: project._id,
      user: project.user._id,
      activeStart: new Date()
    });
  }
}
