import { FromSchema } from 'json-schema-to-ts';
import { FormViewSectionType } from '../types';
import { CollectionRule } from './collection-rule';
//

export interface CollectionUIGroup {
  title: string;
  description?: string;
  items?: { [key: string]: string }[];
  type?: string;
}
export interface CollectionUI {
  transition?: CollectionUITransitionModel
  type: FormViewSectionType;
  default?: boolean;
  title?: string;
  description?: string;
  collapsible?: boolean;
  popup?: 'none' | 'auto' | 'top' | 'right' | 'bottom' | 'left' | 'center' | 'dialog';
  items?: { [key: string]: string }[];
  accordion?: CollectionUIGroup[];
  tab?: CollectionUIGroup[];
  buttons?: {
    back?: { title: string; handler: () => {} };
    next?: { title: string; handler: () => {} };
    skip?: { title: string; handler: () => {} };
    finish?: { title: string; handler: () => {} };
  };
  rules?: {};
}


export const CollectionUIConfigSchema = () => {
  return {
    type: 'object',
    properties: {
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
        collapsible: true,
        fieldType: 'richtext',
      },
      hideHeading: {
        type: 'boolean',
      },
      collapsible: {
        type: 'boolean',
      },
      styleClass: {
        type: 'string',
        hidden: true,
      },
      icon: {
        type: 'string',
      },
      popup: {
        type: 'string',
        enum: ['auto', 'top', 'right', 'bottom', 'left', 'center', 'dialog'],
      },
      buttons: {
        type: 'array',
        items: buttonSchema()
      }
    },
  } as const;
};

const buttonSchema = (action = 'submit') => {
  return {
    type: 'object',
    collapsible: true,
    properties: {
      label: {
        type: 'string',
      },
      type: {
        type: 'string',
        enum: ['button', 'link'],
      },
      styleClass: {
        type: 'string',
      },
      icon: {
        type: 'string',
      },
      action: {
        type: 'string',
        enum: ['back', 'next', 'skip', 'cancel', 'submit', 'validate', 'script', 'link'],
        default: action,
      },
      script: {
        type: 'string',
        inputStyle: 'code',
      }
    }
  } as const
}


export const CollectionUITransitionSchema = () => {
  return {
    type: 'object',
    layout: 'horizontal',
    title: 'Transition',
    collapsible: true,
    properties: {
      type: {
        type: 'string',
        enum: ['slider', 'stepper'],
        displaySize: 'small'
      },
      direction: {
        type: 'string',
        enum: ['horizontal', 'vertical'],
        displaySize: 'small',
        hidden: true
      },
      effect: {
        type: 'string',
        enum: ['fade', 'flip', 'flipX', 'flipY', 'zoom', 'zoomX', 'zoomY', 'pop', 'popX', 'popY', 'none'],
        hidden: true,
        displaySize: 'small'
      },
      trigger: {
        type: 'string',
        enum: ['blur', 'click', 'hover', 'focus', 'manual', 'auto', 'none'],
        displaySize: 'small'
      },
    },
  } as const;
};

export const CollectionUITransitionRules = (): CollectionRule[] => {
  return [
    {
      name: 'Show Transition Direction',
      action: [
        {
          operation: 'show',
          targetField: ['/properties/direction', '/properties/effect'],
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: 'slider',
            field1: '/properties/type',
            operation: 'equal',
          },
        ],
      },
    },
  ];
};


const cos = CollectionUITransitionSchema();
export type CollectionUITransitionModel = FromSchema<typeof cos>;

const cosw = CollectionUIConfigSchema();
export type CollectionUIConfigModel = FromSchema<typeof cosw>;