import {
  PermissionTypeContent,
  PermissionTypeComponent,
  ControlType,
  RoleType,
} from '../types';
import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../types';


import { registerCollection } from '../default-schema';

export const PermissionEntrySchema = () => {
  return {
    type: 'object',
    properties: {
      role: {
        type: 'string',
        enum: [...Object.values(RoleType)],
        disabled: true,
        hideLabel: true,
      },
      content: {
        type: 'string',
        hideLabel: true,
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'json',
          json: Object.values(PermissionTypeContent),
        },
      },
      component: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'json',
          json: Object.values(PermissionTypeComponent),
        },
      },
    },
  } as const;
};

export const PermissionSchema = () => {
  return {
    type: 'array',
    readOnly: true,
    items: PermissionEntrySchema(),
  } as const;
};

const ps = PermissionSchema();
const pes = PermissionEntrySchema();
export type PermissionModel = FromSchema<typeof ps>;
export type PermissionEntryModel = FromSchema<typeof pes>;
registerCollection(
  'Permission',
  DataType.permission,
  PermissionSchema()
);