import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '@models/file-info';

export const ClientAppSchema = () => {
  return {
    type: 'object',
    properties: {
      // Identity - row 1
      name: {
        type: 'string',
        unique: true,
        minLength: 3,
        maxLength: 50,
        pattern: '^[a-z][a-z0-9_-]*$',
        description:
          'Unique app identifier (lowercase, alphanumeric, hyphens, underscores)',
        group: 'name',
      },
      displayName: {
        type: 'string',
        maxLength: 100,
        description: 'Human-readable app name',
        group: 'name',
      },

      // Version & Status - row 2
      version: {
        type: 'string',
        pattern: '^\\d+\\.\\d+\\.\\d+$',
        default: '1.0.0',
        description: 'Semantic version (e.g., 1.0.0)',
        group: 'version',
      },
      status: {
        type: 'string',
        enum: ['draft', 'active', 'disabled', 'deprecated'],
        default: 'draft',
        description: 'App lifecycle status',
        group: 'version',
      },

      // Description - standalone (richtext)
      description: {
        type: 'string',
        'x-control': ControlType.richtext,
        description: 'Detailed description of what the app does',
      },

      // Source - row 3
      entryPoint: {
        type: 'string',
        description: 'URL to app JavaScript bundle',
        group: 'source',
      },
      sourceFile: FileInfoSchema(),
      integrity: {
        type: 'string',
        description: 'SRI hash for integrity verification (e.g., sha384-...)',
      },
      initFunction: {
        type: 'string',
        default: 'init',
        description: 'Global function to call on load (e.g., "MyApp.init")',
        group: 'init',
      },
      mountPoint: {
        type: 'string',
        enum: ['inline', 'modal', 'drawer', 'fullscreen'],
        default: 'inline',
        description: 'How the app UI is displayed',
        group: 'init',
      },
      config: {
        type: 'object',
        description: 'Configuration passed to init function',
        'x-control': ControlType.code,
      },
      permissions: {
        type: 'array',
        description: 'Data access permissions granted to the app',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        items: {
          type: 'string',
          enum: [
            'read:products',
            'read:orders',
            'write:orders',
            'read:customers',
            'write:customers',
            'read:inventory',
            'write:inventory',
          ],
        },
      },
      allowedEndpoints: {
        type: 'array',
        description: 'Explicit API endpoints app can access',
        items: { type: 'string' },
      },
      containerStyle: {
        type: 'object',
        description: 'CSS styles for the app container',
        'x-control': ControlType.code,
      },

      // Author & Homepage - row 5
      author: {
        type: 'string',
        description: 'App author or organization',
        group: 'author',
      },
      homepage: {
        type: 'string',
        format: 'uri',
        description: 'App homepage or documentation URL',
        group: 'author',
      },

      // Icon - standalone (file upload)
      icon: {
        type: 'string',
        'x-control': ControlType.file,
        description: 'App icon image',
      },

      // Tags - standalone (array)
      tags: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        items: { type: 'string' },
        description: 'Tags for categorization and discovery',
      },
    },
    required: ['name'],
  } as const;
};

const schema = ClientAppSchema();
export type ClientAppModel = FromSchema<typeof schema>;

registerCollection('Client App', DataType.client_app, ClientAppSchema());
