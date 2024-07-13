import { registerCollection, registerDefaultData } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { ControlType, DataType } from '../../types';
import { FromSchema } from 'json-schema-to-ts';

export const FormSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['random-string::10'],
        group: 'name',
      },
      accessCode: {
        type: 'string',
        group: 'name',
      },
      startDate: {
        type: 'string',
        format: 'date-time',
        group: 'date',
      },
      endDate: {
        type: 'string',
        format: 'date-time',
        group: 'date',
      },
      title: {
        type: 'string',
      },
      collection: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.collection,
          label: 'name',
          value: 'name',
          filter: {
            property: 'type',
            operation: 'equal',
            value: 'Defined',
          }
        }
      },
      participants: {
        type: 'array',
        collapsible: true,
        description: "List of places in the document where signatures are required",
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            email: {
              type: 'string',
              format: 'email',
            },
            name: {
              type: 'string',
            },
            accessCode: {
              type: 'string',
              styleClass: 'w-20'
            },
            role: {
              type: 'string',
              styleClass: 'w-20'
            },
          },
        },
      },
      status: {
        type: 'string',
        enum: ['new', 'open', 'closed', 'cancelled'],
      }
    },
  } as const;
};

const dd = FormSchema();
export type FormModel = FromSchema<typeof dd>;

export const FormUI = (): CollectionUI[] => {
  return null;
};

export const FormRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'CrmForm',
  DataType.form,
  FormSchema(),
  FormUI(),
  FormRules(),
  true,
  true
);

const genDefaultData = () => {
  return { status: 'new', priority: 'low', severity: 'minor', stage: 0 };
};

registerDefaultData(DataType.form, genDefaultData);
