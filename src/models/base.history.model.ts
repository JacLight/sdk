import { BaseModel } from './base.model';

export interface BaseHistoryModel<T> extends BaseModel<T> {
  historyDate?: Date;
  sourceDatatype: string;
}
