import { BaseModel } from './base.model';

export interface BasePublishModel<T> extends BaseModel<T> {
  publishDate?: Date;
  sourceDatatype: string;
}
