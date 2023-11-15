import { registerCollection, registerDefaultData } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType } from '../../types';
import { FromSchema } from 'json-schema-to-ts';

export const FormSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: 'uri',
      },
      application: {
        type: 'string',
      },
      type: {
        type: 'string',
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
