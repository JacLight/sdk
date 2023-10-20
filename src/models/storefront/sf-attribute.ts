import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, FieldType, FormViewSectionType } from '../../types';

export const SFAttributeSchema = () => {
  return {
    type: 'object',
    properties: {
      parent: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_attribute,
          value: 'name',
          label: 'name',
        },
      },
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        transform: 'uri'
      },
      title: {
        type: 'string',
      },
      isFilter: {
        type: 'string',
      },
      filterPosition: {
        type: 'number',
      },
      options: {
        type: 'array',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            label: { type: 'string' },
            value: { type: 'string' },
            param: { type: 'string' },
          },
        },
      },
    },
  } as const;
};


export const SFAttributeUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.section2column,
      items: [
        {
          '0': '/properties/parent',
        },
        {
          '0': '/properties/name',
          '1': '/properties/title',
        },
        {
          '0': '/properties/isFilter',
          '1': '/properties/filterPosition',
        },
      ],
    },
    {
      type: FormViewSectionType.section2column,
      collapsible: true,
      items: [
        {
          '0': '/properties/options',
        },
      ],
    },
  ]
};

const ms = SFAttributeSchema();
export type SFAttributeModel = FromSchema<typeof ms>;

export const SFAttributeRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Store Attribute',
  DataType.sf_attribute,
  SFAttributeSchema(),
  SFAttributeUI(),
  SFAttributeRules(),
  true
);
