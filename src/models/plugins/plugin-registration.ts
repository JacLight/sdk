import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const PluginRegistrationSchema = () => {
  return {
    type: 'object',
    properties: {
      // Identity
      name: {
        type: 'string',
        unique: true,
        minLength: 3,
        maxLength: 50,
        pattern: '^[a-z][a-z0-9_-]*$',
        description: 'Unique plugin identifier (lowercase, alphanumeric, hyphens, underscores)',
        group: 'identity',
      },
      displayName: {
        type: 'string',
        maxLength: 100,
        description: 'Human-readable plugin name',
        group: 'identity',
      },
      description: {
        type: 'string',
        'x-control': ControlType.richtext,
        description: 'Detailed description of what the plugin does',
      },
      version: {
        type: 'string',
        pattern: '^\\d+\\.\\d+\\.\\d+$',
        default: '1.0.0',
        description: 'Semantic version (e.g., 1.0.0)',
        group: 'identity',
      },

      // Source
      entryPoint: {
        type: 'string',
        description: 'URL to plugin JavaScript bundle',
        group: 'source',
      },
      integrity: {
        type: 'string',
        description: 'SRI hash for integrity verification (e.g., sha384-...)',
        group: 'source',
      },

      // Initialization
      initFunction: {
        type: 'string',
        default: 'init',
        description: 'Global function to call on load (e.g., "MyPlugin.init")',
        group: 'init',
      },
      config: {
        type: 'object',
        description: 'Configuration passed to init function',
        'x-control': ControlType.code,
        group: 'init',
      },

      // Lifecycle
      status: {
        type: 'string',
        enum: ['draft', 'active', 'disabled', 'deprecated'],
        default: 'draft',
        description: 'Plugin lifecycle status',
        group: 'lifecycle',
      },

      // Permissions
      permissions: {
        type: 'array',
        description: 'Data access permissions granted to the plugin',
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
        group: 'permissions',
      },
      allowedEndpoints: {
        type: 'array',
        description: 'Explicit API endpoints plugin can access',
        items: { type: 'string' },
        group: 'permissions',
      },

      // UI
      mountPoint: {
        type: 'string',
        enum: ['inline', 'modal', 'drawer', 'fullscreen'],
        default: 'inline',
        description: 'How the plugin UI is displayed',
        group: 'ui',
      },
      containerStyle: {
        type: 'object',
        description: 'CSS styles for the plugin container',
        'x-control': ControlType.code,
        group: 'ui',
      },

      // Metadata
      author: {
        type: 'string',
        description: 'Plugin author or organization',
        group: 'metadata',
      },
      homepage: {
        type: 'string',
        format: 'uri',
        description: 'Plugin homepage or documentation URL',
        group: 'metadata',
      },
      icon: {
        type: 'string',
        'x-control': ControlType.file,
        description: 'Plugin icon image',
        group: 'metadata',
      },
      tags: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        items: { type: 'string' },
        description: 'Tags for categorization and discovery',
        group: 'metadata',
      },
    },
    required: ['name', 'entryPoint'],
  } as const;
};

const schema = PluginRegistrationSchema();
export type PluginRegistrationModel = FromSchema<typeof schema>;

registerCollection('Plugin Registration', DataType.plugin_registration, PluginRegistrationSchema());
