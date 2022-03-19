import { PermissionTypeContent, PermissionTypeComponent, FieldType } from '../types';
import { FromSchema } from 'json-schema-to-ts';


export const PermissionSchema = () => {
  return {
    type: 'object',
    properties: {
      'role': {
        type: 'object',
        properties: {
          content: {
            type: 'array',
            dataSource: {
              source: 'json',
              json: Object.values(PermissionTypeContent)
            },
            fieldType: FieldType.selectionmultiple,
            items: {
              type: 'string'
            }
          },
          component: {
            type: 'array',
            dataSource: {
              source: 'json',
              json: Object.values(PermissionTypeComponent)
            },
            fieldType: FieldType.selectionmultiple,
            items: {
              type: 'string'
            }
          }
        }
      }
    }
  } as const
}


const pes = PermissionSchema();
export type PermissionModel = FromSchema<typeof pes>;