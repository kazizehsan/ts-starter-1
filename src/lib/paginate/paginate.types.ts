import { Model, Document } from 'mongoose';
import { QueryResult, IOptions } from '@/lib/paginate/paginate.js';

export interface IProject {
  name: string;
  milestones: number;
}

export interface ITask {
  name: string;
  project: string;
}

export interface IProjectDoc extends IProject, Document {}
export interface ITaskDoc extends ITask, Document {}

export interface IProjectModel extends Model<IProjectDoc> {
  paginate(filter: Record<string, any>, options: IOptions): Promise<QueryResult<IProjectDoc>>;
}
export interface ITaskModel extends Model<ITaskDoc> {
  paginate(filter: Record<string, any>, options: IOptions): Promise<QueryResult<ITaskDoc>>;
}
