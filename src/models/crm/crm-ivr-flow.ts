import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/**
 * IVR Flow Schema
 *
 * An IVR flow is a pointer to an automation workflow that contains IVR-specific actions.
 * This allows complex multi-step IVR flows using the automation infrastructure.
 */
export const IVRFlowSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['random-string::10'],
        group: 'name',
        unique: true,
      },
      displayName: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        title: 'IVR Flow Name',
        group: 'identity',
      },
      description: {
        type: 'string',
        maxLength: 500,
        title: 'Description',
        group: 'identity',
        'x-control-variant': 'textarea',
      },

      // Automation Workflow Reference
      automationId: {
        type: 'string',
        title: 'Automation Workflow ID',
        description: 'The automation workflow that contains IVR actions',
        group: 'workflow',
      },

      // IVR-Specific Settings
      settings: {
        type: 'object',
        title: 'IVR Settings',
        group: 'settings',
        properties: {
          defaultLanguage: {
            type: 'string',
            enum: ['en-US', 'en-GB', 'es-ES', 'es-MX', 'fr-FR', 'de-DE', 'it-IT', 'pt-BR', 'ja-JP', 'zh-CN'],
            title: 'Default Language',
            default: 'en-US',
          },
          defaultVoice: {
            type: 'string',
            title: 'Default Voice',
            description: 'Polly voice (e.g., Polly.Joanna, Polly.Matthew)',
            default: 'Polly.Joanna',
          },
          recordCalls: {
            type: 'boolean',
            title: 'Record Calls',
            default: true,
          },
          maxInputAttempts: {
            type: 'integer',
            minimum: 1,
            maximum: 10,
            title: 'Max Input Attempts',
            description: 'Maximum attempts for collecting user input',
            default: 3,
          },
          inputTimeout: {
            type: 'integer',
            minimum: 1,
            maximum: 60,
            title: 'Input Timeout (seconds)',
            default: 5,
          },
        },
      },

      // Status
      enabled: {
        type: 'boolean',
        title: 'Enabled',
        group: 'settings',
        default: true,
      },
      tags: {
        type: 'array',
        title: 'Tags',
        group: 'metadata',
        'x-control-variant': 'chip',
        items: {
          type: 'string',
        },
      },

      // Usage Stats
      stats: {
        type: 'object',
        title: 'Usage Statistics',
        group: 'stats',
        properties: {
          totalCalls: {
            type: 'integer',
            title: 'Total Calls',
            default: 0,
          },
          lastUsed: {
            type: 'string',
            format: 'date-time',
            title: 'Last Used',
          },
          averageDuration: {
            type: 'number',
            title: 'Average Call Duration (seconds)',
          },
          completionRate: {
            type: 'number',
            title: 'Completion Rate',
            description: 'Percentage of calls that complete successfully',
          },
        },
      },
    },
    required: ['name', 'displayName', 'automationId', 'enabled'],
  } as const;
};

const ivrFlowSchema = IVRFlowSchema();
export type IVRFlowModel = FromSchema<typeof ivrFlowSchema>;

registerCollection('ivrFlow', DataType.ivr_flow, IVRFlowSchema());
