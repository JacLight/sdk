import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule, CollectionUI } from './collection';
import { DataType, FieldType, FormViewSectionType } from '../types';
import { ImageSchema } from './image';

export const SiteSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
        inputStyle: 'textarea',
      },
      keywords: {
        type: 'string',
      },
      robots: {
        type: 'string',
      },
      currency: {
        type: 'string',
      },
      currencies: {
        type: 'string',
      },
      defaulanguage: {
        type: 'string',
      },
      languages: {
        type: 'string',
      },
      hostname: {
        type: 'string',
        format: 'hostname',
      },
      icon: {
        type: 'string',
        format: 'uri',
      },
      logo: ImageSchema(),
      mainNavigation: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.navigation,
          field: 'name',
        },
      },
      footerNavigation: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.navigation,
          field: 'name',
        },
      },
      facebook: SocialSchema('Facebook'),
      twitter: SocialSchema('Twitter'),
      instagram: SocialSchema('Instagram'),
      youtube: SocialSchema('Youtube'),
      tiktok: SocialSchema('Tiktok'),
      spanProtectionComment: {
        description: 'Enable Google reCAPTCHA on contact and comment forms',
        type: 'boolean',
        inputStyle: 'switch',
        displayStyle: 'card',
      },
      spamProtectionUser: {
        description:
          'Enable Google reCAPTCHA on login, create account and password recovery pages',
        type: 'boolean',
        inputStyle: 'switch',
        displayStyle: 'card',
      },
    },
  } as const;
};

export const SocialSchema = (name: string) => {
  return {
    type: 'object',
    name: name,
    title: name,
    collapsible: true,
    displayStyle: 'card',
    properties: {
      apiKey: {
        type: 'string',
      },
      apiSecret: {
        type: 'string',
      },
    },
  } as const;
};

export const SiteUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.sectiontab,
      tab: [
        {
          title: 'Site Info',
          items: [
            {
              '0': '/properties/name',
              '1': '/properties/title',
            },
            {
              '0': '/properties/currency',
              '1': '/properties/language',
            },
            {
              '0': '/properties/currencies',
              '1': '/properties/languages',
            },
            {
              '0': '/properties/mainNavigation',
              '1': '/properties/footerNavigation',
            },
            {
              '0': '/properties/description',
            },
            {
              '0': '/properties/keywords',
            },
            {
              '0': '/properties/robots',
            },
            {
              '0': '/properties/hostname',
            },
            {
              '0': '/properties/icon',
            },
            {
              '0': '/properties/logo',
            },
          ],
        },
        {
          title: 'Social Links',
          items: [
            {
              '0': '/properties/facebook',
            },
            {
              '0': '/properties/twitter',
            },
            {
              '0': '/properties/instagram',
            },
            {
              '0': '/properties/youtube',
            },
            {
              '0': '/properties/tiktok',
            },
          ],
        },
        {
          title: 'Spam Protection',
          items: [
            {
              '0': '/properties/spamProtectionUser',
            },
            {
              '0': '/properties/spanProtectionComment',
            },
          ],
        },
      ],
    },
  ];
};

const dd = SiteSchema();
export type SiteModel = FromSchema<typeof dd>;

export const SiteRules = (): CollectionRule[] => {
  return [{ name: 'norule' }];
};
