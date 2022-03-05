import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule, CollectionUI } from './collection';

export const NavigationSchema = () => {
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
      slug: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
      },
      description: {
        type: 'string',
        inputStyle: 'textarea',
      },
      links: {
        type: 'array',
        hidden: 'true',
        items: {
          type: 'object',
          properties: {
            linktype: {
              type: 'string',
              enum: ['page', 'widget', 'url', 'script'], //use of page filter liket category or tags
            },
            title: {
              type: 'string',
            },
            slug: {
              type: 'string',
              pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
            },
            data: {
              type: 'string',
            },
            image: {
              type: 'string',
            },
            links: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
      },
    },
  } as const;
};

export const NavigationLinkSchema = () => {
  return {
    type: 'object',
    properties: {
      linktype: {
        type: 'string',
        enum: ['page', 'widget', 'url', 'script'], //use of page filter liket category or tags
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      slug: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
      },
      data: {
        type: 'string',
      },
      image: {
        type: 'string',
      },
      links: {
        type: 'array',
        hidden: 'true',
        items: {
          type: 'object',
        },
      },
    },
    required: ['title', 'slug'],
  } as const;
};

const rtlink = NavigationLinkSchema();
const rt = NavigationSchema();
export type NavigationLinkModel = FromSchema<typeof rtlink>;
export type NavigationModel = FromSchema<typeof rt>;
export const NavigationUI = (): CollectionUI[] => {
  return null;
};

export const NavigationRules = (): CollectionRule[] => {
  return null;
};
