import { DataType } from "../types/datatype";

export interface BaseModel<T> {
  pk: string;
  sk: string;
  name: string;
  data?: T;
  isnew?: boolean,
  datatype?: DataType;
  audit?: AuditModel;
  workflow?: WorkflowModel;
  permission?: any;
}

export interface WorkflowModel {
  status?: number;
  statususer?: number;
  statusauthorizer?: number;
  statusdate?: Date;
}

export interface AuditModel {
  companypk: string;
  userpk: string;
  createdate: string;
  modifydate?: string;
}

const schema_audit = {
  type: 'object',
  properties: {
    companypk: {
      type: 'string',
      pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
    },
    userpk: {
      type: 'string',
      pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
    },
    createdate: {
      type: 'string',
    },
    modifydate: {
      type: 'string',
    },
  },
  required: ['companypk', 'userpk', 'createdate'],
};

const schema_workflow = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
    },
    statususer: {
      type: 'string',
      pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
    },
    statusauthorizer: {
      type: 'string',
    },
    statusdate: {
      type: 'string',
    },
  },
  required: ['status', 'statususer'],
};

export const schema = {
  type: 'object',
  properties: {
    pk: {
      type: 'string',
      pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
    },
    sk: {
      type: 'string',
      pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
    },
    name: {
      type: 'string',
      pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
    },
    datatype: {
      type: 'string',
      enum: DataType
    },
    isnew: {
      type: 'boolean'
    },
    audit: schema_audit,
    workflow: schema_workflow
  },
  required: ['pk', 'sk', 'name'],
};


