import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';

/**
 * One record per email in the shared org: the orgs where that email is a user.
 * Each org keeps its own database, so this is the only way to answer "which
 * workspaces can I sign into" without walking every org. Written on sign-up,
 * invitation completion and every sign-in; read only by the server, which
 * answers by email, never on screen.
 */
export const AccountDirectorySchema = () => {
  return {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        unique: true,
      },
      orgs: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            orgId: { type: 'string' },
            displayName: { type: 'string' },
            lastSeen: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    required: ['email'],
  } as const;
};

const dd = AccountDirectorySchema();
export type AccountDirectoryModel = FromSchema<typeof dd>;

registerCollection('Account Directory', DataType.account_directory, AccountDirectorySchema());
