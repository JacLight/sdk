import { registerCollection, registerDefaultData } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { ControlType, DataType } from '../../types';
import { FromSchema } from 'json-schema-to-ts';
import { FileInfoSchema } from '../fileinfo';

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
      status: {
        type: 'string',
        enum: ['new', 'sent', 'open', 'closed', 'cancelled', 'expired', 'failed'],
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
      submitMessage: {
        type: 'string',
        'x-control-variant': 'textarea',
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
      seo: {
        type: 'object',
        collapsible: 'close', // open, close, true
        properties: {
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          keywords: {
            type: 'string',
          },
          image: FileInfoSchema(),
        }
      },
      email: {
        type: 'object',
        collapsible: true,
        properties: {
          send: {
            type: 'boolean',
          },
          template: {
            type: 'string',
            group: 'notification',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'collection',
              collection: DataType.messagetemplate,
              label: 'name',
              value: 'name',
            }
          },
          message: {
            type: 'string',
            'x-control': ControlType.richtext,
            description: 'You can add template variables like {{data.$collection.$name}}, replace $collection with the collection name and $name with the field name',
          }
        }
      },
      sms: {
        type: 'object',
        collapsible: true,
        properties: {
          send: {
            type: 'boolean',
          },
          template: {
            type: 'string',
            group: 'notification',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'collection',
              collection: DataType.messagetemplate,
              label: 'name',
              value: 'name',
            }
          },
          message: {
            type: 'string',
            'x-control-variant': 'textarea',
            max: 160,
            description: 'You can add template variables like {{data.$collection.$name}}, replace $collection with the collection name and $name with the field name',
          }
        }
      },
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
