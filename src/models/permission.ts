import { PermissionTypeContent, PermissionTypeComponent, FieldType, RoleType } from '../types';
import { FromSchema } from 'json-schema-to-ts';


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
        fieldType: FieldType.selectionmultiple,
        inputStyle: 'chip',
        dataSource: {
          source: 'json',
          json: Object.values(PermissionTypeContent)
        },
      },
      component: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        inputStyle: 'chip',
        dataSource: {
          source: 'json',
          json: Object.values(PermissionTypeComponent)
        },
      },
    },
  } as const;
};

export const PermissionSchema = () => {
  return {
    type: 'array',
    readonly: true,
    items: PermissionEntrySchema(),
  } as const
}


const ps = PermissionSchema();
const pes = PermissionEntrySchema();
export type PermissionModel = FromSchema<typeof ps>;
export type PermissionEntryModel = FromSchema<typeof pes>;