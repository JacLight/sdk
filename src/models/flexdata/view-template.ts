import { CollectionUI } from '../collection-ui';
import { ControlType, FormViewSectionType, } from '../../types';
import { FileInfoSchema } from '../fileinfo';
import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule } from '..';

export const FDViewTemplateSchema = () => {
  return {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        'x-control-variant': 'html',
        'x-control': ControlType.code,
        css: { height: '600px' },
        hideLabel: true,
      },
      component: {
        hidden: true,
        type: 'string',
      },
      config: {
        type: 'object',
        hidden: true,
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      usage: {
        type: 'array',
        items: {
          type: 'string',
        },
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'json',
          json: ['web', 'email', 'mobile'],
        },
      },
      source: {
        type: 'string',
        hidden: true,
      },
      image: FileInfoSchema(),
    },
  } as const;
};

export const FDViewTemplateUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.section2column,
      items: [
        {
          '0': '/properties/application',
        },
        {
          '0': '/properties/name',
          '1': '/properties/type',
        },
        {
          '0': '/properties/content',
        },
      ],
    },
  ];
};

export const FDViewTemplateRules = (): CollectionRule[] => {
  return [
    {
      name: 'Change Data Type',
      action: [
        {
          operation: 'setProperty',
          targetField: '/properties/content/properties/code/inputStyle',
          value: 'json',
        }
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: 'widget',
            field1: '/properties/type',
            operation: 'equal',
          },
        ],
      },
    },
    {
      name: 'Change Data Type',
      action: [
        {
          operation: 'setProperty',
          targetField: '/properties/content/properties/code/inputStyle',
          value: 'html',
        }
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: 'widget',
            field1: '/properties/type',
            operation: 'notEqual',
          },
        ],
      },
    },
  ];
};

const rt = FDViewTemplateSchema();
export type FDViewTemplateModel = FromSchema<typeof rt>;