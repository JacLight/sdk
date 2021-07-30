import { DataType } from '../types/datatype';

export interface BaseModelDTO<T> {
  page: number;
  pagesize: number;
  total: number;
  data: BaseModel<T>[];
}
export interface BaseModel<T> {
  pk: string;
  sk: string;
  name: string;
  data?: T;
  isnew?: boolean;
  datatype?: DataType | string;
  audit?: AuditModel;
  workflow?: WorkflowModel;
  post?: PostModel;
  permission?: any;
}


export interface WorkflowModel {
  status?: string;
  user?: string;
  date?: Date;
  history?: Omit<WorkflowModel, 'history'>[];
}

export interface AuditModel {
  company: string;
  user: string;
  group: string;
  createdate: string;
  modifydate?: string;
  publishstart?: Date,
  publishend?: Date
}
export interface PostModel {
  share?: boolean;
  indexing?: boolean;
  comment?: [];
  rating?: [];
  version?: string;
}