import { BaseModel } from './base.model';

export interface BaseTrashModel<T> extends BaseModel<T> {
  publishDate?: Date;
  sourceDatatype: string;
}
