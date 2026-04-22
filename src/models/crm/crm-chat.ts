import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';

import { ControlType, DataType } from '../../types';
import { UserSchema } from '../user';
import { FileInfoSchema } from '../file-info';

export const ChatMessageSchema = () => {
  return {
    type: 'object',
    properties: {
      content: {
        type: 'string',
      },
      chatId: {
        type: 'string',
      },
      from: {
        type: 'string',
      },
      to: {
        type: 'string',
      },
      files: {
        type: 'array',
      },
      status: {
        type: 'string',
      },
      type: {
        type: 'string',
      },
      sentTime: {
        type: 'number',
      },
      deliveredTime: {
        type: 'number',
      },
      readTime: {
        type: 'number',
      },
      user: {
        ...UserSchema(),
        hidden: true,
      },
      configId: {
        type: 'string',
        hidden: true,
      },
    },
  } as const;
};

export const ChatGroupSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      admins: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      emails: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      users: {
        type: 'array',
        items: UserSchema(),
      },
      status: {
        type: 'string',
      },
    },
  } as const;
};

export const ChatConfigSchema = () => {
  return {
    type: 'object',
    hideLabel: true,
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 200,
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['uri', 'lowercase'],
        group: 'basic',
      },
      description: {
        type: 'string',
        maxLength: 1000,
        'x-control-variant': 'textarea',
        description: 'Campaign description',
      },
      template: {
        type: 'string',
        enum: ['default', 'modern', 'minimal', 'qa'],
      },
      defaultPath: {
        type: 'string',
        dataSource: {
          source: 'json',
          json: [
            { label: 'Welcome', value: '/' },
            { label: 'Form', value: '/register' },
            { label: 'Chat', value: '/chat' },
            { label: 'Chat with AI', value: '/chat-ai' },
            { label: 'Chat with Agent', value: '/chat-agent' },
          ],
        },
      },
      logo: {
        ...FileInfoSchema(),
        collapsible: true,
      },
      headerContent: {
        type: 'string',
        collapsible: true,
        'x-control': ControlType.richtext,
      },
      chatBubblePosition: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'json',
          json: ['left', 'right'],
        },
        group: 'bubble',
      },
      status: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'json',
          json: ['online', 'offline'],
        },
        group: 'bubble',
      },
      chatOpeners: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'string',
          'x-control-variant': 'textarea',
          displayStyle: 'outlined',
          rows: 3,
        },
      },
      offline: {
        type: 'object',
        collapsible: true,
        properties: {
          showForm: {
            type: 'boolean',
            default: true,
          },
          message: {
            type: 'string',
            'x-control-variant': 'textarea',
            row: 3,
          },
        },
      },
      allowAttachments: {
        type: 'boolean',
        default: true,
        group: 'allow',
      },
      allowEmojis: {
        type: 'boolean',
        default: true,
        group: 'allow',
      },
      showAgents: {
        type: 'boolean',
        group: 'randomize',
      },
      registrationRequired: {
        type: 'boolean',
        default: false,
        group: 'randomize',
      },
      registrationFields: {
        type: 'object',
        collapsible: true,
        layout: 'horizontal',
        properties: {
          name: {
            type: 'boolean',
            default: false,
          },
          email: {
            type: 'boolean',
            default: false,
          },
          phone: {
            type: 'boolean',
            default: false,
          },
          comments: {
            type: 'boolean',
            default: false,
          },
        },
        rules: [
          {
            operation: 'isFalsy',
            valueA: '{{registrationRequired}}',
            action: 'hide',
          },
        ],
      },
      availability: {
        type: 'object',
        collapsible: true,
        properties: {
          allTimes: {
            type: 'boolean',
            title: 'Chat available 24/7',
            default: true,
          },
          workDays: {
            type: 'array',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            items: {
              type: 'string',
            },
            dataSource: {
              source: 'json',
              json: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
              ],
            },
          },
        },
      },
      ai: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.ai_assistant,
          label: 'name',
          value: 'name',
        },
        displayStyle: 'outlined',
      },
      automation: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.automation,
          label: 'name',
          value: 'name',
        },
        displayStyle: 'outlined',
      },
      agents: {
        type: 'array',
        items: {
          type: 'object',
          collapsible: true,
          properties: {
            user: {
              type: 'string',
              'x-control': ControlType.selectMany,
              dataSource: {
                source: 'collection',
                collection: DataType.user,
                label: ['email', 'firstName', 'lastName'],
                value: 'email',
              },
            },
            avatar: FileInfoSchema(),
            screenName: {
              type: 'string',
            },
            tagLine: {
              type: 'string',
            },
          },
        },
      },
      broadcast: {
        type: 'object',
        collapsible: true,
        title: 'Broadcast Settings',
        properties: {
          position: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'json',
              json: ['bottom-left', 'bottom-right', 'top-left', 'top-right'],
            },
            default: 'bottom-right',
          },
          defaultWidth: {
            type: 'number',
            default: 320,
            minimum: 200,
            maximum: 800,
          },
          defaultHeight: {
            type: 'number',
            default: 240,
            minimum: 150,
            maximum: 600,
          },
          autoPlay: {
            type: 'boolean',
            default: true,
            description: 'Auto-show broadcast when agent starts streaming',
          },
          muted: {
            type: 'boolean',
            default: false,
            description: 'Start broadcast muted',
          },
          resizable: {
            type: 'boolean',
            default: true,
          },
          closable: {
            type: 'boolean',
            default: true,
            description: 'Allow viewers to close the broadcast window',
          },
          reopenable: {
            type: 'boolean',
            default: true,
            description: 'Show a button to reopen after closing',
          },
        },
      },
    },
  } as const;
};

const cms = ChatMessageSchema();
export type ChatMessageModel = FromSchema<typeof cms>;

const ccs = ChatGroupSchema();
export type ChatGroupModel = FromSchema<typeof ccs>;

const cfs = ChatConfigSchema();
export type ChatConfigSchemaModel = FromSchema<typeof cfs>;

registerCollection('Chat Config', DataType.chat_config, ChatConfigSchema());
registerCollection('Chat Message', DataType.chat_message, ChatMessageSchema());
