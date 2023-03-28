import { BaseModel } from './base.model';

export interface BaseHistoryModel<T> extends BaseModel<T> {
  hpk: string;
  hsk: string;
  hcreatedate?: Date;
}
