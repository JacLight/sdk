import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';
import { ComponentName, DataType, FieldType, FormViewSectionType } from '../types';
import { registerCollection } from '../defaultschema';
import { FileInfoSchema } from './fileinfo';

export const FlexDataSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 50,
      },
      application: {
        type: 'string',
        enum: Object.values(ComponentName)
      },
      type: {
        type: 'string',
      },
      content: {
        type: 'object',
        properties: {

        }
      }
    },
    required: ['name', 'application']
  } as const;
};

export const FlexDataViewTemplateSchema = () => {
  return {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        inputStyle: 'html',
        fieldType: FieldType.code,
        css: { height: '600px' },
        hideLabel: true
      },
      usage: {
        type: 'array',
        items: {
          type: 'string'
        },
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'json',
          json: ['web', 'email', 'mobile']
        },
      },
      source: {
        type: 'string',
        hidden: true
      },
      image: FileInfoSchema(),
    },
  } as const;
};


export const FlexDataViewTemplateUI = (): CollectionUI[] => {
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


const rt = FlexDataSchema();
export type FlexStoreModel = FromSchema<typeof rt>;

export const FlexDataUI = (): CollectionUI[] => { return null };
export const FlexDataRules = (): CollectionRule[] => { return [] };
registerCollection('FlexData', DataType.flexdata, FlexDataSchema(), FlexDataUI(), FlexDataRules(), false, true);
