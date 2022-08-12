import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType, FieldType } from '../../types';
import { FileInfoSchema } from '../fileinfo';
import { PhoneSchema } from './crm-phone';
import { AddressSchema } from './crm-address';

export const ContactSchema = () => {
  return {
    type: 'object',
    properties: {
      parent: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.contact,
          value: 'sk',
          label: 'name',
        },
      },
      image: FileInfoSchema(),
      company: {
        type: 'string'
      },
      firstName: {
        type: 'string',
      },
      middleName: {
        type: 'string',
      },
      lastName: {
        type: 'string',
      },
      prefix: {
        type: 'string',
      },
      suffix: {
        type: 'string',
      },
      sex: {
        type: 'string',
      },
      birthday: {
        type: 'string',
      },
      facebook: {
        type: 'string',
      },
      jabbersn: {
        type: 'string',
      },
      skype: {
        type: 'string',
      },
      twitter: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
      employeeNumber: {
        type: 'string',
      },
      jobTitle: {
        type: 'string',
      },
      jobClass: {
        type: 'string',
      },
      hoursOfOperation: {
        type: 'string',
      },
      emails: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            status: { type: 'string', fieldType: FieldType.label }
          }
        }
      },
      phones: {
        type: 'array',
        items: PhoneSchema()
      },
      address: {
        type: 'array',
        items: AddressSchema(),

      },
    },
  } as const;
};

const dd = ContactSchema();
export type ContactModel = FromSchema<typeof dd>;

export const ContactUI = (): CollectionUI[] => { return null };
export const ContactRules = (): CollectionRule[] => { return null };
registerCollection('Contact', DataType.contact, ContactSchema(), ContactUI(), ContactRules())
